import Head from "next/head";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";

import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <main id="main">
        <Component {...pageProps} />
      </main>
    </CookiesProvider>
  );
}

export default MyApp;
