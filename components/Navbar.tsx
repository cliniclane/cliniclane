import { merriweather } from "@/lib/font";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-black m-4 text-white px-10 xl:px-[70px] py-4 flex items-center justify-between rounded-lg">
      {/* Logo */}
      <Link
        href={"/"}
        className={`text-green-400 text-2xl font-bold ${merriweather.className}`}
      >
        Cliniclane
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-300">
        <a href="#" className="hover:text-white">
          Product
        </a>
        <a href="#" className="hover:text-white">
          Project
        </a>
        <a href="#" className="hover:text-white">
          Community
        </a>
        <Link href="/about" className="hover:text-white">
          About
        </Link>
      </div>

      {/* Search Icon and Button */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-xl">Subscribe</span>
        <FaSearch className="text-gray-300 hover:text-white cursor-pointer" />
      </div>
    </nav>
  );
}
