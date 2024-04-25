/*
Home:
  The Homepage where you can check the stats and or session, the central hub.
*/
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SessionOption from './SessionOption.js';
import MainLayout from '../../layouts/MainLayout.js' // Import the MainLayout component
import './Home.css';

const HomePage = () => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenReg, setModalOpenReg] = useState(false);
  // Sending to the TeamStats page
  const gotoStats = () => {
    navigate('/teamstats');
  };
  
  return (
      <div className="home-page-container">
        {/* The Displaying Button and functionally for the new session */}
          <button onClick={() => setModalOpen(true)} className="Linkish-Button1">
            New Session
          </button>
        {/* The Displaying Button and functionally for the Stats */}
          <button onClick={() => gotoStats()} className="Linkish-Button2">
            Stats
          </button>
          
        <section className="about">
        </section>
        {/* Trigger Pop up Designed in SessionOption */}
        <SessionOption isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
      </div>
  );
};

export default HomePage;
