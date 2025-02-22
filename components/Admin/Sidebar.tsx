import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

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
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transition-transform duration-300 ease-in-out 
     ${
       isMobile
         ? isOpen
           ? "translate-x-0"
           : "-translate-x-64"
         : "translate-x-0"
     }`}
      >
        <div className="p-5 text-lg font-bold flex justify-between items-center">
          <span>Admin Dashboard </span>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-white">
              <FaTimes size={20} />
            </button>
          )}
        </div>
        <ul>
          <Link href="/admin?tab=articles">
            <li
              className={`p-3 hover:bg-gray-500 ${
                router.query.tab === "articles" && "bg-gray-700"
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/admin?tab=profile">
            <li
              className={`p-3 hover:bg-gray-500 ${
                router.query.tab === "profile" && "bg-gray-700"
              }`}
            >
              Profile
            </li>
          </Link>
          <button
            onClick={() => signOut()}
            className="absolute bottom-10 mx-auto w-full ml-3"
          >
            <TbLogout2 size={24} />
          </button>
        </ul>
      </div>
      {/* Menu Button */}
      {isMobile && !isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={20} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
