import Footer from "@/components/Footer";
import MostPopular from "@/components/MostPopular";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import { Articles, PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { filterArticlesByLanguage } from "@/lib/utils";


export default function Home({ articles, locale }: { articles: Articles[], locale: string }) {

  const [renderArticles, setRenderArticles] = useState<Articles[] | null>(null);

  const { t } = useTranslation("common");

  useEffect(() => {
    if (articles && locale) {
      setRenderArticles(filterArticlesByLanguage(articles, locale))
    }
  }, [locale])


  return (
    <div className="w-full">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      {renderArticles && <main className="flex flex-col md:px-6 xl:px-14">
        {/* Hero */}
        <div className="grid md:grid-cols-3 gap-4 p-5">
          <div className="flex flex-col space-y-3 justify-between">
            {/* Smaller Cards */}
            <Link
              href={renderArticles[2].slug}
              className="relative hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
            >
              <Image
                src={renderArticles[2].headerImage}
                alt="Business"
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
                <span className="text-sm text-gray-300 uppercase">
                  {t("mentalHealth")}
                </span>
                <h3 className="text-white hover:text-blue-300 text-lg font-semibold leading-tight">
                  {renderArticles[2].title}
                </h3>
              </div>
            </Link>
            {/* Smaller Cards */}
            <Link
              href={renderArticles[1].slug}
              className="relative hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
            >
              <Image
                src={renderArticles[1].headerImage}
                alt="cover"
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
                <span className="text-sm text-gray-300 uppercase">
                  {t("creators")}
                </span>
                <h3 className="text-white hover:text-blue-300 text-lg font-semibold leading-tight">
                  {renderArticles[1].title}
                </h3>
              </div>
            </Link>
          </div>

          {/* Large Main Card */}
          <Link
            href={renderArticles[0].slug}
            className="md:col-span-2 hover:opacity-90 cursor-pointer relative rounded-xl overflow-hidden"
          >
            <Image
              src={renderArticles[0].headerImage}
              alt="cover"
              width={800}
              height={500}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
              <span className="text-sm text-gray-300 uppercase">
                {t("health")}
              </span>
              <h2 className="text-white hover:text-blue-300 text-2xl font-bold leading-tight">
                {renderArticles[0].title}
              </h2>
              <div className="mt-4 flex items-center space-x-4">
                <button className="bg-white hover:bg-blue-300 text-black px-4 py-2 rounded-full text-sm">
                  {t("readArticle")}
                </button>
                <span className="text-white text-sm">
                  {t("by")} {renderArticles[0].author || "Sid"}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Most Popular Articles */}
        <div className="p-5">
          <MostPopular articles={articles.slice(-3)} />
        </div>

        {/* Newsletter */}
        <div className="p-5">
          <Newsletter />
        </div>
      </main>}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  const prisma = new PrismaClient();

  const articles = await prisma.articles.findMany({
    orderBy: { publishDate: "desc" },
  });

  if (!articles) {
    return { notFound: true };
  }

  return {
    props: {
      articles,
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 1800,
  };
};