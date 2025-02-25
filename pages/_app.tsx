import { atkinsonHyperlegible } from "@/lib/font";
import "@/styles/globals.css"; // Your global styles
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${atkinsonHyperlegible.className}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </div>
  );
}
