import React, { useState } from 'react';
import './DrillModal.css';

const DrillModal = ({ isOpen, onClose, onAddDrill }) => {
  const [drillName, setDrillName] = useState('');

  const handleAddDrill = () => {
    // Check if the drillName is not empty
    if (drillName.trim() !== '') {
      onAddDrill(drillName.trim());
      setDrillName('');
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="drill-modal-overlay">
        <div className="drill-modal-content">
          <h2>Create New Drill</h2>

          <label htmlFor="drillName">Name:</label>
          <input
            type="text"
            id="drillName"
            value={drillName}
            onChange={(e) => setDrillName(e.target.value)}
          />

          <button onClick={handleAddDrill}>Add Drill</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default DrillModal;