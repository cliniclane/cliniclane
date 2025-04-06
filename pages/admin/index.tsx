import Sidebar from "@/components/Admin/Sidebar";
import { Articles as IArticles } from "@prisma/client";
import { useEffect, useState } from "react";
import TurndownService from 'turndown';
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import ArticleTable from "@/components/Admin/ArticlesTable";
import { useArticlesStore } from "@/lib/store/articles.store";

export default function Articles() {
  const { articles, setArticles } = useArticlesStore()
  const { data: session, status } = useSession()
  const [extractedData, setExtractedData] = useState<IArticles[] | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user.email || !session.user.role || !session.user.image) signOut()
    }
  }, [status, session, articles]);

  const turndownService = new TurndownService();


  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')       // Remove special characters except space and hyphen
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/-+/g, '-');           // Replace multiple hyphens with a single one
  };

  const formatSpecialContent = (md: string): string => {
    // Step 0: Remove existing * list markers to avoid tree nesting
    md = md.replace(/^\s*\*\s+/gm, '');

    // Step 1: Replace array-like strings anywhere in content
    md = md.replace(/\['([^']+?)'(?:,\s*'([^']+?)')+\]/g, (match) => {
      try {
        // Convert to real array format
        const cleaned = match.replace(/'/g, '"');
        const arr = JSON.parse(cleaned);
        if (Array.isArray(arr)) {
          return arr.map((item) => `- ${item}`).join('\n');
        }
      } catch {
        return match;
      }
      return match;
    });

    // Step 2: Convert stringified objects to list items
    md = md.replace(/{[^{}]+}/g, (match) => {
      try {
        const normalized = match
          .replace(/(['"])?([a-zA-Z0-9_ ]+)\1\s*:/g, '"$2":')
          .replace(/'/g, '"');
        const obj = JSON.parse(normalized);
        if (typeof obj === 'object' && obj !== null) {
          return Object.entries(obj)
            .map(([key, value]) => `- **${key}**: ${value}`)
            .join('\n');
        }
      } catch {
        // Return the original match as a fallback
        return match;
      }
      // Ensure a string is always returned
      return match;
    });

    return md;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rawData = JSON.parse(text);

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
      metadata: {
        dateDownloaded: string;
        probability: number;
        _type: string;
      };
    }

    const formatted: IArticles[] = rawData.map((item: RawArticle) => ({
      id: Math.random().toString(36).substring(2, 15),
      title: item.headline,
      slug: generateSlug(item.headline),
      tags: [],
      description: item.description || "",
      author: item.authors[0].name || "",
      language: item.inLanguage || "english",
      headerImage: "",
      publishDate: new Date().toISOString(),
      mdxString: formatSpecialContent(turndownService.turndown(item.articleBodyHtml)) || "",
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
