// HomePage.js

import React,{useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import SessionOption from './SessionOption.js';
import './HomePage.css';
import logo from '../../images/nESTlogo.png';

const HomePage = () => {
  let navigate = useNavigate();
  const [isModelOpen, setModelOpen] = useState(false);
  const gotoStats = () => {
    const path = '/teamstats';
    navigate(path);
  };
  const gotoSession = () => {
    const path = '/createsession';
    navigate(path);
  };
  return (
    <div className="home-page-container">
        <button onClick={() => gotoSession()} className="Linkish-Button1">
          New Session
        </button>
        <button onClick={() => gotoStats()} className="Linkish-Button2">
          Stats
        </button>

      <section className="about">
      </section>
      <SessionOption isOpen={isModelOpen} onClose={() => setModelOpen(false)}/>
    </div>
  );
};

export default HomePage;