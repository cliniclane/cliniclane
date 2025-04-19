import BasicEditForm from "@/components/Admin/BasicEditForm";
import SEOEditForm from "@/components/Admin/SEOEditForm";
import Sidebar from "@/components/Admin/Sidebar";
import { useArticlesStore } from "@/lib/store/articles.store";
import { Articles, Languages, Translations } from "@prisma/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";



const EditArticle = () => {
  const router = useRouter();
  const { id, tab } = router.query;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(tab as string);

  const tabs = [
    { name: "basic", disabled: false },
    { name: "SEO", disabled: false },
  ];

  const [article, setArticle] = useState<Articles | null>(null);
  const { setArticles } = useArticlesStore()
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState(["", "", ""])
  const [currLanguage, setCurrLanguage] = useState<Languages | null>(null);
  const [languages, setLanguages] = useState<Languages[] | null>(null);
  const { data: session } = useSession()
  const [translatedContent, setTranslatedContent] = useState<Translations | undefined>(undefined);



  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /**
   * Handle text, select, and textarea inputs.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
   * The event object.
   */
  const handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void = (e) => {
    const { name, value } = e.target;

    setArticle((prev) => {
      if (!prev) return prev; // Ensure the previous state exists
      return { ...prev, [name]: value };
    });
  };

  const handleMdxStringChange = (value: string | undefined) => {
    if (translatedContent) {
      setTranslatedContent((prev) => {
        if (!prev) return prev; // Ensure the previous state exists
        return { ...prev, mdxString: value || "" }; // Ensure mdxString is always a string
      });
      setArticle((prev) => {
        if (!prev) return prev; // Ensure the previous state exists
        return { ...prev, translations: prev.translations.map((t) => t.language === currLanguage?.code ? { ...t, mdxString: value || "" } : t) };
      })
    }
    else {
      setArticle((prev) => {
        if (!prev) return prev; // Ensure the previous state exists
        return { ...prev, mdxString: value || "" }; // Ensure mdxString is always a string
      });
    }
  };

  const handleTranslatedContentChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void = (e) => {
    const { name, value } = e.target;

    setArticle((prev) => {
      if (!prev || !currLanguage?.code) return prev; // Ensure state and language exist

      const translationExists = prev.translations.some(t => t.language === currLanguage.code);

      // Update if exists, otherwise add new language
      const updatedTranslations = translationExists
        ? prev.translations.map((t) =>
          t.language === currLanguage.code
            ? { ...t, [name]: value } as Translations // Ensure type compatibility
            : t
        )
        : [
          ...prev.translations,
          {
            language: currLanguage.code,
            title: "",
            description: "",
            mdxString: "",
            blogTitles: [""],
            openGraphTitle: null,
            openGraphDescription: null,
            [name]: value,
          } as Translations, // Ensure type compatibility
        ];

      return {
        ...prev,
        translations: updatedTranslations,
      };
    });

    setTranslatedContent((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: name === "mdxString" ? value || "" : value };
    });
  };


  const updateArticle = async () => {
    setLoading(true);

    // check if any of the translations is empty and toast error
    if (article && article.translations && article.translations.length > 0) {
      const hasEmptyTranslation = article.translations.some((t) => t.title === "" || t.description === "" || t.mdxString === "");
      if (hasEmptyTranslation) {
        setLoading(false);
        toast.error(`Please fill in all fields for ${currLanguage?.name}`);
        return;
      }
    }

    const payload = {
      ...article,
      tags,
    };

    const res = await fetch(`/api/article`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    const data = await res.json();

    if (res.status === 201) {
      toast.success("Article updated successfully");
      // Update the articles state in the store
      setArticles((prev) => {
        if (!prev) return prev; // Ensure the previous state exists
        return prev.map((article: Articles) => {
          if (article.id === data.id) {
            return { ...article, ...data };
          }
          return article;
        });
      });
      // Redirect to the admin page after a short delay
      setTimeout(() => {
        router.push("/admin");
      }, 400);
    } else {
      toast.error(data.error);
    }
  };

  useEffect(() => {
    if (article && article.translations && currLanguage && currLanguage.code !== "english" && article.translations.length > 0) {
      const translations = article.translations.find(t => t.language === currLanguage.code);
      if (translations) {
        setTranslatedContent(translations);
      } else {
        setTranslatedContent({
          title: "",
          description: "",
          mdxString: "",
          tags: [""],
          blogTitles: [""],
          language: currLanguage?.code || "",
          openGraphDescription: "",
          openGraphTitle: ""
        })
      }
    }
    else {
      setTranslatedContent(undefined)
    }
  }, [currLanguage])

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch(`/api/article?id=${id}`);
      const data = await res.json();
      setArticle(data);
      setTags(data.tags);
    };

    if (id) fetchArticles();
  }, [id]);

  // Fetch users from API
  const fetchLanguages = async () => {
    const res = await fetch('/api/languages');
    const allLanguages = await res.json()
    if (session && session.user.role === "super_admin") {
      setLanguages(allLanguages)
      setCurrLanguage(allLanguages[0])
    }
    else {
      const res = await fetch('/api/languages/user?email=' + session?.user.email, {
        method: 'GET',
      })
      let data = await res.json()
      data = data.map((l: string) => l.toLowerCase())
      const sortedLanguages = allLanguages.filter((l: Languages) => data.includes(l.code))
      setCurrLanguage(sortedLanguages[0])
      // select only languages that the user has access to
      setLanguages(sortedLanguages)
    }
  }

  useEffect(() => {
    if (!languages && session) {
      fetchLanguages()
    }
  }, [languages, session]);

  useEffect(() => {
    if (tab && !activeTab) setActiveTab(tab as string);
    if (!router.query.tab && id)
      router.push(`/admin/article/edit/${id}?tab=basic`);
  }, [tab, id]);

  useEffect(() => {
    if (article) {
      const a = { ...article, images }
      setArticle(a)
    }
  }, [images])

  return (
    <div className="flex">
      <Sidebar selected="articles" />
      <div className="md:pl-32 flex mt-16 md:mt-0 flex-col w-full">
        {/* Tabs */}
        <div className="font-medium w-full text-center text-gray-500 border-b border-gray-200 md:pl-20 md:pr-12">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <li key={tab.name} className="me-2">
                <button
                  onClick={() => {
                    setActiveTab(tab.name);
                    router.push(`/admin/article/edit/${id}?tab=${tab.name}`);
                  }}
                  className={`inline-block capitalize p-4 border-b-2 rounded-t-lg ${tab.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : activeTab === tab.name
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                    }`}
                  disabled={tab.disabled}
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>


        {/* Tab Content */}
        {article && (
          <div className="flex flex-col w-full px-6 md:pl-20 md:pr-12 py-5 pb-36">
            <div className="flex items-center justify-between w-full">

              <p className="text-2xl font-medium underline text-gray-500">Edit</p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="capitalize">{currLanguage?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages?.map((loc) => (
                    <DropdownMenuItem
                      key={loc.code}
                      onClick={() => setCurrLanguage(loc)}
                      className="capitalize"
                    >
                      {loc.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            <div className="w-full">
              {activeTab === "basic" ? (
                <BasicEditForm
                  handleMdxStringChange={handleMdxStringChange}
                  handleTranslatedContentChange={handleTranslatedContentChange}
                  images={images}
                  setImages={setImages}
                  article={article}
                  translatedContent={translatedContent}
                  loading={loading}
                  handleChange={handleChange}
                  handleSave={updateArticle}
                />
              ) : (
                <SEOEditForm
                  handleTranslatedContentChange={handleTranslatedContentChange}
                  translatedContent={translatedContent}
                  article={article}
                  tags={tags}
                  loading={loading}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  addTag={addTag}
                  removeTag={removeTag}
                  handleChange={handleChange}
                  handleSave={updateArticle}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div >
  );
};

export default EditArticle;
