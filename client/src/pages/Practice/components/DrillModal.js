import React, { useState, useEffect } from 'react';

const DrillModal = ({ isOpen, onClose, onAddDrill, drill }) => {
    const [drillName, setDrillName] = useState('');

    useEffect(() => {
        if (drill) {
            setDrillName(drill.name);
        }
    }, [drill]);

    const handleAddDrill = () => {
        if (drillName.trim() !== '') {
            onAddDrill({ ...drill, name: drillName.trim()});
            setDrillName('');
            onClose();
        }
    };

    return isOpen && (
        <div className="drill-modal-overlay">
            <div className="drill-modal-content">
                <h2>{drill ? 'Edit Drill' : 'Create New Drill'}</h2>
                <label htmlFor="drillName">Name:</label>
                <input type="text" id="drillName" value={drillName} onChange={e => setDrillName(e.target.value)} />

                <button className='drill-modal-adddrill-button' onClick={handleAddDrill}>
                    {drill ? 'Update Drill' : 'Add Drill'}
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DrillModal;