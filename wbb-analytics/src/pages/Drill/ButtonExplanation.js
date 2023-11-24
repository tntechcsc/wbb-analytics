// ButtonExplanation.js

import React, { useState } from 'react';
import './DrillPage.css';

const ButtonExplanation = ({ isOpen, onClose, whichButton, whichPlayer}) => {

  const updateParagraph = () => { //You have to *call* the function within the HTML in order to get it to change what it gives
    switch(whichButton){
      case "Rebound":
        return <p>The Rebound button is pressed when {whichPlayer} has created a rebound, and adds 1 to the session's rebound count.</p>;
      case "Steal":
        return <p>The Steal button is pressed when {whichPlayer} performs a steal, and adds 1 to the session's and the selected player's steal count.</p>
      case "Turnover":
        return <p>The Turnover Button is pressed when {whichPlayer} performs a Turnover, and adds 1 to the session's Turnover count.</p>
      case "Assist":
        return <p>The Assist button is pressed when {whichPlayer} performs an assist, and adds 1 to the player's and session's Assist count.</p>
      default:
        return <p>How did you get here?</p>
    }
  }
  
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>The {whichButton} Button</h2>
          {updateParagraph()}         
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default ButtonExplanation;
