import React from "react";
import { useTranslation } from "next-i18next";

const Newsletter = () => {
  const { t } = useTranslation("common");

  return (
    <div className="bg-black text-white p-8 rounded-3xl flex flex-col items-center text-center shadow-lg">
      <div className="p-2 bg-black border rounded-3xl flex items-center justify-center gap-3">
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          className="w-full sm:w-72 bg-black text-white pl-5 focus:outline-none"
        />
        <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-3 rounded-full shadow-md">
          {t("submit")}
        </button>
      </div>
      <h2 className="mt-10 text-3xl md:text-4xl font-bold">
        {t("newsletterTitle.part1")}{" "}
        <span className="text-green-400">{t("newsletterTitle.highlight")}</span>{" "}
        {t("newsletterTitle.part2")}
      </h2>
    </div>
  );
};

export default Newsletter;