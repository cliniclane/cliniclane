import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";

import { IoCopyOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";
import MDXRenderer from "../../components/MDXRenderer";
import { extractHeadings } from "../../lib/extractHeadings";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";

const articleData = {
  title: "Everything You Need to Know About Insomnia",
  slug: "everything_you_need_to_know_about_insomnia",
  tags: [
    "insomnia",
    "health",
    "fatigue",
    "lifestyle",
    "food",
    "mental health",
    "sleep",
    "meditation",
    "wellness",
  ],
  description:
    " Insomnia occurs when you are unable to get the sleep you need to feel refreshed. Causes range from stress to chronic health conditions. Treatments include therapy, medications, or lifestyle changes",
  author: "Amélie Laurent",
  headerImage:
    "https://images.unsplash.com/photo-1502322328990-fc8f47a2d9a5?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  publishDate: "2025-02-17T00:00:00.000Z",
  mdxString: `# Introduction

## What is Insomnia?

Insomnia is a common sleep disorder that makes it difficult to fall asleep, stay asleep, or wake up too early and not be able to go back to sleep. Over time, it can lead to serious health issues, affecting both physical and mental well-being.

## Causes of Insomnia

There are several potential causes of insomnia, including:

- **Stress and Anxiety** – Overthinking and stress can keep your brain active at night.
- **Poor Sleep Habits** – Irregular sleep schedules, using screens before bed, or an uncomfortable sleep environment.
- **Medical Conditions** – Chronic pain, asthma, or acid reflux can disrupt sleep.
- **Caffeine & Alcohol** – Stimulants like coffee and excessive alcohol intake can interfere with sleep cycles.
- **Lifestyle Factors** – Shift work, frequent travel, or an inconsistent bedtime routine.

# Effects of Insomnia

Lack of sleep can have several negative consequences, including:

- **Daytime Fatigue** – Low energy and reduced productivity.
- **Memory Issues** – Difficulty concentrating and remembering things.
- **Weakened Immune System** – Increased risk of illnesses.
- **Mood Disorders** – Anxiety, depression, and irritability.
- **Increased Risk of Chronic Conditions** – Heart disease, obesity, and diabetes.

# How to Improve Sleep Quality

### 1. Maintain a Consistent Sleep Schedule
Going to bed and waking up at the same time every day helps regulate your body’s internal clock.

### 2. Create a Relaxing Bedtime Routine
Engage in calming activities before bed, such as:
- Reading a book
- Meditation or deep breathing exercises
- Listening to soft music

### 3. Limit Screen Time Before Bed
Exposure to blue light from phones and computers can suppress melatonin production, making it harder to sleep.

### 4. Watch Your Diet
Avoid caffeine and heavy meals before bedtime. Instead, try herbal teas like chamomile.

### 5. Optimize Your Sleep Environment
Ensure your bedroom is:
- Dark
- Quiet
- Cool
- Comfortable

### 6. Exercise Regularly
Physical activity during the day can improve sleep quality, but avoid intense workouts right before bed.

## When to Seek Help

If your insomnia persists for weeks and affects your daily life, consult a healthcare professional. Sleep therapy or medication may be needed in some cases.

# Conclusion

Insomnia can be frustrating, but with the right lifestyle changes and habits, you can improve your sleep quality and overall well-being. Prioritize good sleep hygiene and seek professional help if necessary.

---

**Did you find this helpful?**
`,
};

const Article = () => {
  const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  > | null>(null);
  const [headings, setHeadings] = useState<string[]>([]);

  useEffect(() => {
    async function loadMDX() {
      const mdxString = articleData.mdxString;
      const mdxSource = await serialize(mdxString);
      setMdxContent(mdxSource);

      // Extract h1 headings
      const extractedHeadings = await extractHeadings(mdxString);
      setHeadings(extractedHeadings);
    }
    loadMDX();
  }, []);
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/*
       * Content
       */}
      <main className="my-10 p-5 flex flex-col md:px-14 xl:px-20">
        {/* Header */}
        <div className="flex flex-col">
          {/* Title */}
          <h1 className="font-bold text-5xl md:w-[80%]">{articleData.title}</h1>
          {/* Tags */}
          <div className="flex flex-wrap mt-5">
            {articleData.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block mt-2 bg-gray-200 px-2 py-1 text-sm text-gray-700 rounded-sm mr-2"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <span className="text-2xl mt-10 md:w-[80%] text-gray-800">
            {articleData.description}
          </span>
          {/* Image */}
          <div className="mt-10">
            <div className="relative">
              <Image
                src={articleData.headerImage} // Change to actual image path
                alt="Blog Header"
                width={1200} // Fixed width
                height={600} // Fixed height
                className="w-full h-[500px] object-cover rounded-lg"
              />
              {/* Bottom Left Text */}
              <div className="absolute bottom-4 left-4 text-white text-sm">
                <p className="font-light">Written by</p>
                <p className="font-semibold">{articleData.author}</p>
              </div>
              <div className="absolute bottom-4 left-40 text-white text-sm">
                <p className="font-light">Published on</p>
                <p className="font-semibold">
                  {new Date(articleData.publishDate).toDateString()}
                </p>
              </div>
              {/* Social Icons & Copy Link */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="border hover:bg-white hover:text-black border-white p-2 text-sm rounded-md text-white flex items-center gap-2">
                  <IoCopyOutline />
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-32 mt-16">
          {/* Feed */}
          <div className="col-span-2 flex flex-col leading-8">
            {mdxContent ? (
              <MDXRenderer source={mdxContent} />
            ) : (
              <p>Loading MDX...</p>
            )}
          </div>
          {/* Guide Points */}
          <div className="flex flex-col w-full mt-10">
            <ul className="w-full">
              {headings.map((heading, index) => (
                <li key={index} className="pb-3 sm:pb-4 w-full">
                  <div className="w-full border-b py-2 border-black flex justify-between items-center">
                    <span className="font-medium text-2xl">{heading}</span>
                    <Link href={`#${heading}`}>
                      <BsArrowRight size={28} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      {/*
       * Form
       */}
      <div className="flex flex-col justify-center py-10 items-center bg-gray-100 p-5  md:px-14 xl:px-20">
        <ResumeForm />
        <iframe
          src="https://talent-assessment.testgorilla.com/75af304e-79f4-49c4-8307-5653e458691f"
          width="100%"
          height="100vh"
          className="overflow-hidden h-screen"
        />
      </div>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
};

export default Article;
