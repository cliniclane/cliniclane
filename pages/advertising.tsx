import Footer from "@/components/Footer";
import MDXRenderer from "@/components/MDXRenderer";
import Navbar from "@/components/Navbar";
import { PagesContent, PrismaClient } from "@prisma/client";
import { GetStaticProps } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";

export default function AdvertisingPolicy({ pageData }: { pageData: PagesContent }) {
  const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  > | null>(null);
  useEffect(() => {
    async function loadMDX() {
      const mdxString = pageData.mdxContent;
      const mdxSource = await serialize(mdxString);
      setMdxContent(mdxSource);
    }
    loadMDX();
  }, []);
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/*
       * Content
       */}
      <main className="flex flex-col md:px-6 xl:px-14">
        <div className="flex flex-col gap-4 p-5">
          {/* <h1 className="text-3xl font-semibold">{pageData.title}</h1> */}
          {mdxContent ? (
            <MDXRenderer source={mdxContent} />
          ) : (
            <p>Loading MDX...</p>
          )}
        </div>
      </main>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();

  const pageData = await prisma.pagesContent.findUnique({
    where: { slug: "advertising" },
  });

  if (!pageData) {
    return { notFound: true }; // Return 404 if page not found
  }

  return {
    props: { pageData: JSON.parse(JSON.stringify(pageData)) },
    revalidate: 10000, // ISR: Revalidate every 10 seconds
  };
};
