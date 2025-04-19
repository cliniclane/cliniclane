import Sidebar from "@/components/Admin/Sidebar";
import { Articles as IArticles, Languages } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import ArticleTable from "@/components/Admin/ArticlesTable";
import { useArticlesStore } from "@/lib/store/articles.store";


type Substitute = {
  Name: string;
  URL: string;
  Manufacturer: string;
};

type RawArticle = {
  headline: string;
  slug: string;
  language: string;
  datePublished: string;
  datePublishedRaw: string;
  dateModified: string;
  dateModifiedRaw: string;
  authors: {
    name: string;
    nameRaw: string;
  }[];
  breadcrumbs: {
    name: string;
    url: string;
  }[];
  inLanguage: string;
  description: string;
  articleBody: string;
  articleBodyHtml: string;
  canonicalUrl: string;
  url: string;
  productDetails: {
    productUrl: string;
    productName: string;
    price: string;
    imageUrls: string[];
    saltComposition: string;
    storage: string;
    productIntroduction: string;
    howToUse: string;
    howItWorks: string;
    sideEffects: string;
    commonSideEffects: string[];
    safetyAdvice: string; // Can be parsed into a nested object
    missedDosage: string;
    quickTips: string[];
    factBox: string;
    userFeedback: string;
    faqs: string;
    substitutes: Substitute[]; // Can be parsed into object[]
    prescriptionRequired: string;
    uses: string; // stringified arrays
    benefits: string; // stringified object
  };
  metadata: {
    dateDownloaded: string;
    probability: number;
    _type: string;
  };
  isMdx: boolean;
}

