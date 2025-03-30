import BasicEditForm from "@/components/Admin/BasicEditForm";
import SEOEditForm from "@/components/Admin/SEOEditForm";
import Sidebar from "@/components/Admin/Sidebar";
import { Articles } from "@prisma/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const newArticle = {
  id: "",
  author: "",
  publishDate: "",
  title: "",
  description: "",
  tags: [],
  language: "",
  mdxString: `#Heading`,
  slug: "",
  headerImage: "",
  openGraphTitle: "",
  openGraphDescription: "",
  openGraphImage: "",
  canonical: "",
};

const NewArticle = () => {
  const router = useRouter();
  const { tab } = router.query;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(tab as string);

  const tabs = [
    { name: "basic", disabled: false },
    { name: "SEO", disabled: false },
  ];

  const [article, setArticle] = useState<Articles | null>(newArticle);
  const [mdxString, setMdxString] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setArticle((prev) => {
      if (!prev) return prev; // Ensure the previous state exists
      return { ...prev, [name]: value };
    });
  };

  const updateArticle = async () => {
    setLoading(true);

    const newID = uuidv4();

    if (!article?.slug) {
      toast.error("Slug is required");
      setLoading(false);
      return;
    }

    const payload = {
      ...article,
      tags,
      mdxString: mdxString || "",
      publishDate: new Date().toISOString(),
      id: newID,
    };

    const res = await fetch(`/api/article`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    const data = await res.json();

    if (res.status === 201) {
      toast.success("Article created successfully");
      setTimeout(() => {
        router.push("/admin");
      }, 400);
    } else {
      console.log(data);
      toast.error(data.error);
    }
  };

  useEffect(() => {
    if (tab && !activeTab) setActiveTab(tab as string);
    if (!router.query.tab) router.push(`/admin/article/new?tab=basic`);
  }, [tab]);

  return (
    <div className="flex">
      <Sidebar selected="articles" />
      <div className="md:pl-52 flex mt-16 md:mt-0 flex-col w-full">
        {/* Tabs */}
        <div className="font-medium w-full text-center text-gray-500 border-b border-gray-200 md:px-20">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <li key={tab.name} className="me-2">
                <button
                  onClick={() => {
                    setActiveTab(tab.name);
                    router.push(`/admin/article/new?tab=${tab.name}`);
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
          <div className="flex flex-col w-full px-6 md:px-20 py-5 pb-36">
            <p className="text-2xl font-medium underline text-gray-500">New</p>

            <div className="w-full">
              {activeTab === "basic" ? (
                <BasicEditForm
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
    </div>
  );
};

export default NewArticle;
