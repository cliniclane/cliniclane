import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PagesContent, PrismaClient } from "@prisma/client";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";
import MDXRenderer from "@/components/MDXRenderer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const About = ({ pageData }: { pageData: PagesContent }) => {
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
      {/* Content */}
      <main className="flex flex-col md:px-14 xl:px-20">
        <div className="flex flex-col gap-4">
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
};

export default About;

export const getStaticProps = async ({ locale }: { locale: string }) => {
  const prisma = new PrismaClient();

  const pageData = await prisma.pagesContent.findUnique({
    where: { slug: "about" },
  });

  if (!pageData) {
    return { notFound: true }; // Return 404 if page not found
  }

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData))
      , ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10000, // ISR: Revalidate every 10 seconds
  };
};
