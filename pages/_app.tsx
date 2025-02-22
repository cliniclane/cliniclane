import { atkinsonHyperlegible } from "@/lib/font";
import "@/styles/globals.css"; // Your global styles
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${atkinsonHyperlegible.className}`}>
      <Component {...pageProps} />
    </div>
  );
}
