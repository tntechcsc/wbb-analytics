// HomePage.js

import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import SessionOption from './SessionOption.js';
import './HomePage.css';
import logo from '../../images/nESTlogo.png';

const HomePage = () => {
  const [isModelOpen, setModelOpen] = useState(false);
  
  return (
    <div className="home-page-container">
        <button onClick={() => setModelOpen(true)} className="Linkish-Button1">
          New Session
        </button>
        <button className="Linkish-Button2">
          Stats
        </button>

      <section className="about">
      </section>
      <SessionOption isOpen={isModelOpen} onClose={() => setModelOpen(false)}/>
    </div>
  );
};

export default HomePage;