import React from 'react';
import HamburgerMenu from '../components/HamburgerMenu/HamburgerMenu.js';
import './MainLayout.css';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="main-layout-header">
        <HamburgerMenu />
      </header>
      <div className="page-content">
        <Outlet /> {/* This component renders the matched child route component */}
      </div>
    </div>
  );
};

export default MainLayout;
