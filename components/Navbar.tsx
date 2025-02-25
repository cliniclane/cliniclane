import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="m-4 px-10 xl:px-[70px] py-4 flex items-center justify-between rounded-lg">
      {/* Logo */}
      <Image src="/logo.png" width="140" height="80" alt="" />

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-950">
        <a href="#" className="hover:text-gray-500">
          News
        </a>
        <a href="#" className="hover:text-gray-500">
          Categories
        </a>
        <Link href="/contact" className="hover:text-gray-500">
          Contact
        </Link>
        <Link href="/about" className="hover:text-gray-500">
          About
        </Link>
      </div>

      {/* Search Icon and Button */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-xl">Subscribe</span>
        <FaSearch className="hover:text-gray-500 text-gray-950 cursor-pointer" />
      </div>
    </nav>
  );
}
