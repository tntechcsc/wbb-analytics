// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import PlayersPage from './pages/Stats/PlayersPage';
import TeamStatsPage from './pages/TeamStats/TeamStatsPage';
import CreateSessionsPage from './pages/CreateSession/CreateSessionPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/teamstats" element={<TeamStatsPage />} />
        <Route path="/createsession" element={<CreateSessionsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;