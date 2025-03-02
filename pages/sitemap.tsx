import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Articles, PrismaClient } from "@prisma/client";
import Link from "next/link";
import React from "react";

const Sitemap = ({ articles }: { articles: Articles[] }) => {
  const siteMap = {
    main: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "About",
        url: "/about",
      },
      {
        title: "Contact",
        url: "/contact",
      },
    ],
    privacy: [
      {
        title: "Privacy Policy",
        url: "/privacy",
      },
      {
        title: "Advertising Policy",
        url: "/advertising",
      },
      {
        title: "Medical Affairs",
        url: "/medical-team",
      },
    ],
    articles: articles.map((article) => {
      return {
        title: article.title,
        url: `/${article.slug}`,
      };
    }),
  };
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/*
       * Content
       */}
      <main className="flex p-5 flex-col md:px-14 xl:px-20">
        <p className="text-center text-5xl font-bold">Sitemap</p>
        <div className="grid md:grid-cols-3 my-12 space-y-16 md:space-y-0 md:my-20">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">Main</span>
            {siteMap.main.map((page) => (
              <Link
                href={page.url}
                key={page.title}
                className="mt-5 text-xl hover:underline"
              >
                {page.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">Privacy</span>
            {siteMap.privacy.map((page) => (
              <Link
                href={page.url}
                key={page.title}
                className="mt-5 text-xl hover:underline"
              >
                {page.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">Articles</span>
            {siteMap.articles.map((page) => (
              <Link
                href={page.url}
                key={page.title}
                className="mt-5 text-xl hover:underline"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </main>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
};

export default Sitemap;

export async function getStaticProps() {
  const prisma = new PrismaClient();

  const articles = await prisma.articles.findMany({
    orderBy: { publishDate: "desc" },
  });

  if (!articles) {
    return { notFound: true }; // Return 404 if page not found
  }

  return {
    props: {
      articles,
    },
    revalidate: 1800,
  };
}
