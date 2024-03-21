// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import TeamStats from './pages/TeamStats/TeamStats';
<<<<<<< HEAD:wbb-analytics/src/App.js
import CreateSessionsPage from './pages/CreateSession/CreateSessionPage';
import TempoPage from './pages/Tempo/Tempo';
=======
import CreateSessionsPage from './pages/SessionPage/Session';
import Drill from './pages/DrillPage/Drill';
>>>>>>> origin/main:src/App.js

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/drill" element={<Drill />} />
        <Route path="/teamstats" element={<TeamStats />} />
        <Route path="/createsession" element={<CreateSessionsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
