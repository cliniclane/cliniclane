import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

interface IProps {
  selected: string;
}

const Sidebar: FC<IProps> = ({ selected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  console.log(session);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-40 transition-transform duration-300 ease-in-out 
     ${isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-64"
            : "translate-x-0"
          }`}
      >
        <div className="p-5 text-lg font-bold flex justify-between items-center">
          <div className="w-full flex items-center justify-center mb-3">
            <Image
              src="/android-chrome-192x192.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-white">
              <FaTimes size={20} />
            </button>
          )}
        </div>
        <ul>
          <Link href="/admin">
            <li
              className={`p-5 hover:bg-gray-500 ${selected === "articles" && "bg-gray-700"
                }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/admin/pages">
            <li
              className={`p-5 hover:bg-gray-500 ${selected === "pages" && "bg-gray-700"
                }`}
            >
              Pages
            </li>
          </Link>
          {session?.user?.role === "super_admin" && <Link href="/admin/users">
            <li
              className={`p-5 hover:bg-gray-500 ${selected === "users" && "bg-gray-700"
                }`}
            >
              Users
            </li>
          </Link>}
          <button
            onClick={() => signOut()}
            className="absolute bottom-10 mx-auto w-full ml-5"
          >
            <TbLogout2 size={26} />
          </button>
        </ul>

      </div>
      {/* Menu Button */}
      {
        isMobile && !isOpen && (
          <button
            className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded"
            onClick={() => setIsOpen(true)}
          >
            <FaBars size={20} />
          </button>
        )
      }
    </div >
  );
};

export default Sidebar;
