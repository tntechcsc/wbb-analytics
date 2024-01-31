import React from "react";
import './TempoButton.css'

function TempoButton({ tempoType, isTiming, onClick, className, disabled }) {
  // Combining the passed className with a default class for styling
  const buttonClass = `TempoButton ${className}`;

  return (
      <button 
          className={buttonClass} 
          onClick={onClick} 
          disabled={disabled}
      >
          {isTiming ? `Stop ${tempoType} Tempo` : `Start ${tempoType} Tempo`}
      </button>
  );
}

export default TempoButton;
