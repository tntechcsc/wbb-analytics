import React, { useState, useEffect } from 'react';
import Selector from './components/Selector';
import Heatmap from './components/Heatmap';
import TempoCard from './components/TempoCard';
import StatCard from './components/StatsDisplay';
import StatsTable from './components/StatsTable';
import NavagationHeader from './components/NavagationHeader';
import './TeamStats.css';

function TeamStats() {
  const [sessions, setSessions] = useState([]);
  const [allDrills, setAllDrills] = useState([]);
  const [filteredDrills, setFilteredDrills] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/sessions')
      .then(response => response.json())
      .then(data => {
        const formattedSessions = data.map(session => ({
          label: `Session: ${session.Date}`,
          value: session._id.toString(), // Convert to string for consistency
        }));
        setSessions(formattedSessions);

        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdParam = urlParams.get('sessionId');

        if (sessionIdParam && data.some(session => session._id.toString() === sessionIdParam)) {
          setSelectedSession(sessionIdParam);
        }
      })
      .catch(error => {
        console.error('Failed to fetch sessions:', error);
      });

    fetch('http://localhost:3001/api/drills')
      .then(response => response.json())
      .then(data => {
        setAllDrills(data); // Assuming drills do not need to be formatted
      })
      .catch(error => {
        console.error('Failed to fetch drills:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = allDrills.filter(drill => drill.SessionID === selectedSession);
    const formattedDrills = filtered.map(drill => ({
      label: drill.DrillName,
      value: drill._id,
    }));
    setFilteredDrills(formattedDrills);
  }, [selectedSession, allDrills]);

  const handleSessionChange = (event) => {
    const newSessionId = event.target.value;
    setSelectedSession(newSessionId);

    // Update the URL with the new session ID
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sessionId', newSessionId);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
};


  return (
    <div className="team-stats-container">
      <header className="team-header">
        <NavagationHeader />
      </header>

      <div className="selectors">
        <Selector
          options={sessions}
          onChange={handleSessionChange}
          label="Session"
          value={selectedSession}
        />
        <Selector
          options={filteredDrills}
          onChange={() => { }}
          label="Drill"
          value=""
          disabled={!selectedSession} // Enable drill selector only when a session is selected
        />
      </div>

      <div className="detailed-stats">
        <div className="tempo-cards">
          <TempoCard title="Avg Offensive Tempo" tempo="15.3" />
          <TempoCard title="Avg Defensive Tempo" tempo="14.8" />
        </div>
        <div className="heatmap">
          <Heatmap />
        </div>
      </div>

      <div className="stats-overview">
        <StatCard title="Total Points" value="78" />
        <StatCard title="Total Rebounds" value="32" />
        <StatCard title="Total Assists" value="15" />
      </div>

      <div className='stats-table-container'>
        <h2>Team Stats</h2>
        <div className="stats-table">
          {/* StatsTable component might go here */}
        </div>
      </div>
    </div>
  );
}

export default TeamStats;
