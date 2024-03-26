import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import TeamStats from './pages/TeamStats/TeamStats';
import PlayerStats from './pages/PlayerStats/PlayerStats';
import Practice from './pages/Practice/Practice';
import Drill from './pages/Drill/Drill'
import MainLayout from './layouts/MainLayout';
import ExportPage from './pages/ExportPage'; // Import the ExportPage component

const App = () => {
  return (
    <MainLayout>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teamstats" element={<TeamStats />} />
          <Route path="/drill" element={<Drill />} />
          <Route path="/playerstats" element={<PlayerStats />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/practice" element={<Practice />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
