import React from 'react';
import './TempoButton.css';

function TempoButton({ tempoType, isTiming, onClick, className }) {
  return (
    <button className={className} onClick={onClick}>
      {isTiming ? `Stop ${tempoType} Tempo` : `Start ${tempoType} Tempo`}
    </button>
  );
}

export default TempoButton;
