import React, { FC, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import MDXRenderer from "../MDXRenderer";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

interface IProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

const MdxEditor: FC<IProps> = ({ value, setValue }) => {
  const [isViewTab, setIsViewTab] = useState(false);

  const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  > | null>(null);

  useEffect(() => {
    async function loadMDX() {
      const mdxString = value || "";
      const mdxSource = await serialize(mdxString);
      setMdxContent(mdxSource);
    }
    loadMDX();
  }, [value]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <button
            onClick={() => setIsViewTab(false)}
            aria-current="page"
            className={`inline-block p-4 rounded-t-lg ${
              !isViewTab
                ? "active text-blue-600 bg-gray-100"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setIsViewTab(true)}
            aria-current="page"
            className={`inline-block p-4 rounded-t-lg ${
              isViewTab
                ? "active text-blue-600 bg-gray-200"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            View
          </button>
        </li>
      </ul>

      <div className="w-full h-[600px] border rounded-md">
        {!isViewTab ? (
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={value}
            onChange={(value) => setValue(value || "")}
            options={{ minimap: { enabled: false } }}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-4 prose">
            {mdxContent && <MDXRenderer source={mdxContent} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MdxEditor;
