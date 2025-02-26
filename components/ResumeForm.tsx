import React, { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salaryExpectation: "",
    jobLocation: "",
    visaStatus: "",
    animalChoice: "",
    coverLetter: "",
    leavingReason: "",
    rightCandidate: "",
    weaknesses: "",
    uniqueSkill: "",
    resumeWalkthrough: "",
    resumeFile: null as File | null,
    passportFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Handle text, select, and textarea inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // Convert file to Base64
      reader.onload = () => {
        setFormData({ ...formData, [name]: reader.result as string });
      };
    }
  };

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
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
            name: "",
            email: "",
            phone: "",
            position: "",
            salaryExpectation: "",
            jobLocation: "",
            visaStatus: "",
            animalChoice: "",
            coverLetter: "",
            leavingReason: "",
            rightCandidate: "",
            weaknesses: "",
            uniqueSkill: "",
            resumeWalkthrough: "",
            resumeFile: null,
            passportFile: null,
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

  // Handle form submission with validation
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Check if required fields are filled
    const requiredFields = [
      "name",
      "email",
      "phone",
      "position",
      "salaryExpectation",
      "jobLocation",
      "visaStatus",
      "animalChoice",
      "leavingReason",
      "rightCandidate",
      "weaknesses",
      "uniqueSkill",
      "resumeWalkthrough",
      "coverLetter",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error("Please fill out all required fields.");
        setLoading(false);
        return;
      }
    }

    if (form.current) {
      // Clear specific input values
      const fileInputs = form.current.querySelectorAll('input[type="file"]');
      // @ts-expect-error:""
      fileInputs.forEach((input) => (input.value = "")); // Reset the file input
    }

    sendEmail(e);
  };

  return (
    <form
      ref={form}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg w-full max-w-8xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Submit Your Resume
      </h2>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Text Inputs */}
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "number" },
          { label: "Position Apply For", name: "position", type: "text" },
          {
            label: "Salary Expectation",
            name: "salaryExpectation",
            type: "number",
          },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1 text-sm">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              className="border p-2 rounded-md w-full h-10"
            />
          </div>
        ))}

        {/* Dropdowns */}
        {[
          {
            label: "Preferred Job Location",
            name: "jobLocation",
            options: ["Qatar", "India", "UAE", "Saudi Arabia", "Canada"],
          },
          {
            label: "Visa Status",
            name: "visaStatus",
            options: [
              "Employment",
              "Spouse",
              "Visit",
              "Student",
              "Citizen",
              "Parent sponsor",
            ],
          },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1 text-sm">{field.label}</label>
            <select
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              className="border p-2 rounded-md w-full h-10"
            >
              <option value="">Please choose an option</option>
              {field.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Textareas (Now same size as inputs) */}
        {[
          { label: "Description or Cover Letter", name: "coverLetter" },
          { label: "What are your weaknesses?", name: "weaknesses" },
          {
            label: "If you an animal, which you want to be?",
            name: "animalChoice",
          },
          {
            label: "Why are you leaving your current job?",
            name: "leavingReason",
          },
          { label: "Why are you the right candidate?", name: "rightCandidate" },
          {
            label: "What can you do for us that others can't?",
            name: "uniqueSkill",
          },
          { label: "Walk me through your resume", name: "resumeWalkthrough" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1 text-sm">{field.label}</label>
            <textarea
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              className="border p-2 rounded-md w-full h-10"
            />
          </div>
        ))}

        {/* File Inputs */}
        {[
          { label: "Attach Resume File", name: "resumeFile" },
          { label: "Upload Your Passport Size Picture", name: "passportFile" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1 text-sm">{field.label}</label>
            <input
              type="file"
              name={field.name}
              onChange={handleFileChange}
              className="border p-1 justify-normal h-10 rounded-md w-full"
            />
          </div>
        ))}
        {typeof window !== "undefined" && (
          <input
            type="text"
            name="hostname"
            value={window?.location?.hostname}
            className="border p-1 hidden justify-normal h-10 rounded-md w-full"
          />
        )}
        <input
          type="text"
          name="pathname"
          value={router.asPath.replace("/", "")}
          className="border p-1 hidden justify-normal h-10 rounded-md w-full"
        />
      </div>

      <div className="w-full flex items-center justify-center">
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-60 disabled:bg-gray-300 bg-blue-600 text-white py-3 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;
