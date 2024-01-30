import React from 'react';
import './PlayerList.css'; // Ensure you have the correct path to your CSS file

function PlayerList({ players, onPlayerClick }) {
  return (
    <div className="PlayerList">
      {players.map(player => (
        <div key={player.number} className="PlayerContainer" onClick={() => onPlayerClick(player)}>
          <div className="PlayerCircle">{player.number}</div>
          <div className="PlayerName">{player.name}</div>
        </div>
      ))}
    </div>
  );
}

export default PlayerList;
