import BasicEditForm from "@/components/Admin/BasicEditForm";
import SEOEditForm from "@/components/Admin/SEOEditForm";
import Sidebar from "@/components/Admin/Sidebar";
import { useArticlesStore } from "@/lib/store/articles.store";
import { Articles, Languages } from "@prisma/client";
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
  const [mdxString, setMdxString] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState(["", "", ""])
  const [currLanguage, setCurrLanguage] = useState<Languages | null>(null);
  const [languages, setLanguages] = useState<Languages[] | null>(null);
  const { data: session } = useSession()



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

  const handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void = (e) => {
    const { name, value } = e.target;

    setArticle((prev) => {
      if (!prev) return prev; // Ensure the previous state exists
      return { ...prev, [name]: value };
    });
  };


  const updateArticle = async () => {
    setLoading(true);

    const payload = {
      ...article,
      tags,
      mdxString: mdxString || "",
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
    const fetchArticles = async () => {
      const res = await fetch(`/api/article?id=${id}`);
      const data = await res.json();
      setArticle(data);
      setMdxString(data.mdxString);
      setTags(data.tags);
    };

    if (id) fetchArticles();
  }, [id]);

  // Fetch users from API
  const fetchLanguages = async () => {
    const res = await fetch('/api/languages')
    const data = await res.json()
    setLanguages(data)
    setCurrLanguage(data[0])
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

  useEffect(() => {
    if (article) {
      const a = { ...article, mdxString: mdxString || "" }
      setArticle(a)
    }
  }, [mdxString])


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
                  images={images}
                  setImages={setImages}
                  article={article}
                  loading={loading}
                  handleChange={handleChange}
                  setMdxString={setMdxString}
                  mdxString={mdxString}
                  handleSave={updateArticle}
                />
              ) : (
                <SEOEditForm
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
