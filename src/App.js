import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import TeamStats from './pages/TeamStats/TeamStats';
//import PlayerStats from './pages/PlayerStats/PlayerStats';
//import Practice from './pages/Practice/Practice';
import Drill from './pages/Drill/Drill'

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teamstats" element={<TeamStats />} />
        <Route path="/drill" element={<Drill />} />

    </Routes>
  );
};

export default App;
