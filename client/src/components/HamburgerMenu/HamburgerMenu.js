import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css'; // Ensure your CSS file is correctly imported
import logoPath from '../../images/nESTlogo.png'; // Update this path to where your logo is stored
import 'react-datepicker/dist/react-datepicker.css';
import PracticesModal from '../PracticesModal'; // Adjust the path according to your file structure
import { useAuth } from '../../hooks/AuthProvider';
import Register from './Register.js';


export default props => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showSessionOverlay, setShowSessionOverlay] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [showRegOverlay, setShowRegOverlay] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // To store user-selected date
  const [practicesForSelectedDate, setPracticesForSelectedDate] = useState([]); // Practices for the selected date
  const [showPracticesModal, setShowPracticesModal] = useState(false);
  const auth = useAuth();
  const BASE_URL = 'http://localhost:3001';

  // Function to handle date selection from the calendar
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    // Fetch practices for the selected date...
    const formattedDate = date.toISOString().split('T')[0];
    setShowPracticesModal(true); // Show modal if practices are fetched
};

  // Function to toggle the session overlay
  const toggleSessionOverlay = () => {
    setShowSessionOverlay(!showSessionOverlay);
  };

    return (
      <Menu>
        <img src={logoPath} alt="Logo" className="hamburger-logo" />
        <a className="menu-item" href="/homepage">
        Home
      </a>
      {  sessionStorage.getItem('site') === 'Admin' && (
      <button className="menu-item-button" onClick={() => setRegistration(true)}>
        Register A New User
      </button>
      )}
        <Link className="menu-item" to="/practice">
          Create Practice
        </Link>
        <Link className="menu-item" to="/teamstats">
          Team Stats
        </Link>
        <Link className="menu-item" to="/playerstats">
          Player Stats
        </Link>
        <Link className="menu-item" to="/export">
          Export
        </Link>
        {/* Toggle between Sign In/Sign Out based on authentication state */}
        {/* This example uses a placeholder path for illustration */}
        <Link className="menu-item" onClick={() => auth.logOut()} to="/">
          Sign In/Sign Out
        </Link>
        {/* Add additional menu items as needed */}
      </Menu>
    );
  };
