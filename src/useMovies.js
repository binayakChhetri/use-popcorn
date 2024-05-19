import { useEffect, useState } from "react";
const KEY = "3b4c6309";

// Using named exports for custom hooks.
// Using default export for component.
// Not mandatory though
export function useMovies(query) {
  // Here this is a function not component. We accept arguments in function not props.
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //   closeMovieCallback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          // As soon as the error is thrown, the code below it won't run
          if (!res.ok) throw new Error("Error occured while fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err.messaage);
          }
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

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort(); // It will abort the current fetch request each time there is a new request.
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
