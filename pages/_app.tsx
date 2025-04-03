import { atkinsonHyperlegible } from "@/lib/font";
import "@/styles/globals.css"; // Your global styles
import { getCookie, setCookie } from "cookies-next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const router = useRouter();

  const initializeLocale = async () => {
    let preferredLanguage = await getCookie('preferredLanguage');

    console.log(preferredLanguage)

    // If no preferred language is found, set default language
    if (!preferredLanguage) {
      // const userLang = navigator.language.split('-')[0]; // Detect browser language
      preferredLanguage = 'english'
      if (preferredLanguage) await setCookie('preferredLanguage', preferredLanguage);
    }

    // Ensure that the URL has the correct language segment
    const currentPath = router.pathname;

    if (
      preferredLanguage !== 'english' &&
      !currentPath.startsWith(`/${preferredLanguage}`)
    ) {
      router.replace(`/${preferredLanguage}${currentPath}`);
    } else if (
      preferredLanguage === 'english' &&
      (currentPath.startsWith(`/german`) || currentPath.startsWith(`/urdu`))
    ) {
      router.replace(currentPath.replace(/^\/(german|urdu)/, ''));
    }
  }

  // Get the preferred language
  useEffect(() => {
    initializeLocale()
  }, [router]);

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}
    >

      <SessionProvider session={session}>
        <div className={`${atkinsonHyperlegible.className}`}>
          <Toaster position="top-center" reverseOrder={false} />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </NextIntlClientProvider>

  );
}
