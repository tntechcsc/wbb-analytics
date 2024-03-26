// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './hooks/AuthProvider';
import Home from './pages/Home/Home';
import TeamStats from './pages/TeamStats/TeamStats';
import PlayerStats from './pages/PlayerStats/PlayerStats';
import Practice from './pages/Practice/Practice';
import Drill from './pages/Drill/Drill'
import MainLayout from './layouts/MainLayout';
import ExportPage from './pages/ExportPage';



const App = () => {
  return (
  <div>
      <MainLayout>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PrivateRoute/>}>
              <Route path="/homepage" element={<Home />} exact />
              <Route path="/playerstats" element={<PlayerStats />} />
              <Route path="/teamstats" element={<TeamStats />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/drill" element={<Drill />} />
              <Route path="/export" element={<ExportPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MainLayout>
  </div>
  );
};

export default App;

