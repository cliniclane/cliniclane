import Sidebar from "@/components/Admin/Sidebar";
import { Articles as IArticles } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import ArticleTable from "@/components/Admin/ArticlesTable";
import { useArticlesStore } from "@/lib/store/articles.store";

type RawArticle = {
  headline: string;
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
    substitutes: string; // Can be parsed into object[]
    prescriptionRequired: string;
    uses: string[]; // stringified arrays
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

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user.email || !session.user.role || !session.user.image) signOut()
    }
  }, [status, session, articles]);


  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')       // Remove special characters except space and hyphen
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/-+/g, '-');           // Replace multiple hyphens with a single one
  };

  function generateMarkdown(article: RawArticle): string {
    const { description, productDetails } = article;
    const pd = productDetails;

    const parseStringArray = (input: string): string[] => {
      try {
        const fixed = input.replace(/'/g, '"');
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const parseObject = (input: string): Record<string, { Status: string; Details: string }> => {
      try {
        return JSON.parse(input.replace(/'/g, '"'));
      } catch {
        return {};
      }
    };

    const safetyAdviceObj = parseObject(pd.safetyAdvice);
    const benefits = parseObject(pd.benefits);
    const uses = parseStringArray(pd.uses[0] || "[]");

    const markdown = `
  ## 💊 Product Details
  - **💰 Price:** ${pd.price}
  - **🧪 Salt Composition:** ${pd.saltComposition}
  - **📦 Storage:** ${pd.storage}
  - **📋 Prescription Required:** Yes
  
  ---
  
  ## 📝 Description
  ${description}
  
  ## ⚙️ How It Works
  ${pd.howItWorks}
  
  ## 🎯 Uses
  ${uses.map((item, i) => `${i + 1}. ${item}`).join('\n')}
  
  ## 📥 How to Use
  ${pd.howToUse}
  
  ## ⚠️ Common Side Effects
  ${pd.commonSideEffects.filter(Boolean).map(effect => `- ${effect}`).join('\n')}
  
  ## 🛡️ Safety Advice
  ${Object.entries(safetyAdviceObj)
        .map(([key, val]) => `### 🧷 ${key}\n- **Status:** ${val.Status}\n- **Details:** ${val.Details}`)
        .join('\n\n')}
  
  ## ⏱️ Missed Dosage
  ${pd.missedDosage}
  
  ## 💡 Quick Tips
  ${pd.quickTips.filter(Boolean).map(tip => `- ${tip}`).join('\n')}
  
  ## 🌟 Benefits
  ${Object.entries(benefits)
        .map(([key, val]) => `### ✅ ${key}\n${val}`)
        .join('\n\n')}
  
  ## ❓ FAQs
  ${pd.faqs}
  
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
      slug: generateSlug(item.headline),
      tags: item.productDetails.commonSideEffects,
      description: item.description || "",
      author: "",
      language: item.inLanguage || "english",
      headerImage: item.productDetails.imageUrls[0] || "",
      publishDate: new Date().toISOString(),
      mdxString: generateMarkdown(item),
      canonical: item.canonicalUrl || "",
      openGraphImage: item.productDetails.imageUrls[0] || "",
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

    // Map through the languages and set the name value 
    const languages = [
      { code: "en", name: "english" },
      { code: "es", name: "spanish" },
      { code: "fr", name: "french" },
      { code: "de", name: "german" },
      { code: "it", name: "italian" },
      { code: "pt", name: "portuguese" },
    ];

    formatted.forEach((item) => {
      const lang = languages.find((lang) => lang.code === item.language);
      if (lang) {
        item.language = lang.name;
      } else {
        item.language = "english"; // Default to English if not found
      }
    });

    setExtractedData(formatted);

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
        {articles && <ArticleTable setExtractedData={setExtractedData} extractedData={extractedData} handleOnFileChange={handleFileChange} data={articles} setData={setArticles} />}
      </div>
    </div>
  );
}
