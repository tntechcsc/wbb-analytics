// TeamStatsPage.js

import React, { useState } from 'react';
import players from './../../data/playerData'; // Updated import path
import { useLocation } from 'react-router-dom';
import './TeamStatsPage.css'; // Import CSS for styling

const TeamStatsPage = () => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedSession, setSelectedSession] = useState('All Sessions'); // Default to "All Sessions"

  const handlePlayerSelection = (playerId) => {
    // Toggle player selection
    setSelectedPlayers((prevSelectedPlayers) => {
      if (prevSelectedPlayers.includes(playerId)) {
        return prevSelectedPlayers.filter((id) => id !== playerId);
      } else {
        return [...prevSelectedPlayers, playerId];
      }
    });
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const calculatePlayerAverages = () => {
    // Calculate averages for selected players and session
    const selectedPlayerStats = selectedPlayers.map((playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (selectedSession === 'All Sessions') {
        // Combine stats across all sessions and calculate averages
        const totalStats = player.sessions.reduce((acc, session) => {
          Object.keys(session.stats).forEach((statName) => {
            if (statName !== 'rebounds' && statName !== 'assists' && statName !== 'steals' && statName !== 'blocks' && statName !== 'turnovers') {
              // Exclude specific stats
              acc[statName] = (acc[statName] || 0) + session.stats[statName];
            }
          });
          return acc;
        }, {});
  
        const numSessions = player.sessions.length;
        return Object.keys(totalStats).reduce((acc, statName) => {
          acc[statName] = totalStats[statName] / numSessions;
          return acc;
        }, {});
      } else {
        // Calculate stats for the selected session only
        const session = player.sessions.find((s) => s.name === selectedSession);
        return session ? session.stats : null;
      }
    });
  
    // Calculate averages excluding specific stats
    const averages = {};
    if (selectedPlayerStats.length > 0) {
      Object.keys(selectedPlayerStats[0]).forEach((statName) => {
        if (statName !== 'rebounds' && statName !== 'assists' && statName !== 'steals' && statName !== 'blocks' && statName !== 'turnovers') {
          averages[statName] = selectedPlayerStats.reduce((acc, player) => (acc + (player ? player[statName] : 0)), 0) / selectedPlayerStats.length;
        }
      });
    }
  
    return averages;
  };

  const teamAverages = calculatePlayerAverages();

  return (
    <div className="team-stats-container">
      <h1>Team Stats Page</h1>
      <div>
        <h2>Select Session:</h2>
        <select value={selectedSession} onChange={handleSessionChange}>
          <option value="All Sessions">All Sessions</option>
          {players.length > 0 &&
            players[0].sessions.map((session) => (
              <option key={session.name} value={session.name}>
                {session.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <h2>Select Players:</h2>
        <ul className="player-list">
          {players.map((player) => (
            <li key={player.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(player.id)}
                  onChange={() => handlePlayerSelection(player.id)}
                />
                {player.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Player Averages:</h2>
        <ul className="averages-list">
          {Object.entries(teamAverages).map(([stat, average]) => (
            <li key={stat}>
              <strong>{stat}:</strong> {average.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamStatsPage;

