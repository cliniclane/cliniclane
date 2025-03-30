import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Articles } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const ReadAll = ({ articles }: { articles: Articles[] }) => {
  const router = useRouter();
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
        <div className="grid grid-cols-1 my-6 gap-5 sm:grid-cols-1 md:grid-cols-2">
          {articles.map((article) => (
            <div
              onClick={() => router.push(`/[slug]`, `/${article.slug}`)}
              key={article.id}
              className="p-4 cursor-pointer flex space-x-5 mx-5"
            >
              <Image
                width={200}
                height={100}
                src={article.headerImage}
                alt={article.title}
                className="w-36 h-28 object-cover hover:opacity-80"
              />
              <div className="h-full flex flex-col justify-between space-y-2">
                <h2 className="text-2xl font-bold hover:text-teal-700">{article.title}</h2>
                <span className="text-gray-700 text-justify">
                  {article.description.substring(0, 80) + "..."}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 
      Footer
      */}
      <Footer />
    </div>
  );
};

export async function getStaticProps() {

  const res = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/article/all",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const articles = await res.json();

  return {
    props: {
      articles,
    },
  };
}

export default ReadAll;
