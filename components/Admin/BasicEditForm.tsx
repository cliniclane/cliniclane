import React, { FC, useEffect, useState } from "react";
import MdxEditor from "./MDXEditor";
import { Articles, Images, Languages } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { Input } from "../ui/input";

interface IProps {
  article: Articles;
  mdxString: string | undefined;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  setMdxString: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSave: () => void;
  loading: boolean;
}

const BasicEditForm: FC<IProps> = ({
  article,
  mdxString,
  images,
  setImages,
  handleChange,
  setMdxString,
  handleSave,
  loading,
}) => {
  const [theme, setTheme] = useState("github");
  const [languages, setLanguages] = useState<Languages[] | null>(null);
  const [userImages, setUserImages] = useState<Images[] | null>(null);
  const { data: session } = useSession()

  useEffect(() => {
    const c = getCookie("editor-theme");
    if (c) setTheme(c as string);
  }, []);

  // Fetch users from API
  const fetchLanguages = async () => {
    const res = await fetch('/api/languages');
    const data = await res.json()
    setLanguages(data)
  }

  useEffect(() => {
    if (!languages && session) {
      fetchLanguages()
    }
  }, [languages, session]);


  // Fetch user images 
  const fetchUserImages = async () => {
    const res = await fetch(`/api/images?email=${session?.user.email}`)
    const data = await res.json()
    setUserImages(data)
  }

  useEffect(() => {
    if (!userImages && session) {
      fetchUserImages()
    }
  }, [userImages, session]);




  return (
    <div className="w-full pt-10">
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-lg font-semibold text-gray-900"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={article.title || ""}
          value={article?.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="slug"
          className="block mb-2 text-lg font-semibold text-gray-900 "
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder=""
          value={article?.slug || ""}
          onChange={handleChange}
        />
      </div>

      {/* Languge */}
      <div className="mb-6">
        <label
          htmlFor="language"
          className="block mb-2 text-lg font-semibold text-gray-900 "
        >
          Language
        </label>
        <select
          name="language"
          id="language"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={article.language || ""} // Ensure default value is set
          onChange={handleChange}
        >
          <option value="">Select a language</option>
          {languages?.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block mb-2 text-lg font-semibold text-gray-900 "
        >
          Description
        </label>
        <textarea
          cols={6}
          id="description"
          name="description"
          rows={4}
          value={article?.description || ""}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="headerImage"
          className="block mb-2 text-lg font-semibold text-gray-900 "
        >
          Image
        </label>
        <div className="grid grid-cols-3">
          <div className="flex flex-col justify-center space-y-5">
            <span className="text-gray-400">
              Total {userImages?.length} images available
            </span>
            <FileUploaderRegular
              accept="image/*"
              onFileUploadSuccess={(fileInfo) => {
                const payload = {
                  fileURL: fileInfo.cdnUrl,
                  userID: session?.user.email,
                }
                fetch("/api/images", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    const images = [...userImages!, data];
                    setUserImages(images);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
              pubkey={process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY!} />
          </div>

          <div className={`columns-1 col-span-2 border rounded-lg overflow-y-auto p-2.5 sm:columns-2 md:columns-3 gap-2.5 space-y-4 mt-5 ${userImages?.length === 0 && "hidden"}`}>
            {userImages &&
              userImages?.map((image => (
                <div key={image.id} className="w-full relative break-inside-avoid rounded overflow-hidden">

                  <DropdownMenu >
                    <DropdownMenuTrigger className="absolute right-2 top-2" asChild>
                      <Button size="icon" variant="outline" >
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(image.url)
                          toast.success("Link copied to clipboard")
                        }}
                      >Copy Link</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          fetch("/api/images", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              imageID: image.id
                            }),
                          }).then(() => {
                            setUserImages(userImages?.filter((img) => img.id !== image.id) || null);
                          })
                        }}
                      >Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <img className="h-auto max-w-full border rounded-lg" src={image.url} alt="" />
                </div>
              )))
            }
          </div>
        </div>

        <ul className="mt-7 space-y-5">
          <li>
            <Input
              type="text"
              name="image0"
              id="image0"
              placeholder="Image URL 1"
              value={images[0]}
              onChange={(e) => {
                const updatedImages = [...images]; // clone the array
                updatedImages[0] = e.target.value;
                setImages(updatedImages); // set new state
              }}
            />
          </li>
          <li>
            <Input
              type="text"
              name="image1"
              id="image1"
              placeholder="Image URL 2"
              value={images[1]}
              onChange={(e) => {
                const updatedImages = [...images]; // clone the array
                updatedImages[1] = e.target.value;
                setImages(updatedImages); // set new state
              }}

            />
          </li>
          <li>
            <Input
              type="text"
              name="image2"
              id="image2"
              placeholder="Image URL 3"
              value={images[2]}
              onChange={(e) => {
                const updatedImages = [...images]; // clone the array
                updatedImages[2] = e.target.value;
                setImages(updatedImages); // set new state
              }}

            />
          </li>
        </ul>
      </div>
      <div className="mb-6 mt-16 h-[110vh]">
        <label
          htmlFor="content"
          className="block mb-4 text-lg font-semibold text-gray-900"
        >
          Content
        </label>
        <MdxEditor
          theme={theme}
          setTheme={setTheme}
          value={mdxString}
          setValue={setMdxString}
        />
      </div>

      <button
        type="submit"
        onClick={() => {
          handleSave();
        }}
        disabled={loading}
        className="text-white disabled:bg-gray-400 mt-16 float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-8 py-2.5 text-center"
      >
        Save
      </button>
    </div>
  );
};

export default BasicEditForm;
