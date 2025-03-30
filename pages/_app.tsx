import { atkinsonHyperlegible } from "@/lib/font";
import "@/styles/globals.css"; // Your global styles
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${atkinsonHyperlegible.className}`}>
        <Toaster position="top-center" reverseOrder={false} />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
