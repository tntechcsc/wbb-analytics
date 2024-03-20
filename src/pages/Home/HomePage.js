// HomePage.js

import React,{useState} from 'react';
import { useNavigate } from "react-router-dom";
import SessionOption from './SessionOption.js';
import './HomePage.css';
import { useAuth } from '../../hooks/AuthProvider';


const HomePage = () => {
  const auth = useAuth();
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
        <button onClick={() => auth.logOut()} className="log-out">
          logout
        </button>
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