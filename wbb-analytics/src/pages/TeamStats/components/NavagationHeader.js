import React, { useState } from 'react';
import './NavigationHeader.css';

function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation-header">
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isMenuOpen ? "bar1 change" : "bar1"}></div>
        <div className={isMenuOpen ? "bar2 change" : "bar2"}></div>
        <div className={isMenuOpen ? "bar3 change" : "bar3"}></div>
      </div>
      <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
        <li><a href="/homePage">Home</a></li>
        <li><a href="/createsession">Create Session</a></li>
        <li><a href="/stats">Stats</a></li>
      </ul>
    </nav>
  );
}

export default NavigationHeader;
