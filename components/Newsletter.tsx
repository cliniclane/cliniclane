import React from "react";

const Newsletter = () => {
  return (
    <div className="bg-black text-white p-8 rounded-3xl flex flex-col items-center text-center shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold">
        Join our <span className="text-green-400">30 days</span> detox program
      </h2>
      <div className="mt-10 p-2 bg-black border rounded-3xl flex items-center justify-center gap-3">
        <input
          type="email"
          placeholder="Email Address*"
          className="w-full sm:w-72 bg-black text-white pl-5 focus:outline-none"
        />
        <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-3 rounded-full shadow-md">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
