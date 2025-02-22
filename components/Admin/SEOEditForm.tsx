import { Articles } from "@prisma/client";
import React, { FC } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IProps {
  article: Articles;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  tags: string[];
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  addTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
  handleSave: () => void;
  loading: boolean;
}

const SEOEditForm: FC<IProps> = ({
  tags,
  inputValue,
  setInputValue,
  addTag,
  removeTag,
  article,
  handleChange,
  handleSave,
  loading,
}) => {
  // Function to render input fields dynamically
  const renderInputField = (id: string, label: string, value?: string) => (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={`Enter ${label}`}
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="w-full pt-10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Manage Tags</h3>

        {/* Tags Display */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-white hover:text-gray-300"
              >
                <AiOutlineClose size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Input for Adding Tags */}
        <input
          type="text"
          placeholder="Add a tag and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addTag}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {renderInputField("canonical", "Canonical", article?.canonical)}
      {renderInputField(
        "openGraphImage",
        "Open Graph Image",
        article?.openGraphImage || ""
      )}
      {renderInputField(
        "openGraphTitle",
        "Open Graph Title",
        article?.openGraphTitle || ""
      )}
      <div className="mb-6">
        <label
          htmlFor="openGraphDescription"
          className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Open Graph Description
        </label>
        <textarea
          cols={10}
          id="openGraphDescription"
          name="openGraphDescription"
          onChange={handleChange}
          value={article?.openGraphDescription || ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      {/* Save Button */}
      <div className="text-right mt-14">
        <button
          type="submit"
          onClick={() => handleSave()}
          disabled={loading}
          className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-8 py-2.5"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SEOEditForm;
