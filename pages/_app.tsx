import Head from "next/head";
import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';

import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CookiesProvider>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main id="main">
                <Component {...pageProps} />
            </main>
        </CookiesProvider>
    )
}

export default MyApp;
