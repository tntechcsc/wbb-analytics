// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import TeamStats from './pages/TeamStats/TeamStats';

import CreateSessionsPage from './pages/SessionPage/Session';
import Drill from './pages/DrillPage/Drill';

import PlayerStats from './pages/TeamStats/PlayerStats/PlayerStats';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/drill" element={<Drill />} />
        <Route path="/teamstats" element={<TeamStats />} />
        <Route path="/playerstats" element={<PlayerStats />} />
        <Route path="/createsession" element={<CreateSessionsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
