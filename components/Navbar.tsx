import { merriweather } from "@/lib/font";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import LocaleSwitcher from "./LocaleSwitcher";
import { useLocale } from "next-intl";


export default function Navbar() {
  const scrollToResumeForm = () => {
    document.getElementById("career")?.scrollIntoView({ behavior: "smooth" });
  };

  const locale = useLocale();

  return (
    <nav className="m-4 px-10 xl:px-[65px] py-4 flex items-center justify-between rounded-lg">
      {/* Logo */}
      <Link
        href={"/"}
        className={`text-3xl font-extrabold ${merriweather.className}`}
      >
        Cliniclane
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-gray-950">
        <Link href="/" className="hover:text-gray-500 text-lg">
          Home
        </Link>

        <Link href="/contact" className="hover:text-gray-500 text-lg">
          Contact
        </Link>
        <Link href="/about" className="hover:text-gray-500 text-lg">
          About
        </Link>
        <button
          onClick={scrollToResumeForm}
          className="hover:text-gray-500 text-lg"
        >
          Career
        </button>
      </div>

      {/* Search Icon and Button */}
      <div className="flex items-center space-x-4">
        <LocaleSwitcher currentLocale={locale} />
        <FaSearch className="hover:text-gray-500 text-lg text-gray-950 cursor-pointer" />
      </div>
    </nav>
  );
}
