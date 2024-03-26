import React from 'react';
import useLongPress from './useLongPress';

const PlayerItem = ({ player, onLongPress, onSelect }) => {
  const longPressProps = useLongPress(
    () => onLongPress(player),
    () => onSelect(player),
    { shouldPreventDefault: true, delay: 500 }
  );

  return (
    <div {...longPressProps} className="PlayerContainer">
      <div className={"PlayerCircle PlayerCircle" + player.number}>{player.number}</div>
      <div className="PlayerName">{player.name}</div>
    </div>
  );
};

export default PlayerItem;
