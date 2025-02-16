import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXProvider } from "@mdx-js/react";
import React from "react";

// Define MDX components
const components = {
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-xl font-semibold my-5" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-xl font-semibold my-5 underline" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 mb-5 text-lg" {...props} />
  ),
};

// Define props type
interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ source }) => {
  return (
    <MDXProvider components={components}>
      <div className="">
        <MDXRemote
          {...source}
          components={{
            h1: ({ children }) => {
              const id = (children as string)
                .toLowerCase()
                .replace(/\s+/g, "-");
              return (
                <h1
                  id={id}
                  className="text-3xl font-semibold my-10 scroll-mt-20"
                >
                  {children}
                </h1>
              );
            },
            li: ({ children }) => {
              return (
                <li className="list-disc text-lg list-inside text-gray-800 mb-2">
                  {children}
                </li>
              );
            },
            ol: ({ children }) => {
              return (
                <ol className="list-decimal list-inside text-lg text-gray-800 mb-2">
                  {children}
                </ol>
              );
            },
          }}
        />
      </div>
    </MDXProvider>
  );
};

export default MDXRenderer;
