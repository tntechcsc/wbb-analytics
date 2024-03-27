import React from 'react';
import './PlayerWrapper.css'; // Assuming your CSS for .player-inverted is here

function PlayerItem({ player, isSelected, ...props }) {
  return (
    <div {...props} className={`PlayerContainer ${isSelected ? 'player-inverted' : ''}`}>
      <span className="PlayerCircle">{player.number}</span>
      <span className="PlayerName">{player.name}</span>
    </div>
  );
}

export default PlayerItem;