import { merriweather } from "@/lib/font";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="m-4 px-10 xl:px-[70px] py-4 flex items-center justify-between rounded-lg">
      {/* Logo */}
      <Link
        href={"/"}
        className={`text-blue-800 text-3xl font-extrabold ${merriweather.className}`}
      >
        Cliniclane
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-950">
        <Link href="/" className="hover:text-gray-500">
          Home
        </Link>

        <Link href="/contact" className="hover:text-gray-500">
          Contact
        </Link>
        <Link href="/about" className="hover:text-gray-500">
          About
        </Link>
        <a href="#career" className="hover:text-gray-500">
          Career
        </a>
      </div>

      {/* Search Icon and Button */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-xl">Subscribe</span>
        <FaSearch className="hover:text-gray-500 text-gray-950 cursor-pointer" />
      </div>
    </nav>
  );
}
