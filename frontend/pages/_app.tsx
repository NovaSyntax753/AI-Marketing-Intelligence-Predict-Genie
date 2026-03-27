import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global Meta (SEO + Branding) */}
      <Head>
        <title>AI Marketing Intelligence</title>
        <meta name="description" content="Predict and analyze marketing engagement using AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}