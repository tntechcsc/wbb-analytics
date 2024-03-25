import React from 'react';
import './CancelButton.css';

function CancelButton({ onCancel }) {
  return (
    <button className="CancelButton" onClick={onCancel}>
      Cancel
    </button>
  );
}

export default CancelButton;
