import React from 'react';
import PlayerItem from './PlayerItem'; // Adjust the import path as necessary
import './PlayerList.css';

function PlayerList({ players, onLongPress, onSelect }) {
  return (
    <div className="PlayerList">
      {players.map(player => (
        <PlayerItem key={player.number} player={player} onLongPress={onLongPress} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default PlayerList;
