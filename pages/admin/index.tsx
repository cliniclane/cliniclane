import Sidebar from "@/components/Admin/Sidebar";
import { Articles as IArticles } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";

export default function Articles() {
  const [articles, setArticles] = useState<IArticles[] | null>(null);
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user.email || !session.user.role || !session.user.image) signOut()
    }
  }, [status, session, articles]);

  // Delete Article
  const deleteArticle = async (id: string) => {
    if (!articles) return;
    const promise = fetch("/api/article/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.promise(promise, {
      loading: "Deleting...",
      success: () => {
        const newArticles = articles.filter((article) => article.id !== id);
        setArticles(newArticles);
        return "Article deleted successfully";
      },
      error: (res) => {
        console.log(res);
        return "Failed to delete article";
      },
    });

    // const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/article/delete`;
    // const promise = fetch(url, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id }),
    // });
    // toast.promise(promise, {
    //   loading: "Deleting...",
    //   success: () => {
    //     const newArticles = articles.filter((article) => article.id !== id);
    //     setArticles(newArticles);
    //     return "Article deleted successfully";
    //   },
    //   error: (res) => {
    //     console.log(res);
    //     return "Failed to delete article";
    //   },
    // });
  };

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/article/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user.email })
      });
      const data = await res.json();
      setArticles(data);
    };
    if (session && !articles) {
      fetchArticles();
    }
  }, [session, articles]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar selected="articles" />

      {/* Content */}
      <div className="md:pl-48 py-10 px-4 sm:px-6 mt-10 md:mt-0 w-full">
        <div className="flex w-full justify-between">
          <span className="text-2xl font-medium underline text-gray-500">
            All Articles
          </span>
          <Link
            href="/admin/article/new?tab=basic"
            className="bg-blue-500 px-5 py-2 text-white rounded-md"
          >
            New Article
          </Link>
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
                  Language
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
              {articles && articles?.map((article, index) => (
                <tr
                  key={article.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 py-4">{index + 1}.</td>
                  <td className="px-4 py-4">{article.slug}</td>
                  <td className="px-4 py-4">{article.title}</td>
                  <td className="px-4 py-4 capitalize text-center">{article.language || "---"}</td>
                  <td className="px-4 py-4">
                    {new Date(article.publishDate).toDateString()}
                  </td>
                  <td className="px-4 py-4 flex gap-4">
                    <Link
                      href={`/admin/article/edit/${article.id}?tab=basic`}
                      className="text-xl"
                    >
                      <FaEdit />
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <MdDeleteForever className="text-2xl text-red-600" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you want to delete this article
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteArticle(article.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
