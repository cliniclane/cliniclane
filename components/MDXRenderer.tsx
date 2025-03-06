import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXProvider } from "@mdx-js/react";
import React from "react";

// Function to detect RTL content
const isRTL = (text: string) => {
  const rtlPattern =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlPattern.test(text);
};

// Define MDX components
const components = {
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold my-5" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-semibold my-5 underline" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    const dir = isRTL(props.children as string) ? "rtl" : "ltr";
    return <p className={`text-gray-700 mb-5 text-lg`} dir={dir} {...props} />;
  },
};

// Define props type
interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ source }) => {
  return (
    <MDXProvider components={components}>
      <div>
        <MDXRemote
          {...source}
          components={{
            h1: ({ children }) => {
              let id = children as string;
              if (typeof id === "string")
                id = id.toLowerCase().replace(/\s+/g, "-");
              const dir = isRTL(children as string) ? "rtl" : "ltr";
              return (
                <h1
                  id={id}
                  dir={dir}
                  className={`text-3xl font-semibold my-10 scroll-mt-20 rtl:text-right`}
                >
                  {children}
                </h1>
              );
            },
            li: ({ children }) => {
              const dir = isRTL(children as string) ? "rtl" : "ltr";
              return (
                <li className="list-disc text-lg text-gray-800 mb-2" dir={dir}>
                  {children}
                </li>
              );
            },
            ol: ({ children }) => {
              const dir = isRTL(children as string) ? "rtl" : "ltr";
              return (
                <ol
                  className="list-decimal text-lg text-gray-800 mb-2"
                  dir={dir}
                >
                  {children}
                </ol>
              );
            },
            strong: ({ children }) => {
              const dir = isRTL(children as string) ? "rtl" : "ltr";
              return (
                <strong className="font-bold rtl:text-right text-gray-900" dir={dir}>
                  {children}
                </strong>
              );
            },
            b: ({ children }) => {
              const dir = isRTL(children as string) ? "rtl" : "ltr";
              return (
                <b className="font-semibold rtl:text-right text-gray-900" dir={dir}>
                  {children}
                </b>
              );
            },
          }}
        />
      </div>
    </MDXProvider>
  );
};

export default MDXRenderer;
