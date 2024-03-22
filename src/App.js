// App.js
import React from 'react';
import {Route, Routes } from 'react-router-dom';
import AuthProvider from './hooks/AuthProvider';
import HomePage from './pages/Home/HomePage';
import TeamStats from './pages/TeamStats/TeamStats';
import CreateSessionsPage from './pages/SessionPage/Session';
import DrillPage from './pages/DrillPage/Drill';
import LoginPage from './pages/Login/LoginPage';
import PrivateRoute from './Private/privateRoute';



const App = () => {
  return (
  <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/homePage" element={<HomePage />} exact />
            <Route path="/teamstats" element={<TeamStats />} />
            <Route path="/createSession" element={<CreateSessionsPage />} />
            <Route path="/drill" element={<DrillPage />} />
          </Route>
        </Routes>
      </AuthProvider>
  </div>
  );
};

export default App;

