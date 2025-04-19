import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";
import MDXRenderer from "../components/MDXRenderer";
import { extractHeadings } from "../lib/extractHeadings";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import { NextSeo } from "next-seo";
import { Articles, Translations } from "@prisma/client";
import { GetStaticProps, GetStaticPaths } from "next";
import { setCookie } from "cookies-next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


interface ArticleProps {
    articleData: Articles;
    locale: string;
}

const Article = ({ articleData, locale }: ArticleProps) => {
    const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult<
        Record<string, unknown>,
        Record<string, unknown>
    > | null>(null);
    const [headings, setHeadings] = useState<string[]>([]);
    const [translatedContent, setTranslatedContent] = useState<Translations | undefined>(undefined);

    const [showAssessMent, setShowAssessMent] = useState(false);
    // const [currImage, setCurrImage] = useState(articleData?.images ? articleData.images[0] : "");

    useEffect(() => {
        if (articleData.translations && locale !== "english" && articleData.translations.length > 0) {
            const translations = articleData.translations.find(t => t.language === locale);
            if (translations) {
                setTranslatedContent(translations);
            }
        }
        else {
            setTranslatedContent(undefined)
        }
    }, [locale])

    useEffect(() => {
        async function loadMDX() {
            const mdxString = locale === "english"
                ? articleData.mdxString
                : articleData.translations?.find((t) => t.language === locale)?.mdxString || "";
            const mdxSource = await serialize(mdxString);
            setMdxContent(mdxSource);

            // Extract h1 headings
            const extractedHeadings = await extractHeadings(mdxString);
            setHeadings(extractedHeadings);
        }
        loadMDX();
    }, [locale]);

    useEffect(() => {
        setCookie('preferredLanguage', locale)
    }, [locale])

    return (
        <div className="w-full">
            {/*
       * SEO
       */}
            <NextSeo
                title={translatedContent ? translatedContent.title : articleData.title}
                description={translatedContent ? translatedContent.description : articleData.description}
                canonical={articleData.canonical}
                additionalMetaTags={[
                    {
                        name: "keywords",
                        content: articleData.tags.join(", "),
                    },
                ]}
                openGraph={{
                    url: articleData.canonical,
                    title: translatedContent ? translatedContent.openGraphTitle ?? "" : articleData.openGraphTitle ?? "",
                    description: translatedContent ? translatedContent.openGraphDescription ?? "" : articleData.openGraphDescription ?? "",
                    images: [
                        {
                            url: articleData.openGraphImage || "",
                            width: 800,
                            height: 600,
                            alt: "Og Image Alt",
                            type: "image/jpeg",
                        },
                        {
                            url: articleData.openGraphImage || "",
                            width: 900,
                            height: 800,
                            alt: "Og Image Alt Second",
                            type: "image/jpeg",
                        },
                        { url: articleData.openGraphImage || "" },
                        { url: articleData.openGraphImage || "" },
                    ],
                    siteName: "ClinicLane",
                }}
            />

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
                    <h1 className="font-bold text-5xl leading-snug md:w-[80%]">{translatedContent ? translatedContent.title : articleData.title}</h1>
                    <p className="text-gray-500 italic text-left mt-2">
                        {new Date(articleData.publishDate).toDateString()}
                    </p>
                    <div className="grid md:grid-cols-1 gap-10">
                        {/* Image */}
                        {/* <div className="mt-10">
                            <div className="grid grid-cols-3 grid-rows-2 gap-3">
                                <div className="col-span-3">
                                    <Image
                                        src={currImage} // Change to actual image path
                                        alt="Blog Header"
                                        width={500} // Fixed width
                                        height={400} // Fixed height
                                        className="w-full h-[300px] object-cover rounded-lg"
                                    />
                                </div>
                                {articleData?.images && articleData?.images?.map((image, i) => (
                                    <div key={i} onClick={() => setCurrImage(image)}
                                        className={`${currImage === image ? "border p-1 h-fit rounded-lg" : ""}`}
                                    >
                                        <Image
                                            src={image} // Change to actual image path
                                            alt="Blog Header"
                                            width={200} // Fixed width
                                            height={100} // Fixed height
                                            className="w-full h-[100px] object-cover rounded-lg"
                                        />
                                    </div>
                                ))
                                }
                            </div>
                        </div> */}
                        {/* Tags */}
                        <div className="flex h-fit flex-wrap mt-5 mb-24">
                            {translatedContent ?
                                (
                                    translatedContent?.tags?.filter(item => item !== "").map((tag, i) => (
                                        <span
                                            key={i}
                                            className="inline-block mt-2 bg-gray-200 px-2 py-1 text-sm text-gray-700 rounded-sm mr-2"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                )
                                : articleData.tags.filter(item => item !== "").map((tag, i) => (
                                    <span
                                        key={i}
                                        className="inline-block mt-2 bg-gray-200 px-2 py-1 text-sm text-gray-700 rounded-sm mr-2"
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-32">
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
            <div
                id="career"
                className="flex flex-col justify-center py-16 items-center bg-gray-100 p-5  md:px-14 xl:px-20"
            >
                <ResumeForm />
                <button
                    onClick={() => {
                        setShowAssessMent(!showAssessMent);
                    }}
                    className="w-60 px-4 py-3 bg-blue-600 my-10 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                >
                    Take the Assessment
                </button>
                {showAssessMent && (
                    <iframe
                        src={`${process.env.NEXT_PUBLIC_TEST_URL
                            }/nx/view/page/${encodeURIComponent(
                                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${articleData.slug}`
                            )}`}
                        width="100%"
                        height="120vh"
                        className="overflow-hidden h-screen"
                    />
                )}
            </div>
            {/*
       * Footer
       */}
            <Footer />
        </div>
    );
};


export const getStaticPaths: GetStaticPaths = async ({ }) => {
    const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/article/all`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const articles: Articles[] = await res.json();

    const paths: { params: { slug: string }; locale: string }[] = [];

    for (const article of articles) {
        // Generate page for default article language
        if (
            article.language &&
            article.slug &&
            (article.language !== "english" || article.mdxString?.trim() !== "")
        ) {
            paths.push({
                params: { slug: article.slug },
                locale: article.language,
            });
        }

        // Generate pages for each translation
        article.translations?.forEach((translation) => {
            if (
                translation.language &&
                translation.mdxString?.trim() !== ""
            ) {
                paths.push({
                    params: { slug: article.slug },
                    locale: translation.language,
                });
            }
        });
    }

    return {
        paths,
        fallback: "blocking", // ISR enabled
    };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const slug = params?.slug as string;

    if (!slug || !locale) {
        return { notFound: true };
    }

    const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/article/${slug}`;
    const res = await fetch(url);

    if (!res.ok) return { notFound: true };

    const blog = await res.json();

    // Ensure mdxString is available for this locale
    const isDefaultLocale = blog.language === locale;
    const mdxContent = isDefaultLocale
        ? blog.mdxString
        : blog.translations.find((t: Translations) => t.language === locale)?.mdxString;

    if (!mdxContent?.trim()) return { notFound: true };


    return {
        props: {
            articleData: blog,
            locale,
            ...(await serverSideTranslations(locale, ["common"])),
        },
        revalidate: 60,
    };
};


export default Article;