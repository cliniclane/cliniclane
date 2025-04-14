import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation("common");

  const linksData = [
    { name: t("about"), slug: "about" },
    { name: t("contact"), slug: "contact" },
    { name: t("privacy"), slug: "privacy" },
    { name: t("advertising"), slug: "advertising" },
    { name: t("sitemap"), slug: "sitemap" },
    { name: t("medical"), slug: "medical-team" },
  ];

  return (
    <footer className="bg-[#f9f6f2] text-gray-900 mt-16 md:px-9 xl:px-16">
      <div className=" mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold">{t("newsletterTitleFooter")}</h2>
            <p className="text-gray-700 mt-2">{t("newsletterDesc")}</p>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder={t("placeholder")}
                className="border border-gray-400 px-4 py-2 w-full md:w-auto rounded-l-md focus:outline-none"
              />
              <button className="bg-teal-700 text-white px-6 py-2 rounded-r-md hover:bg-teal-800">
                {t("subscribe")}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {t("privacyText")}{" "}
              <a href="#" className="underline">{t("privacyLink")}</a>
            </p>
          </div>

          <div className="flex space-x-4 mt-6 md:mt-0">
            <FaFacebookF className="text-xl cursor-pointer hover:text-teal-700" />
            <FaTwitter className="text-xl cursor-pointer hover:text-teal-700" />
            <FaPinterestP className="text-xl cursor-pointer hover:text-teal-700" />
            <FaInstagram className="text-xl cursor-pointer hover:text-teal-700" />
            <FaYoutube className="text-xl cursor-pointer hover:text-teal-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          {linksData.map((link, index) => (
            <Link href={"/" + link.slug} key={index} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="text-sm text-gray-600 mt-8">
          <p>{t("copyright")}</p>
          <p>{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
