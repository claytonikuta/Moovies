// pages/_app.tsx

import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
// import { theme } from '../theme';
import { SearchProvider } from '../context/SearchContext';
import Navbar from '../components/Navbar/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <MantineProvider theme={theme}>
    <MantineProvider defaultColorScheme="dark">
      <Head>
        <title>Moovies</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <SessionProvider>
        <SearchProvider>
          <Navbar />
          <Component {...pageProps} />
        </SearchProvider>
      </SessionProvider>
    </MantineProvider>
  );
}
