import { Articles } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useTranslation } from "next-i18next";

interface IProps {
  articles: Articles[];
}

const MostPopular: FC<IProps> = ({ articles }) => {
  const { t } = useTranslation("common");

  return (
    <section className="bg-purple-200 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-black">
            {t("mostPopularTitle")}
          </h2>
          <p className="text-gray-700 mt-2">{t("mostPopularDesc")}</p>
        </div>
        <Link
          href="/all"
          className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800"
        >
          {t("readAllArticles")}
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-3 gap-6 grid-rows-1 h-80">
        {articles.map((article, index) => (
          <Link
            href={`/${article.slug}`}
            key={index}
            className="relative hover:opacity-80 rounded-xl overflow-hidden cursor-pointer"
          >
            <Image
              src={article.headerImage}
              alt={article.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {article.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MostPopular;
