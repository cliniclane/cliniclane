import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f9f6f2] text-gray-900 mt-16 md:px-9 xl:px-16">
      <div className=" mx-auto px-6 py-10">
        {/* Top Section: Newsletter & Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          {/* Newsletter Section */}
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold">Get our wellness newsletter</h2>
            <p className="text-gray-700 mt-2">
              Filter out the noise and nurture your inbox with health and
              wellness advice that’s inclusive and rooted in medical expertise.
            </p>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-400 px-4 py-2 w-full md:w-auto rounded-l-md focus:outline-none"
              />
              <button className="bg-teal-700 text-white px-6 py-2 rounded-r-md hover:bg-teal-800">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Your{" "}
              <a href="#" className="underline">
                privacy
              </a>{" "}
              is important to us.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6 md:mt-0">
            <FaFacebookF className="text-xl cursor-pointer hover:text-teal-700" />
            <FaTwitter className="text-xl cursor-pointer hover:text-teal-700" />
            <FaPinterestP className="text-xl cursor-pointer hover:text-teal-700" />
            <FaInstagram className="text-xl cursor-pointer hover:text-teal-700" />
            <FaYoutube className="text-xl cursor-pointer hover:text-teal-700" />
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          {[
            "About Us",
            "Contact Us",
            "Privacy Policy",
            "Privacy Settings",
            "Advertising Policy",
            "Health Topics",
            "Sitemap",
            "Medical Affairs",
            "Content Integrity",
            "Newsletters",
          ].map((link, index) => (
            <a key={index} href="#" className="hover:underline">
              {link}
            </a>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-xs text-gray-600 mt-8">
          <p>
            © 2025 Healthline Media LLC. All rights reserved. Healthline Media
            is an RVO Health Company.
          </p>
          <p>
            Our website services, content, and products are for informational
            purposes only. Healthline Media does not provide medical advice,
            diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