export default function Articles() {
  const { articles, setArticles } = useArticlesStore()
  const { data: session, status } = useSession()
  const [extractedData, setExtractedData] = useState<IArticles[] | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<IArticles[]>([]);
  const [languages, setLanguages] = useState<Languages[] | null>(null);
  const [selectedImportLanguage, setSelectedImportLanguage] = useState<Languages | null>(null);

  const handleCheckboxChange = (article: IArticles) => {
    setSelectedArticles(
      selectedArticles.includes(article)
        ? selectedArticles.filter((a) => a !== article)
        : [...selectedArticles, article]

    )
  };


  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user.email || !session.user.role || !session.user.image) signOut()
    }
  }, [status, session, articles]);

  // Fetch users from API
  const fetchLanguages = async () => {
    const res = await fetch('/api/languages');
    const allLanguages = await res.json()
    if (session && session.user.role === "super_admin") {
      setLanguages(allLanguages)
    }
    else {
      const res = await fetch('/api/languages/user?email=' + session?.user.email, {
        method: 'GET',
      })
      let data = await res.json()
      data = data.map((l: string) => l.toLowerCase())
      const sortedLanguages = allLanguages.filter((l: Languages) => data.includes(l.code))
      // select only languages that the user has access to
      setLanguages(sortedLanguages)
    }
  }

  useEffect(() => {
    if (!languages && session) {
      fetchLanguages()
    }
  }, [languages, session]);

  function generateMarkdown(article: RawArticle): string {
    const { productDetails } = article;
    const pd = productDetails;

    // Parse the JSON string into objects
    const substitutes: Substitute[] = pd.substitutes

    function generateMarkdownFromRawObjectString(input: string): string {
      // Clean and format the string into valid JSON
      const cleaned = input
        .replace(/^{|}$/g, '') // Remove starting and ending braces
        .replace(/'([^']+)':/g, '"$1":') // Convert keys to valid JSON keys
        .replace(/: '([^']+)'/g, ': "$1"') // Convert values to valid JSON strings
        .replace(/\\n/g, '') // Optional: remove \n if present inside strings

      try {
        const validJson = `{${cleaned}}`;
        const data = JSON.parse(validJson) as Record<string, string>;

        return Object.entries(data)
          .map(([key, value]) => `- **${key}**: ${value}`)
          .join('\n\n');
      } catch (error) {
        console.error('Invalid object-like string format:', error);
        return '';
      }
    }

    const parseObject = (input: string): Record<string, { Status: string; Details: string }> => {
      try {
        return JSON.parse(input.replace(/'/g, '"'));
      } catch {
        return {};
      }
    };

    const benefits = parseObject(pd.benefits);
    const uses = pd.uses.split(', ');

    function formatFAQMarkdown(faqRaw: string): string {
      const lines = faqRaw.trim().split('\n');
      let formattedMarkdown = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('Q:')) {
          const question = line.replace(/^Q:\s*/, '');
          formattedMarkdown += `**Q: ${question}**\n`;
        } else if (line.startsWith('A:')) {
          const answer = line.replace(/^A:\s*/, '');
          formattedMarkdown += `\nA: ${answer}\n\n`;
        }
      }

      return formattedMarkdown.trim();
    }

    const markdown = `
  ## PRODUCT DETAILS
  - **🧪 Salt Composition:** ${pd.saltComposition}
  - **📦 Storage:** ${pd.storage}
  - **📋 Prescription Required:** Yes
  
  ---
  
  ## 📝 PRODUCT INTRODUCTION
  ${productDetails.productIntroduction}

  ---
  
  ## 🎯 USES
  ${uses.map((item, i) => `${i + 1}. ${item}`).join('\n')}

  <br />
  
  ## BENEFITS 
  ${Object.entries(benefits)
        .map(([key, val]) => `### ✅ ${key}\n${val}`)
        .join('\n\n')}

  ---
  
  ## ⚠️ SIDE EFFECTS 
  ${pd.sideEffects}

  ${pd.commonSideEffects.map((item, i) => `${i + 1}. ${item}`).join('\n')}
  
  ---
  
  ## 📥 HOW TO USE
  ${pd.howToUse}

  ---

  ## ⚙️ HOW IT WORKS
  ${pd.howItWorks}

  ---

  ## 🛡️ SAFETY ADVICE

  <br />
  ${generateMarkdownFromRawObjectString(pd.safetyAdvice)}

  ---
  
  ## ⏱️ WHAT IF YOU FORGET TO TAKE\n
  ${pd.missedDosage}

  ---
  
  ## 💡 QUICK TIPS
  ${pd.quickTips.filter(Boolean).map(tip => `- ${tip}`).join('\n')}
  
  ---

  ## ❓ FAQs
  ${formatFAQMarkdown(pd.faqs)}

  ---

  ## Substitutes:

  ${substitutes
        .map((sub, index) => {
          return `${index + 1}. [**${sub.Name}**](${sub.URL})  _Manufacturer: ${sub.Manufacturer}_\n`;
        })
        .join("\n")
      }

  `.trim();

    return markdown;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rawData = JSON.parse(text);

    const formatted: IArticles[] = rawData.map((item: RawArticle) => ({
      id: Math.random().toString(36).substring(2, 15),
      title: item.headline,
      slug: item.slug,
      tags: item.productDetails.commonSideEffects,
      description: item.description || "",
      author: session?.user.email,
      language: item.language || "english",
      headerImage: "",
      publishDate: new Date().toISOString(),
      images: [""],
      mdxString: generateMarkdown(item),
      canonical: item.canonicalUrl || "",
      openGraphImage: "",
      openGraphTitle: item.headline || "",
      openGraphDescription: item.description || "",
    }));

    // Check for duplicates
    const duplicateSlugs = formatted.map((item) => item.slug);

    const uniqueSlugs = new Set(duplicateSlugs);
    const hasDuplicates = duplicateSlugs.length !== uniqueSlugs.size;
    if (hasDuplicates) {
      toast.error("Duplicate slugs found in the imported articles.");
      return;
    }

    // Check for empty titles
    const emptyTitles = formatted.filter((item) => !item.title);
    if (emptyTitles.length) {
      toast.error("Found articles with empty titles. Please ensure all articles have a headline.");
      return;
    }

    // Set selected language
    setSelectedImportLanguage(
      languages?.find((language) => language.code === formatted[0].language) || null
    )

    setExtractedData(formatted);
    setSelectedArticles(formatted)

  };

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/article/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user.email })
      });
      const data = await res.json();
      setArticles(data);
    };
    if (session && !articles) {
      fetchArticles();
    }
  }, [session, articles]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar selected="articles" />

      {/* Content */}
      <div className="md:pl-48 py-6 px-4 sm:px-6 mt-10 md:mt-0 w-full">
        <div className="flex w-full justify-between">
          <span className="text-2xl font-medium underline text-gray-500">
            All Articles
          </span>
        </div>

        {/* Responsive Table */}
        {articles && <ArticleTable
          selectedImportLanguage={selectedImportLanguage}
          setSelectedImportLanguage={setSelectedImportLanguage}
          languages={languages}
          selectedArticles={selectedArticles}
          handleCheckboxChange={handleCheckboxChange}
          setExtractedData={setExtractedData} extractedData={extractedData} handleOnFileChange={handleFileChange} data={articles} setData={setArticles} />}
      </div>
    </div>
  );
}
