import React, { useState } from "react";

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
    resumeFile: null,
    passportFile: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-tl-lg pb-10 w-full"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Submit Your Resume
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Inputs with Labels */}
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
            label: "What is your salary expectation?",
            name: "salaryExpectation",
            type: "text",
            placeholder: "What is your salary expectation",
          },
        ].map((field, index) => (
          <div key={index}>
            <label className="input-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        ))}

        {/* Select Inputs with Labels */}
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

        {/* Text Inputs with Labels */}
        {[
          {
            label: "If you were an animal, which would you be?",
            name: "animalChoice",
            placeholder: "Animal which matches your personality",
          },
          {
            label: "Why are you leaving your current job?",
            name: "leavingReason",
            placeholder: "Reason?",
          },
          {
            label: "Why are you the right candidate for this job?",
            name: "rightCandidate",
            placeholder: "Explain?",
          },
          {
            label: "What are your weaknesses?",
            name: "weaknesses",
            placeholder: "Your weaknesses?",
          },
          {
            label: "What can you do for us that others can't?",
            name: "uniqueSkill",
            placeholder: "Explain",
          },
          {
            label: "Walk me through your resume",
            name: "resumeWalkthrough",
            placeholder: "Describe your resume",
          },
        ].map((field, index) => (
          <div key={index}>
            <label className="input-label">{field.label}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="input-field textarea"
            />
          </div>
        ))}

        {/* File Inputs */}
        {[
          { label: "Attach Resume File", name: "resumeFile" },
          { label: "Upload your Passport size picture", name: "passportFile" },
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
