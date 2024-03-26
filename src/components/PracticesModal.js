import React from 'react';

const PracticesModal = ({ practices, selectedDate, onClose }) => {
  return (
    <div className="practices-modal">
      <h2>Practices for {selectedDate.toDateString()}</h2>
      <ul>
        {practices.map((practice, index) => (
          <li key={index}>#{index + 1} - {practice.name}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PracticesModal;
