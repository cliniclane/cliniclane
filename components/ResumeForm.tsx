import React, { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

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

  const form = useRef<HTMLFormElement>(null);

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
          form.current?.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Submission failed. Please try again.");
        }
      );
  };

  // Handle form submission with validation
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      "resumeFile",
      "passportFile",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error("Please fill out all required fields.");
        return;
      }
    }

    sendEmail(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={form}
      className="bg-white p-6 rounded-lg pb-10 w-full"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Submit Your Resume
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
        {/* Text Inputs */}
        {[
          {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter your name",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Enter your email",
          },
          {
            label: "Phone Number",
            name: "phone",
            type: "text",
            placeholder: "Enter your phone number",
          },
          {
            label: "Position Apply For",
            name: "position",
            type: "text",
            placeholder: "Position name",
          },
          {
            label: "Salary Expectation",
            name: "salaryExpectation",
            type: "text",
            placeholder: "Enter your expected salary",
          },
        ].map((field, index) => (
          <div key={index}>
            <label className="input-label text-sm">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              // @ts-expect-error:""
              value={formData[field.name as keyof typeof formData] || ""}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        ))}

        {/* Select Inputs */}
        {[
          {
            label: "Preferred Job Location",
            name: "jobLocation",
            options: ["Remote", "On-Site"],
          },
          {
            label: "Visa Status",
            name: "visaStatus",
            options: ["Citizen", "Work Visa"],
          },
        ].map((field, index) => (
          <div key={index}>
            <label className="input-label">{field.label}</label>
            <select
              name={field.name}
              // @ts-expect-error:""
              value={formData[field.name as keyof typeof formData] || ""}
              onChange={handleChange}
              className="input-field"
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

        {/* Text Inputs */}
        {[
          {
            label: "What are your weaknesses?",
            name: "weaknesses",
            placeholder: "Your weaknesses?",
          },
          {
            label: "If you were an animal, which would you be?",
            name: "animalChoice",
            placeholder: "Animal that matches your personality",
          },
          {
            label: "Why are you leaving your current job?",
            name: "leavingReason",
            placeholder: "Reason for leaving",
          },
          {
            label: "Why are you the right candidate?",
            name: "rightCandidate",
            placeholder: "Explain why you are a good fit",
          },
          {
            label: "What can you do for us that others can't?",
            name: "uniqueSkill",
            placeholder: "Describe your unique skill",
          },
          {
            label: "Walk me through your resume",
            name: "resumeWalkthrough",
            placeholder: "Describe your resume",
          },
        ].map((field, index) => (
          <div key={index} className="flex flex-col items-baseline">
            <label className="input-label">{field.label}</label>
            <input
              name={field.name}
              // @ts-expect-error:""
              value={formData[field.name as keyof typeof formData] || ""}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        ))}

        {/* File Inputs */}
        {[
          { label: "Attach Resume File", name: "resumeFile" },
          { label: "Upload Your Passport Size Picture", name: "passportFile" },
        ].map((field, index) => (
          <div key={index}>
            <label className="input-label">{field.label}</label>
            <input
              type="file"
              name={field.name}
              onChange={handleFileChange}
              className="file-hidden"
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-submit w-60 float-right">
        Submit
      </button>
    </form>
  );
};

export default ResumeForm;
