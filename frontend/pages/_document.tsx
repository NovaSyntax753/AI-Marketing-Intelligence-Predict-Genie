import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#4f46e5" />

        {/* Google Font (optional but recommended) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className="bg-gray-50 text-gray-900 font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
