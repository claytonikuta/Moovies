import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from './movie.module.css';

const API_KEY = process.env.NEXT_PUBLIC_MOVIEDB_API_KEY;

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
}

interface Trailer {
  id: string;
  key: string;
}

interface Genre {
  id: number;
  name: string;
}

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  const fetchMovieDetails = async (movieId: string | string[]) => {
    try {
      const [movieResponse, trailersResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: API_KEY,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          params: {
            api_key: API_KEY,
          },
        }),
      ]);

      setMovie(movieResponse.data);
      setTrailers(trailersResponse.data.results.filter((video: any) => video.type === 'Trailer'));
      setGenres(movieResponse.data.genres);
    } catch (error) {
      console.error('An error occurred while fetching movie details', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{movie.title}</h1>
      {movie.poster_path && (
        <img
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
          alt={movie.title}
        />
      )}
      <p className={styles.overview}>{movie.overview}</p>
      <div className={styles.genres}>
        <strong>Genres: </strong>
        {genres.map((genre) => (
          <span key={genre.id} className={styles.genre}>
            {genre.name}
          </span>
        ))}
      </div>
      <p className={styles.rating}>
        <strong>Rating:</strong> {Math.round(movie.vote_average * 10)}%
      </p>
      <p className={styles.releaseDate}>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <div className={styles.carouselContainer}>
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots"
          draggable
          focusOnSelect={false}
          infinite
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 3,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {trailers.map((trailer) => (
            <div className={styles.iframeContainer}>
              <iframe
                key={trailer.id}
                title={movie.title}
                src={`https://www.youtube.com/embed/${trailer.key}`}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
