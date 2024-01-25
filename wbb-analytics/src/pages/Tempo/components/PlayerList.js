import React from 'react';
import './PlayerList.css';

function PlayerList() {
  // Placeholder for player data, you would probably fetch this data or pass it as props
  const players = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

  return (
    <div className="PlayerList">
      {players.map((player, index) => (
        <div key={index} className="Player">
          {player}
        </div>
      ))}
    </div>
  );
}

export default PlayerList;
