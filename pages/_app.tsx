import Head from "next/head";
import type { AppProps } from 'next/app';

import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            </Head>
            <main id="main">
                <Component {...pageProps} />
            </main>
        </>
    )
}

export default MyApp;
