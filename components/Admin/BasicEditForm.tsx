import React, { FC } from "react";
import MdxEditor from "./MDXEditor";
import { Articles } from "@prisma/client";

interface IProps {
  article: Articles;
  mdxString: string | undefined;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setMdxString: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSave: () => void;
  loading: boolean;
}

const BasicEditForm: FC<IProps> = ({
  article,
  mdxString,
  handleChange,
  setMdxString,
  handleSave,
  loading,
}) => {
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
          placeholder={article.title || ""}
          value={article?.title}
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
          value={article?.slug || ""}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Description
        </label>
        <textarea
          cols={6}
          id="description"
          name="description"
          rows={4}
          value={article?.description || ""}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="headerImage"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Image
        </label>
        <textarea
          cols={6}
          id="headerImage"
          name="headerImage"
          onChange={handleChange}
          value={article?.headerImage}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6 h-[100vh]">
        <label
          htmlFor="content"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Content
        </label>
        <MdxEditor value={mdxString} setValue={setMdxString} />
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

export default BasicEditForm;
