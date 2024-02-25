// pages/search.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import MoviesList from '../components/SearchList/SearchList';
import { SearchProvider } from '../context/SearchContext';

const SearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search Movies</title>
        <meta name="description" content="Search for your favorite movies" />
      </Head>
      <main>
        <SearchProvider>
          <div style={{ padding: '20px' }}>
            <h1>Search Results</h1>
            <MoviesList />
          </div>
        </SearchProvider>
      </main>
    </>
  );
};

export default SearchPage;
