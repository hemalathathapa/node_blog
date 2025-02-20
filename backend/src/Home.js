import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the world of blogs!</h1>
      <p className="home-subtitle">The more you write, the better you'll get.</p>
      <Link to="/add" className="home-button">
        You can start here →
      </Link>
    </div>
  );
};

export default Home;
