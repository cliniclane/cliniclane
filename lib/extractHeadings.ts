import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { Literal, Parent } from "unist";

// Define the expected node types for headings
interface HeadingNode extends Parent {
  type: "heading";
  depth: number;
  children: Literal[];
}

export const extractHeadings = async (
  mdxContent: string
): Promise<string[]> => {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

  const headings: string[] = [];

  const extract = (node: Parent) => {
    if (node.type === "heading" && (node as HeadingNode).depth === 1) {
      const text = (node as HeadingNode).children
        .map((child) => ("value" in child ? child.value : ""))
        .join("");

      headings.push(text);
    }

    if (node.children) {
      node.children.forEach((child) => extract(child as Parent));
    }
  };

  extract(tree);
  return headings;
};
