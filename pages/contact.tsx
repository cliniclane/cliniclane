import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Contact = () => {
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/* Content */}
      <main className="my-10 p-5 flex flex-col md:px-14 xl:px-20">
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-bold">Lets Get In Touch</span>
          <div className="w-full mt-10">
            <form className="max-w-sm mx-auto">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@cliniclane.com"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Type here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 
      Footer
      *
      */}
      <Footer />
    </div>
  );
};

export default Contact;
