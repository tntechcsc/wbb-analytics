// HomePage.js

import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import OpenSession from './OpenSession';
import './HomePage.css';



const HomePage = () => {
  const [isModelOpen, setModelOpen] = useState(false);

  return (
    <div className="home-page-container">
      <header>
      <div className="logo-container">
      <img src={`${process.env.PUBLIC_URL}/nESTlogo.png`} alt="nEST Logo" className="logo" />
      </div>
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
          <Link to="/teamstats" className="explore-link">
            Explore Teams
          </Link>
        </div>
      </section>

      <section className="new-session">
        <h2>Create a New Practice Session</h2>
        <p>Start a new practice session to track player progress and team performance.</p>
        <Link to="/createsession" className="explore-link">
          New Practice Session
        </Link>
      </section>

      <section className="open-session">
        <h2>Open Existing Session</h2>
        <p>Access and review details of a previously created practice session.</p>
        <button onClick={() => setModelOpen(true)} className="Linkish-Button">
          Open Existing Session
        </button>
      </section>

      <section className="about">
        <h2>About WBB Analytics</h2>
        <p>
          WBB Analytics provides comprehensive insights into women's basketball player performance,
          empowering coaches and enthusiasts with valuable statistical information.
        </p>
      </section>
      <OpenSession isOpen={isModelOpen} onClose={() => setModelOpen(false)}/>
    </div>
  );
};

export default HomePage;
