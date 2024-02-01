// App.js
import React from 'react';
import Tempo from './pages/Tempo/Tempo'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import PlayersPage from './pages/Stats/PlayersPage';
import TeamStatsPage from './pages/TeamStats/TeamStatsPage';
import CreateSessionsPage from './pages/CreateSession/CreateSessionPage';
import DrillPage from './pages/Drill/DrillPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/teamstats" element={<TeamStatsPage />} />
        <Route path="/createsession" element={<CreateSessionsPage />} />
        <Route path="/drill" element={<DrillPage/>}/>
        <Route path='/tempo' element={<Tempo />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;

