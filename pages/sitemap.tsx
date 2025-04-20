import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { filterArticlesByLanguage } from "@/lib/utils";
import { Articles, PrismaClient } from "@prisma/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Sitemap = ({ articles, locale }: { articles: Articles[], locale: string }) => {
  const [renderArticles, setRenderArticles] = useState<Articles[] | null>(null);

  const { t } = useTranslation("common");

  useEffect(() => {
    if (articles && locale) {
      setRenderArticles(filterArticlesByLanguage(articles, locale))
    }
  }, [locale])

  const siteMap = {
    main: [
      {
        title: t("home"),
        url: "/",
      },
      {
        title: t("about"),
        url: "/about",
      },
      {
        title: t("contact"),
        url: "/contact",
      },
    ],
    privacy: [
      {
        title: t("privacy"),
        url: "/privacy",
      },
      {
        title: t("advertising"),
        url: "/advertising",
      },
      {
        title: t("medical"),
        url: "/medical-team",
      },
    ],
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
        <p className="text-center text-5xl font-bold">{t("sitemap")}</p>
        <div className="grid md:grid-cols-3 my-12 space-y-16 md:space-y-0 md:my-20">
          <div className="flex flex-col">
            <span className="text-2xl font-bold capitalize">{t("main")}</span>
            {siteMap.main.map((page) => (
              <Link
                href={page.url}
                key={page.title}
                className="mt-5 text-xl capitalize hover:underline"
              >
                {page.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold capitalize">{t("pri")}</span>
            {siteMap.privacy.map((page) => (
              <Link
                href={page.url}
                key={page.title}
                className="mt-5 text-xl capitalize hover:underline"
              >
                {page.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold capitalize">{t("articles")}</span>
            {renderArticles && renderArticles.map((page) => (
              <Link
                href={locale === "english" ? `/${page.slug}` : `/${locale}/${page.slug}`}
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
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
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
}
