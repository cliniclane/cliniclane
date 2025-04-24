import React, { FormEvent, useEffect, useRef, useState } from 'react'
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useRouter } from 'next/router';

const ContactForm = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        message: "",
        pathname: ""
    });

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
                        phoneNumber: "",
                        pathname: ""
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

    const [isFixed, setIsFixed] = useState(true);
    const triggerHeight = 4500; // Adjust this scroll value

    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY < triggerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`w-full md:max-w-xs shadow border bg-gray-100 rounded-lg p-3 pb-6 ${isFixed
                    ? "fixed right-[2vw] bottom-14 xl:right-[5vw]"
                    : "absolute right-[2vw] top-[4500px] xl:right-[5vw]"
                }`}
        >
            <form ref={form} onSubmit={sendEmail} className="">
                <p className='text-xl font-bold text-gray-900 mb-5 text-center'>
                    Do you wanna talk to consult?
                </p>
                <div className="mb-5">
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder='Your Name*'
                        className="bg-gray-50 placeholder:text-gray-500 text-lg border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-gray-50 border placeholder:text-gray-500 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Your Email*"
                        required
                    />
                </div>
                <div className="mb-5 hidden">
                    <input
                        type=""
                        id="pathname"
                        name="pathname"
                        value={router.asPath.toString()}
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg placeholder:text-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Your Phone Number*"
                        required
                    />
                </div>
                <div className="mb-5">
                    <textarea
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                        id="message"
                        name="message"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg placeholder:text-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Message*"
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
                    className="text-white disabled:bg-gray-300 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg w-full px-5 py-2.5 text-center"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ContactForm