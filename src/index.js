import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Test() {
  const [movieStar, setMovieStar] = useState(0);
  return (
    <div>
      <StarRating maxRating={10} color="black" onSetRating={setMovieStar} />
      <p>This move has {movieStar} stars</p>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <Test />
    <StarRating
      color="red"
      size={24}
      messages={["Terrible", "Bad", "Okay", "Good", "Am azing"]}
      defaultRating={3}
    />
    <StarRating />
  </React.StrictMode>
);
