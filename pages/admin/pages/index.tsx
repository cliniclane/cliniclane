import Sidebar from "@/components/Admin/Sidebar";
import { PagesContent } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

const Pages = () => {
  const [pages, setPages] = useState<PagesContent[]>([]);

  // Fetch articles
  useEffect(() => {
    const fetchPages = async () => {
      const res = await fetch("/api/pageContent/all");
      const data = await res.json();
      setPages(data);
    };

    fetchPages();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar selected="pages" />

      {/* Content */}
      <div className="md:pl-48 py-10 px-4 sm:px-6 mt-10 md:mt-0 w-full">
        <div className="flex w-full justify-between">
          <span className="text-2xl font-medium underline text-gray-500">
            All Pages
          </span>
        </div>

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
                  Last Updated
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, index) => (
                <tr
                  key={page.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 py-4">{index + 1}.</td>
                  <td className="px-4 py-4">{page.slug}</td>
                  <td className="px-4 py-4">{page.title}</td>
                  <td className="px-4 py-4">
                    {new Date(page.updatedAt).toDateString()}
                  </td>
                  <td className="px-4 py-4 flex">
                    <Link
                      href={`/admin/pages/edit/${page.slug}`}
                      className="text-xl"
                    >
                      <FaEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pages;
