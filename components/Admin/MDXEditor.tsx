import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import AceEditor from "react-ace";

// Import required modes and themes
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-gruvbox";

// Function to detect RTL content
const isRTL = (text: string) => {
  const rtlPattern =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlPattern.test(text);
};

import MDXRenderer from "../MDXRenderer";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { setCookie } from "cookies-next/client";

interface IProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}

const MdxEditor: FC<IProps> = ({ value, setValue, theme, setTheme }) => {
  const [isViewTab, setIsViewTab] = useState(false);
  const isRtlContent = isRTL(value || "");

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
    <div className="flex flex-col gap-4">
      <ul className="flex relative flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <button
            onClick={() => setIsViewTab(false)}
            aria-current="page"
            className={`inline-block p-4 font-bold rounded-t-lg ${
              !isViewTab
                ? "active text-blue-600 bg-gray-200"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setIsViewTab(true)}
            aria-current="page"
            className={`inline-block font-bold p-4 rounded-t-lg ${
              isViewTab
                ? "active text-blue-600 bg-gray-200"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            View
          </button>
        </li>
        <div className="absolute right-0">
          <form className="max-w-sm mx-auto">
            <select
              id="themes"
              onChange={(e) => {
                setTheme(e.target.value);
                setCookie("editor-theme", e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected disabled>
                Choose a editor
              </option>
              {[
                "dracula",
                "monokai",
                "nord_dark",
                "one_dark",
                "github",
                "solarized_dark",
                "solarized_light",
                "twilight",
                "gruvbox",
              ].map((name) => (
                <option
                  selected={name === theme}
                  key={name}
                  className="capitalize"
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>
          </form>
        </div>
      </ul>

      <div className="w-full h-[700px] border rounded-md">
        {!isViewTab ? (
          <AceEditor
            mode={isRtlContent ? "text" : "markdown"} // Ensure correct mode
            theme={theme}
            key={isRtlContent ? "rtl" : "ltr"} // Force re-render
            value={value}
            onChange={(newValue) => setValue(newValue)}
            fontSize={13}
            width="100%"
            height="100%"
            setOptions={{
              useWorker: false,
              showPrintMargin: false,
              wrap: true,
              firstLineNumber: 1,
            }}
            editorProps={{ $blockScrolling: true }}
            style={{
              direction: isRtlContent ? "rtl" : "ltr",
              textAlign: isRtlContent ? "right" : "left",
            }}
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
