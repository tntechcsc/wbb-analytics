import React, { useState } from 'react';
import './CreateSessionPage.css';

const SessionInfoModal = ({ isOpen, onClose, onAddSessionInfo }) => {
  const [opponentTeam, setOpponentTeam] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAddSessionInfo = () => {
    // Check if the opponent team, start time, and end time are not empty
    if (opponentTeam.trim() !== '' && startTime.trim() !== '' && endTime.trim() !== '') {
      onAddSessionInfo(opponentTeam.trim(), startTime.trim(), endTime.trim());
      setOpponentTeam('');
      setStartTime('');
      setEndTime('');
      onClose();
    }
  };



  return (
    isOpen && (
      <div className="session-info-modal-overlay">
        <div className="session-info-modal-content">
          <h2>Session Information</h2>
          <label htmlFor="opponentTeam">Opponent Team:</label>
          <input
            type="text"
            id="opponentTeam"
            value={opponentTeam}
            onChange={(e) => setOpponentTeam(e.target.value)}
            placeholder='If None, enter NA'
          />
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button onClick={handleAddSessionInfo}>Add Session Information</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default SessionInfoModal;