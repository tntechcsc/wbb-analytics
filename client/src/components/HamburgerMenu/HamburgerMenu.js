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

{
    console.log(`Fetching practices for date: ${date}`);
    try {
      const response = await fetch(`${BASE_URL}/api/practices/byDate/${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, such as Authorization headers
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const practices = await response.json();
      // Update state with the fetched practices
    } catch (error) {
      console.error('Failed to fetch practices:', error);
      // Handle errors, such as by showing an error message to the user
    }
  };

  return (
    <Menu>
      <img src={logoPath} alt="Logo" className="hamburger-logo" />
      <a className="menu-item" href="/homepage">
        Home
      </a>
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
      {sessionStorage.getItem('site') === 'Admin' && (
        <button className="menu-item-button" onClick={() => setRegistration(true)}>
          Create Registration Key
        </button>
      )}
      {registration && (
        <Register isOpen={registration} onClose={() => setRegistration(false)} />
      )}

      {showPracticesModal && (
        <PracticesModal
          practices={practicesForSelectedDate}
          selectedDate={selectedDate}
          onClose={() => setShowPracticesModal(false)} />
      )}
      <Link className="menu-item" onClick={() => auth.logOut()} to="/">
        Sign In/Sign Out
      </Link>
    </Menu>
  );
};
