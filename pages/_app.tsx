import { atkinsonHyperlegible } from "@/lib/font";
import "@/styles/globals.css"; // Your global styles
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { appWithTranslation } from 'next-i18next';
import { StoreProvider as ArticlesStoreProvider } from "@/lib/store/articles.store";
import '@/lib/i18n';

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {

  return (
    <SessionProvider session={session}>
      <ArticlesStoreProvider>
        <div className={`${atkinsonHyperlegible.className}`}>
          <Toaster position="top-center" reverseOrder={false} />
          <Component {...pageProps} />
        </div>
      </ArticlesStoreProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App);