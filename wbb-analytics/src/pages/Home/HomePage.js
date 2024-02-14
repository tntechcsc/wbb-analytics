// HomePage.js

import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import SessionOption from './SessionOption.js';
import './HomePage.css';



const HomePage = () => {
  const [isModelOpen, setModelOpen] = useState(false);

  return (
    <div className="home-page-container">
      <header>
        <h1>WBB Analytics</h1>
        <p>Your Hub for Women's Basketball Statistics</p>
      </header>

      

      <section className="new-session">
        <h2>Create a New Practice Session</h2>
        <p>Start a new practice session to track player progress and team performance.</p>
        <button onClick={() => setModelOpen(true)} className="Linkish-Button">
          New Session
        </button>
      </section>

      <section className="open-session">
        <h2>Explore Stats</h2>
        <p>View details of women's basketball team</p>
        <button className="Linkish-Button">
          Stats
        </button>
      </section>

      <section className="about">
        <h2>About WBB Analytics</h2>
        <p>
          WBB Analytics provides comprehensive insights into women's basketball player performance,
          empowering coaches and enthusiasts with valuable statistical information.
        </p>
      </section>
      <SessionOption isOpen={isModelOpen} onClose={() => setModelOpen(false)}/>
    </div>
  );
};

export default HomePage;