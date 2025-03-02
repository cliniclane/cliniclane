import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="fast2sms" content="HRxutiTLhVsWhWhghyCK0GPMNPC1WkCU" />
        {/* Favicons */}
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="./apple-touch-icon.png"
        />

        <link
          rel="android-chrome"
          sizes="192x192"
          href="./android-chrome-192x192.png"
        />

        <link
          rel="android-chrome"
          sizes="192x192"
          href="./android-chrome-512x512.png"
        />

        <link
          rel="icon"
          type="image/png"
          href="./favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="./favicon-16x16.png"
          sizes="16x16"
        />
        <meta name="Cliniclane" content="&nbsp;" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />

        {/* Google Tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JZ1KW909QN"
        ></Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JZ1KW909QN');
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
