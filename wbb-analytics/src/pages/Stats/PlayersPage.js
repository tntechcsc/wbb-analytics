// PlayersPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PlayersPage.css';

const PlayersPage = () => {
  const [selectedSession, setSelectedSession] = useState('Session 1');

  const players = [
    {
      id: 1,
      name: 'Player 1',
      sessions: [
        {
          name: 'Session 1',
          stats: {
            '2ptPercentage': 50,
            '3ptPercentage': 40,
            'freeThrowPercentage': 85,
            rebounds: 10,
            assists: 5,
            steals: 2,
            blocks: 1,
            turnovers: 3,
          },
        },
        {
          name: 'Session 2',
          stats: {
            '2ptPercentage': 55,
            '3ptPercentage': 38,
            'freeThrowPercentage': 88,
            rebounds: 8,
            assists: 7,
            steals: 3,
            blocks: 2,
            turnovers: 2,
          },
        },
        // Add more sessions as needed
      ],
    },
    {
      id: 2,
      name: 'Player 2',
      sessions: [
        {
          name: 'Session 1',
          stats: {
            '2ptPercentage': 48,
            '3ptPercentage': 42,
            'freeThrowPercentage': 82,
            rebounds: 12,
            assists: 4,
            steals: 1,
            blocks: 0,
            turnovers: 5,
          },
        },
        {
          name: 'Session 2',
          stats: {
            '2ptPercentage': 52,
            '3ptPercentage': 36,
            'freeThrowPercentage': 90,
            rebounds: 9,
            assists: 6,
            steals: 2,
            blocks: 1,
            turnovers: 4,
          },
        },
        // Add more sessions as needed
      ],
    },
    {
      id: 3,
      name: 'Player 3',
      sessions: [
        {
          name: 'Session 1',
          stats: {
            '2ptPercentage': 45,
            '3ptPercentage': 38,
            'freeThrowPercentage': 80,
            rebounds: 15,
            assists: 3,
            steals: 0,
            blocks: 0,
            turnovers: 6,
          },
        },
        {
          name: 'Session 2',
          stats: {
            '2ptPercentage': 50,
            '3ptPercentage': 34,
            'freeThrowPercentage': 85,
            rebounds: 10,
            assists: 5,
            steals: 1,
            blocks: 0,
            turnovers: 5,
          },
        },
        // Add more sessions as needed
      ],
    },
    {
      id: 4,
      name: 'Player 4',
      sessions: [
        {
          name: 'Session 1',
          stats: {
            '2ptPercentage': 40,
            '3ptPercentage': 35,
            'freeThrowPercentage': 75,
            rebounds: 18,
            assists: 2,
            steals: 0,
            blocks: 0,
            turnovers: 7,
          },
        },
        {
          name: 'Session 2',
          stats: {
            '2ptPercentage': 45,
            '3ptPercentage': 30,
            'freeThrowPercentage': 80,
            rebounds: 12,
            assists: 4,
            steals: 0,
            blocks: 0,
            turnovers: 6,
          },
        },
        // Add more sessions as needed
      ],
    },
    {
      id: 5,
      name: 'Player 5',
      sessions: [
        {
          name: 'Session 1',
          stats: {
            '2ptPercentage': 35,
            '3ptPercentage': 32,
            'freeThrowPercentage': 70,
            rebounds: 20,
            assists: 1,
            steals: 0,
            blocks: 0,
            turnovers: 8,
          },
        },
        {
          name: 'Session 2',
          stats: {
            '2ptPercentage': 40,
            '3ptPercentage': 28,
            'freeThrowPercentage': 75,
            rebounds: 15,
            assists: 3,
            steals: 0,
            blocks: 0,
            turnovers: 7,
          },
        },
        // Add more sessions as needed
      ],
    },
    // Add more players as needed
  ];

  // Dynamically generate the list of sessions from players data
  const sessions = [...new Set(players.flatMap(player => player.sessions.map(session => session.name)))];

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const calculateAverageTempo = (tempoType) => {
    // ... (your tempo calculation logic)
  };

  return (
    <div className="container">
      <h1>Players Page</h1>

      <div className="dropdown-and-tempo">
        <label htmlFor="sessionSelect">Select Session:</label>
        <select id="sessionSelect" value={selectedSession} onChange={handleSessionChange}>
          {sessions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>

        <div className="average-tempo">
          <div className="rounded-square">
            <span>Avg Offensive Tempo:</span>
            {calculateAverageTempo('offensiveTempo')}
          </div>
        </div>

        <div className="average-tempo">
          <div className="rounded-square">
            <span>Avg Defensive Tempo:</span>
            {calculateAverageTempo('defensiveTempo')}
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
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
          {players.map((player) => {
            const session = player.sessions.find((s) => s.name === selectedSession);
            const stats = session ? session.stats : null;

            return (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td>{stats ? stats['2ptPercentage'] : 'N/A'}</td>
                <td>{stats ? stats['3ptPercentage'] : 'N/A'}</td>
                <td>{stats ? stats['freeThrowPercentage'] : 'N/A'}</td>
                <td>{stats ? stats['rebounds'] : 'N/A'}</td>
                <td>{stats ? stats['assists'] : 'N/A'}</td>
                <td>{stats ? stats['steals'] : 'N/A'}</td>
                <td>{stats ? stats['blocks'] : 'N/A'}</td>
                <td>{stats ? stats['turnovers'] : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default PlayersPage;
