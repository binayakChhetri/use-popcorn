import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const KEY = "3b4c6309";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  // useEffect doesn't return anything, so we don't store the result into any variable.
  // But instead we pass in a function. This function is then called our effect, and it will
  // contain the code that we want to run as a side effects.
  // So basically, we use useEffect hook to register an effect.
  // Register means that we want the code not to run as the component renders, but actually after
  // it has been painted onto the screen.

  // We also pass an empty array as the 2nd argument, this means that this effect will only be executed as the component
  // first mounts.
  /*
  EXPERMENTING WITH THE useEffects 

  useEffect(() => console.log("After initial render"), []);
  useEffect(() => console.log("After every render"));

  useEffect(() => console.log(query), [query]);

  console.log("During Render");
*/

  // const [watched, setWatched] = useState(function () {
  //   // The callback function must be a pure function.
  //   // This function is only executed once in the initial render and is simply ignored on subsequent re-renders.
  //   // Whenever the initial value of the state depends on some sort of computation, we should always initialize a function
  //   // like this. Not call the function inside state.
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);

  //   // We should not do this. Becoz react will call this function on every render.
  //   // useState(localStorage.getItem('watched'))
  // });

  function handleSelectMovie(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(watchedMovie) {
    // for (let i = 0; i < watched.length; i++) {
    //   if (watched[i].imdbID === watchedMovie.imdbID) return;
    // }

    setWatched((currWatched) => [...currWatched, watchedMovie]);
  }

  function handleDelWatched(id) {
    setWatched((currWatched) =>
      currWatched.filter((item) => item.imdbID !== id)
    );
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

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
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* METHOD 1: PASSING AS CHILDREN PROPS (Implicit way)*/}
        {/* PREFERRED WAY */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {/* Only one of these three can be true at the same time i.e they are mutually exclusive*/}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage messaage={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDelWatched={handleDelWatched} />
            </>
          )}
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

function Search({ query, setQuery }) {
  /* 
  This is not how we are supposed to select DOM elements in React.
  Instead we need the concept of refs for this purpose.
  useEffect(function () {
    const searchElement = document.querySelector(".search");
    console.log(searchElement);
    searchElement.focus();
  }, []);
*/

  // Using ref to select DOM elements

  const inputEle = useRef(null);

  useKey(function () {
    if (document.activeElement === inputEle.current) return;
    inputEle.current.focus();
    setQuery("");
  }, "Enter");

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEle}
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
        </button>
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

function MovieList({ movies, onSelectMovie }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <List
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </ul>
    </>
  );
}

function List({ movie, onSelectMovie }) {
  return (
    <>
      <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
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
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((item) => item.imdbID).includes(selectedId);
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) {
        countRef.current++;
      }
    },
    [userRating]
  );

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd(newMovie) {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // Each time below effect is executed, it will basically add one more event listener to the document.
  // So we need to cleanup our event listener to prevent such behaviour.

  useKey(onCloseMovie, "escape");

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);

        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title} `;

      // Cleanup function => function that we return from an effect
      return function () {
        document.title = "usePopcorn";

        // This cleanup function actually runs after the component has already
        // un-mounted/disappeared from the component tree.

        // If that's the case how the function remember the "title" variable ??
        // It's because of the very important concept in javascript called "closure"
        // Closure in JS menas, that a function will always remember all the variables
        // that were present at the time and the pace that the function was created.

        // In

        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img alt={`Poster of ${title} movie`} src={poster} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐ {imdbRating} IMDb rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                    defaultRating={0}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        handleAdd(movie);
                      }}
                    >
                      + Add
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
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
            <span>{avgImdbRating.toFixed(2)}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating.toFixed(2)}</span>
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

function WatchedList({ watched, onDelWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <WatchedItem
            movie={movie}
            key={movie.imdbID}
            onDelWatched={onDelWatched}
          />
        ))}
      </ul>
    </>
  );
}

function WatchedItem({ movie, onDelWatched }) {
  return (
    <>
      <li key={movie.imdbID}>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
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
          <button
            className="btn-delete"
            onClick={() => onDelWatched(movie.imdbID)}
          >
            X
          </button>
        </div>
      </li>
    </>
  );
}
