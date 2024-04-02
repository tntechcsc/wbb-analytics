import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css'; // Ensure your CSS file is correctly imported
import logoPath from '../../images/nESTlogo.png'; // Update this path to where your logo is stored
import 'react-datepicker/dist/react-datepicker.css';
import PracticesModal from '../PracticesModal'; // Adjust the path according to your file structure
import { useAuth } from '../../hooks/AuthProvider';

export default props => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSessionOverlay, setShowSessionOverlay] = useState(false);
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
    const practices = await fetchPracticesForDate(formattedDate);
    setPracticesForSelectedDate(practices);
    setShowPracticesModal(true); // Show modal if practices are fetched
};

  // Function to toggle the session overlay
  const toggleSessionOverlay = () => {
    setShowSessionOverlay(!showSessionOverlay);
  };

  /**
 * Fetches practices based on the selected date.
 * 
 * This function should send a request to the server, passing the selected date
 * as a parameter. The server is expected to return a list of practices that occur
 * on that date. The function then updates the component's state with the fetched practices.
 * 
 * @param {String} date - The selected date in YYYY-MM-DD format.
 */
const fetchPracticesForDate = async (date) => {
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
      <button className="menu-item" onClick={() => setShowDatePicker(!showDatePicker)}>
        Open Session
      </button>
      {/* Conditional rendering of the DatePicker */}
      {showDatePicker && (
        <DatePicker
          inline
          selected={selectedDate}
          onChange={handleDateChange}
          showMonthDropdown
          showYearDropdown
          dropwdownMode="select"
        />
      )}
        {showPracticesModal && (
            <PracticesModal 
              practices={practicesForSelectedDate} 
              selectedDate={selectedDate}
              onClose={() => setShowPracticesModal(false)} />
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
