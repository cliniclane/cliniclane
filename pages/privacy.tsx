import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PagesContent } from "@prisma/client";
import React from "react";

export default function Privacy({ pageData }: { pageData: PagesContent }) {
  console.log(pageData);
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/*
       * Content
       */}
      <main className="flex flex-col md:px-6 xl:px-14"></main>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
}
