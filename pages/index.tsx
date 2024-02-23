// pages/index.tsx
import React, { useEffect } from 'react';
import MoviesList from '../components/MoviesList/MoviesList';
import useMovieLists from '../hooks/useMovieLists';

const MoviesPage = () => {
  const { loadData } = useMovieLists();

  useEffect(() => {
    loadData();
  }, [loadData]); // Ensure loadData is listed as a dependency

  return (
    <div>
      <MoviesList />
    </div>
  );
};

export default MoviesPage;
