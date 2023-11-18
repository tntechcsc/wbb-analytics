// HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page-container">
      <header>
        <h1>WBB Analytics</h1>
        <p>Your Hub for Women's Basketball Statistics</p>
      </header>

      <section className="features">
        <div className="feature">
          <h2>Explore Player Stats</h2>
          <p>View detailed statistics for women's basketball players from different sessions.</p>
          <Link to="/players" className="explore-link">
            Explore Players
          </Link>
        </div>

        <div className="feature">
          <h2>Team Analytics</h2>
          <p>Analyze team performance, track trends, and make informed decisions.</p>
          <Link to="/teams" className="explore-link">
            Explore Teams
          </Link>
        </div>
      </section>

      <section className="new-session">
        <h2>Create a New Practice Session</h2>
        <p>Start a new practice session to track player progress and team performance.</p>
        <Link to="/new-session" className="explore-link">
          New Practice Session
        </Link>
      </section>

      <section className="about">
        <h2>About WBB Analytics</h2>
        <p>
          WBB Analytics provides comprehensive insights into women's basketball player performance,
          empowering coaches and enthusiasts with valuable statistical information.
        </p>
      </section>

      <footer>
        <p>© 2023 WBB Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
