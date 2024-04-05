// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SessionOption from './SessionOption.js';
import Register from './Register.js';
import MainLayout from '../../layouts/MainLayout.js' // Import the MainLayout component
import './Home.css';

const HomePage = () => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenReg, setModalOpenReg] = useState(false);
  
  const gotoStats = () => {
    navigate('/teamstats');
  };
  
  return (
      <div className="home-page-container">
        {  localStorage.getItem('site') === 'Admin' && (
          <button className="Linkish-Button1">
            Register
          </button>
        )}
          <button onClick={() => setModalOpen(true)} className="Linkish-Button1">
            New Session
          </button>
          <button onClick={() => gotoStats()} className="Linkish-Button2">
            Stats
          </button>

        <section className="about">
        </section>
        <Register isOpen={isModalOpenReg} onClose={() => setModalOpenReg(false)}/>
        <SessionOption isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
      </div>
  );
};

export default HomePage;
