import Footer from "@/components/Footer";
import MostPopular from "@/components/MostPopular";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/*
       * Content
       */}
      <main className="flex flex-col md:px-6 xl:px-14">
        {/*
         * Hero
         */}
        <div className="grid md:grid-cols-3 gap-4 p-5">
          <div className="flex flex-col space-y-3 justify-between">
            {/* Smaller Cards */}
            <Link
              href="/insomnia"
              className="relative hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1502322328990-fc8f47a2d9a5?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Business"
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
                <span className="text-sm text-gray-300 uppercase">
                  Mental Health
                </span>
                <h3 className="text-white hover:text-blue-300 text-lg font-semibold leading-tight">
                Everything You Need to Know About Insomnia
                </h3>
              </div>
            </Link>
            {/* Smaller Cards */}
            <Link
              href="/crohns-disease"
              className="relative hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1579781354186-012d7e850ad7?q=80&w=2317&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Business"
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
                <span className="text-sm text-gray-300 uppercase">
                  Creators
                </span>
                <h3 className="text-white hover:text-blue-300 text-lg font-semibold leading-tight">
                  Understanding Crohn’s Disease
                </h3>
              </div>
            </Link>
          </div>
          {/* Large Main Card */}
          <Link
            href="/rheumatoid-arthritis-disease-juvenile-symptoms-treatment"
            className="md:col-span-2 hover:opacity-90 cursor-pointer relative rounded-xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1626178794106-474fa92d6524?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="cover"
              width={800}
              height={500}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
              <span className="text-sm text-gray-300 uppercase">Health</span>
              <h2 className="text-white hover:text-blue-300 text-2xl font-bold leading-tight">
                Everything You Want to Know About Rheumatoid Arthritis
              </h2>
              <div className="mt-4 flex items-center space-x-4">
                <button className="bg-white hover:bg-blue-300 text-black px-4 py-2 rounded-full text-sm">
                  Read Article →
                </button>
                <span className="text-white text-sm">by Sid</span>
              </div>
            </div>
          </Link>
        </div>
        {/*
         * Most Popular Articles
         */}
        <div className="p-5">
          <MostPopular />
        </div>
        {/*
         * Newsletter
         */}
        <div className="p-5">
          <Newsletter />
        </div>
      </main>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
}
