import Head from "next/head";
import { parse } from "cookie";
import { CookiesProvider } from "react-cookie";
import App, { AppContext, AppProps } from 'next/app';

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

MyApp.getInitialProps = async (appContext: AppContext) => {
    const { ctx: { req, res, pathname } } = appContext
    const cookies = parse(req?.headers.cookie ?? '');

    if (cookies.account === undefined && pathname !== "/") res?.writeHead(401, { Location: `/?return=${pathname}` }).end();

    return { ...(await App.getInitialProps(appContext)) }
}

export default MyApp;
