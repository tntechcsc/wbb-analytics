// PlayersPage.js

import React, { useState } from 'react';
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
      ],
    },
    // Add more players as needed
  ];

  const sessions = ['Session 1', 'Session 2']; // Hardcoded list of sessions

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  return (
    <div className="players-page-container">
      <h1>Players Page</h1>
      <label htmlFor="sessionSelect">Select Session:</label>
      <select id="sessionSelect" value={selectedSession} onChange={handleSessionChange}>
        {sessions.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
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
          {players.map((player) => {
            const session = player.sessions.find((s) => s.name === selectedSession);
            const stats = session ? session.stats : null;

            return (
              <tr key={player.id}>
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
    </div>
  );
};

export default PlayersPage;
