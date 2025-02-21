import Sidebar from "@/components/Admin/Sidebar";
import { Articles as IArticles } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export default function Articles() {
  const router = useRouter();
  const [articles, setArticles] = useState<IArticles[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/article/all");
      const data = await res.json();
      setArticles(data);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (!router.query.tab) router.push("/admin?tab=articles");
  });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="md:pl-72 py-10 px-4 sm:px-6 mt-10 md:mt-0 w-full">
        <p className="text-2xl font-medium underline text-gray-500">
          All Articles
        </p>

        {/* Responsive Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-gray-800 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-2 py-3">
                  #
                </th>
                <th scope="col" className="px-4 py-3">
                  Slug
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3">
                  Publish Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr
                  key={article.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 py-4">{index + 1}.</td>
                  <td className="px-4 py-4">{article.slug}</td>
                  <td className="px-4 py-4">{article.title}</td>
                  <td className="px-4 py-4">
                    {new Date(article.publishDate).toDateString()}
                  </td>
                  <td className="px-4 py-4 flex gap-4">
                    <Link
                      href={`/admin/edit/${article.id}?tab=basic`}
                      className="text-xl"
                    >
                      <FaEdit />
                    </Link>
                    <button className="text-2xl text-red-600">
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
