// ButtonExplanation.js

import React, { useState } from 'react';
import './DrillPage.css';

const ButtonExplanation = ({ isOpen, onClose, whichButton }) => {
  const [drillName, setDrillName] = useState('');
  const [drillType, setDrillType] = useState('');
  const [paraBody, setParaBody] = useState("");

  const updateParagraph () => {
    switch(whichButton){
      case "Rebound":
        setParaBody("The Rebound button is pressed when a player has created a rebound, and adds 1 to the session's rebound count.");
        break;
    }
  }
  
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>The {whichButton} Button</h2>
          <p>{paraBody}</p>         
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default ButtonExplanation;
