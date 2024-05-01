import React, { useState } from 'react';
import PlayerWrapper from './PlayerWrapper';

function PlayerList({ players, onPlayerSelectForShot, onPlayerSelectForSub }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const handleSelect = (player) => {
    setSelectedPlayerId(player.id);
    onPlayerSelectForShot(player);
  };

  return (
    <div className="PlayerList">
      {players.map(player => (
        <PlayerWrapper
          key={player.number}
          player={player}
          isSelected={player.id === selectedPlayerId}
          onSelect={() => handleSelect(player)}
          onLongPress={() => onPlayerSelectForSub(player)}
        />
      ))}
    </div>
  );
}

export default PlayerList;