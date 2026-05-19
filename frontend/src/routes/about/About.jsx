import "./about.scss";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="aboutPage">
      <div className="wrapper">
        <h1>About lestroEstate</h1>
        <p>
          Welcome to lestroEstate — a lightweight real-estate demo built with
          React and a focused UX. Explore listings, contact agents, and save
          favorites.
        </p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
