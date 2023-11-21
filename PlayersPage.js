import React, { useState, useEffect } from 'react';
import './PlayersPage.css';
//import players from './../../data/playerData';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [drills, setDrills] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedDrill, setSelectedDrill] = useState('');
  const [filteredDrills, setFilteredDrills] = useState([]);

  //const sessions = ['Session 1', 'Session 2'];

  //const handleSessionChange = (event) => {
  //  setSelectedSession(event.target.value);
  //};

  useEffect(() => {
    // Fetch players
    fetch('http://localhost:3001/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('Failed to fetch players:', error));

    // Fetch sessions
    fetch('http://localhost:3001/api/sessions')
      .then(response => response.json())
      .then(data => setSessions(data))
      .catch(error => console.error('Failed to fetch sessions:', error));

    // Fetch drills
    fetch('http://localhost:3001/api/drills')
      .then(response => response.json())
      .then(data => setDrills(data))
      .catch(error => console.error('Failed to fetch drills:', error));
  }, []);

  useEffect(() => {
    // Filter drills based on the selected session
    const filtered = drills.filter(drill => drill.sessionID === selectedSession);
    setFilteredDrills(filtered);
  }, [selectedSession, drills]);

  return (
    <div className="players-page-container">
      <h1>Players Page</h1>
      {/* Session Dropdown */}
      <label htmlFor="sessionSelect">Select Session:</label>
      <select id="sessionSelect" onChange={(e) => setSelectedSession(e.target.value)}>
        {sessions.map((session) => (
          <option key={session._id} value={session._id}>{session.date}</option>
        ))}
      </select>

      {/* Drill Dropdown (dependent on the selected session) */}
      <label htmlFor="drillSelect">Select Drill:</label>
      <select id="drillSelect" onChange={(e) => setSelectedDrill(e.target.value)}>
        {filteredDrills.map((drill) => (
          <option key={drill._id} value={drill._id}>{drill.name}</option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>2pt %</th>
            <th>3pt %</th>
            <th>FT %</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Steals</th>
            <th>Blocks</th>
            <th>Turnovers</th>
          </tr>
        </thead>
        <tbody>
  {players.map((player) => (
    <tr key={player._id}> {/* Use '_id' as it's the MongoDB unique identifier */}
      <td>
      <div style={{ textAlign: 'center' }}> {/* Center the content */}
          <img 
            src={`/${player.image}`} 
            alt={player.name} 
            style={{ maxWidth: '50px', height: 'auto', display: 'block', margin: '0 auto' }} 
          />
          <div>{player.name}</div> {/* Player name directly under the image */}
        </div>
      </td>
      
      {/* The following cells can be removed or commented out if stats are not available */}
      {/* 
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td> */}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default PlayersPage;
