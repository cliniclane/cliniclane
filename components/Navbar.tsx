import { merriweather } from "@/lib/font";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Navbar() {
  const { t } = useTranslation("common"); // Load translations from common.json

  const scrollToResumeForm = () => {
    document.getElementById("career")?.scrollIntoView({ behavior: "smooth" });
  };

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
          {t("home")}
        </Link>

        <Link href="/contact" className="hover:text-gray-500 text-lg">
          {t("contact")}
        </Link>

        <Link href="/about" className="hover:text-gray-500 text-lg">
          {t("about")}
        </Link>

        <button
          onClick={scrollToResumeForm}
          className="hover:text-gray-500 text-lg"
        >
          {t("career")}
        </button>
      </div>

      {/* Search Icon and Button */}
      <div className="flex items-center space-x-4">
        <LocaleSwitcher />
        <FaSearch className="hover:text-gray-500 text-lg text-gray-950 cursor-pointer" />
      </div>
    </nav>
  );
}
