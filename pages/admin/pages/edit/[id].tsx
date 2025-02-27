import PageEditForm from "@/components/Admin/PageEditForm";
import Sidebar from "@/components/Admin/Sidebar";
import { PagesContent } from "@prisma/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EditPages = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState<PagesContent | null>(null);
  const [mdxString, setMdxString] = useState<string | undefined>(undefined);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setPageData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const updatePage = async () => {
    if (!pageData) return;

    setLoading(true);

    try {
      const payload = {
        ...pageData,
        mdxContent: mdxString || "",
        mainSlug: id,
      };

      const res = await fetch(`/api/pageContent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Page updated successfully");
        setTimeout(() => router.push("/admin/pages"), 400);
      } else {
        throw new Error("Failed to update page");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/pageContent?slug=${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data: PagesContent = await res.json();
        console.log(data);
        setPageData(data);
        setMdxString(data.mdxContent);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching page data");
      }
    };

    if (id && !pageData) fetchPageData();
  }, [id]);

  return (
    <div className="flex">
      <Sidebar selected="pages" />
      <div className="md:pl-52 flex mt-16 md:mt-0 flex-col w-full">
        {/* Tab Content */}
        {pageData ? (
          <div className="flex flex-col w-full px-6 md:px-20 py-5 pb-36">
            <p className="text-2xl font-medium underline text-gray-500">Edit</p>

            <div className="w-full">
              <PageEditForm
                handleChange={handleChange}
                handleSave={updatePage}
                loading={loading}
                mdxString={mdxString}
                pageData={pageData}
                setMdxString={setMdxString}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default EditPages;
