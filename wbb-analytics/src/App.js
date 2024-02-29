// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import PlayersPage from './pages/Stats/PlayersPage';
import TeamStats from './pages/TeamStats/TeamStats';
import CreateSessionsPage from './pages/CreateSession/CreateSessionPage';
import DrillPage from './pages/Drill/DrillPage';
import TempoPage from './pages/Tempo/Tempo';
import LoginPage from './pages/Login/LoginPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/tempo" element={<TempoPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/teamstats" element={<TeamStats />} />
        <Route path="/createsession" element={<CreateSessionsPage />} />
        <Route path="/drill" element={<DrillPage/>}/>
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/" element={<LoginPage />}/>
      </Routes>
    </div>
  );
};

export default App;
