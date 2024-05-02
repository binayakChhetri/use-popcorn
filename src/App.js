import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "3b4c6309";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const query = "sdfsdf";

  // useEffect doesn't return anything, so we don't store the result into any variable.
  // But instead we pass in a function. This function is then called our effect, and it will
  // contain the code that we want to run as a side effects.
  // So basically, we use useEffect hook to register an effect.
  // Register means that we want the code not to run as the component renders, but actually after
  // it has been painted onto the screen.

  // We also pass an empty array as the 2nd argument, this means that this effect will only be executed as the component
  // first mounts.
  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        // As soon as the error is thrown, the code below it won't run
        if (!res.ok) {
          throw new Error("Error occured while fetching movies");
        }

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        console.log(data);
      } catch (err) {
        console.error(err.messaage);
        setError(err.messaage);
      } finally {
        setIsLoading(false);
      }

      // Why we get two ouput in the console even if we do only one console.log() ?
      // Its because of React.strict mode.
      // When strict mode is activated in React 18, our effects not only run once but twice. This is just so that React can identify if there are any problems
      // with our effects.
      // React will call our effects twice, but only in development not in the production phase.
      // console.log(data.Search);
    }
    fetchMovies();
  }, []);

  //NOTE
  // Below code will fire multiple fetch requests to the API, which ofcourse is a very bad thing. Why?
  // Because setting the state in render logic will then immediately cause the component to re-render itself
  // again.
  // As the component renders, the state will be set. Since the state is set, the component will render again. Again
  // the state will be set. This cycles continues and be an infinite loop.
  // This is the reason why setting state in render logic is not allowed.

  // To solve this problem, we use useEffect hook.✅

  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //   .then((res) => res.json())
  //   .then((data) => setMovies(data.Search));

  // Same thing for below code.
  // setWatched([]);

  return (
    <>
      {/* Eliminating prop drillng by using  component composition*/}
      <NavBar>
        <Search />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* METHOD 1: PASSING AS CHILDREN PROPS (Implicit way)*/}
        {/* PREFERRED WAY */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {/* Only one of these three can be true at the same time i.e they are mutually exclusive*/}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage messaage={error} />}
        </Box>

        <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>

        {/* METHOD 2: PASSING ELEMENTS AS PROPS (More explicitily)*/}
        {/* This pattern is used in some library, for example, in React router */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />{" "}
              <WatchedList watched={watched} />
            </>
          }
        /> */}
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader"> Loading...</p>;
}

function ErrorMessage({ messaage }) {
  return (
    <p className="error">
      <span>{messaage}</span>
    </p>
  );
}

// NAV BAR COMPONENTS
function NavBar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  );
}

function NumResults({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </>
  );
}

// Main section components
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>{" "}
        {isOpen && children}
      </div>
    </>
  );
}

/* function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen2((open) => !open)}
        >
          {isOpen2 ? "–" : "+"}
        </button>
        {isOpen2 && (
          <>
            <WatchedSummary watched={watched} />
            <WatchedList watched={watched} />
          </>
        )}
      </div>
    </>
  );
} */

function MovieList({ movies }) {
  return (
    <>
      <ul className="list">
        {movies?.map((movie) => (
          <List movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    </>
  );
}

function List({ movie }) {
  return (
    <>
      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}

function WatchedList({ watched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <WatchedItem movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    </>
  );
}

function WatchedItem({ movie }) {
  return (
    <>
      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
    </>
  );
}
