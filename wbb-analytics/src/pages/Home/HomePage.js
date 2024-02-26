// HomePage.js

import React,{useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import SessionOption from './SessionOption.js';
import './HomePage.css';
import logo from '../../images/nESTlogo.png';

const HomePage = () => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const gotoStats = () => {
    navigate('/teamstats');
  };
  
  return (
    <div className="home-page-container">
        <button onClick={() => setModalOpen(true)} className="Linkish-Button1">
          New Session
        </button>
        <button onClick={() => gotoStats()} className="Linkish-Button2">
          Stats
        </button>

      <section className="about">
      </section>
      <SessionOption isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
    </div>
  );
};

export default HomePage;