import React, { useState } from 'react';
import './PlayersPage.css';
import players from './../../data/playerData';

const PlayersPage = () => {
  const [selectedSession, setSelectedSession] = useState('Session 1');

  const sessions = ['Session 1', 'Session 2'];

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
