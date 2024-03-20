// App.js
import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './hooks/AuthProvider';
import HomePage from './pages/Home/HomePage';
import PlayersPage from './pages/Stats/PlayersPage';
import TeamStats from './pages/TeamStats/TeamStats';
import CreateSessionsPage from './pages/CreateSession/CreateSessionPage';
import DrillPage from './pages/Drill/DrillPage';
import TempoPage from './pages/Tempo/Tempo';
import LoginPage from './pages/Login/LoginPage';
import PrivateRoute from './components/privateRoute';



const App = () => {
  return (
  <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/homePage" element={<HomePage />} exact />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/teamStats" element={<TeamStats />} />
            <Route path="/createSession" element={<CreateSessionsPage />} />
            <Route path="/drill" element={<DrillPage />} />
            <Route path="/tempo" element={<TempoPage />} />
          </Route>
        </Routes>
      </AuthProvider>
  </div>
  );
};

export default App;

