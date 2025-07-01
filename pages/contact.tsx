import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useTranslation } from "next-i18next";

const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        message: "",
    });

    const { t } = useTranslation("common");

    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                "template_awf0vtm",
                form.current!,
                {
                    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
                }
            )
            .then(
                () => {
                    console.log("SUCCESS!");
                    toast.success("Form submitted successfully!");
                    setFormData({
                        fullName: "",
                        email: "",
                        message: "",
                    });
                    setLoading(false);
                    form.current?.reset();
                },
                (error) => {
                    console.log("FAILED...", error.text);
                    setLoading(false);
                    toast.error("Submission failed. Please try again.");
                }
            );
    };

    return (
        <div className="w-full">
            {/*
       * Navbar
       */}
            <Navbar />
            {/* Content */}
            <main className="my-10 p-5 flex flex-col md:px-14 xl:px-20">
                <div className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-bold">
                        {t("letsGetInTouch")}
                    </span>
                    <div className="w-full mt-10">
                        <form ref={form} onSubmit={sendEmail} className="max-w-sm mx-auto">
                            <div className="mb-5">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
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
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
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
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    id="message"
                                    name="message"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Type here..."
                                    required
                                />
                            </div>

                            {typeof window !== "undefined" && (
                                <input
                                    type="text"
                                    name="hostname"
                                    id="hostname"
                                    value={window?.location?.hostname.replace("www.", "")}
                                    className="border p-1 hidden justify-normal h-10 rounded-md w-full"
                                />
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="text-white disabled:bg-gray-300 mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
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