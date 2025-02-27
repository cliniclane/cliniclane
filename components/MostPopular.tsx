import { Articles } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

interface IProps {
  articles: Articles[];
}

const MostPopular: FC<IProps> = ({ articles }) => {
  const router = useRouter();
  return (
    <section className="bg-purple-200 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-black">
            Our most popular articles
          </h2>
          <p className="text-gray-700 mt-2">
            The latest news, tips and advice to help you run your business with
            less fuss
          </p>
        </div>
        <Link
          href="/all"
          className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800"
        >
          Read All Articles
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-3 gap-6 grid-rows-1 h-80">
        {articles.map((article, index) => (
          <div
            onClick={() => router.push(`/[slug]`, `/${article.slug}`)}
            key={index}
            className="relative rounded-xl overflow-hidden cursor-pointer"
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostPopular;
