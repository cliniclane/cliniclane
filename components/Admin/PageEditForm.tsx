import React, { FC, useEffect, useState } from "react";
import MdxEditor from "./MDXEditor";
import { PagesContent } from "@prisma/client";
import { getCookie } from "cookies-next";

interface IProps {
  pageData: PagesContent;
  mdxString: string | undefined;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setMdxString: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSave: () => void;
  loading: boolean;
}

const PageEditForm: FC<IProps> = ({
  pageData,
  mdxString,
  handleChange,
  setMdxString,
  handleSave,
  loading,
}) => {
  const [theme, setTheme] = useState("github");

  useEffect(() => {
    const c = getCookie("editor-theme");
    if (c) setTheme(c as string);
  }, []);
  return (
    <div className="w-full pt-10">
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={pageData.title || ""}
          value={pageData?.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="slug"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          value={pageData?.slug || ""}
          onChange={handleChange}
        />
      </div>

      {/* Content Editor */}
      <div className="mb-6 h-[100vh]">
        <label
          htmlFor="content"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Content
        </label>
        <MdxEditor
          setTheme={setTheme}
          theme={theme}
          value={mdxString}
          setValue={setMdxString}
        />
      </div>

      <button
        type="submit"
        onClick={() => {
          handleSave();
        }}
        disabled={loading}
        className="text-white disabled:bg-gray-400 mt-14 float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-8 py-2.5 text-center"
      >
        Save
      </button>
    </div>
  );
};

export default PageEditForm;
