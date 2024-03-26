import './DrillButtons.css';
import DrillModal from '../components/DrillModal';
import React, { useState } from 'react';

const DrillButtons = ({ drills, setDrills }) => {
    const [selectedDrillIndex, setSelectedDrillIndex] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddDrill = (name, type) => {
        if (selectedDrillIndex !== null) {
            const updatedDrills = [...drills];
            updatedDrills[selectedDrillIndex] = { name };

            setDrills(updatedDrills);
            setSelectedDrillIndex(null);
        }
        
        else
            setDrills([...drills, { name, type }]);
    };

    const handleDrillClick = (index, isModifyButton) => {
        if (isModifyButton) {
            console.log(`Clicked on modify button for drill at index ${index}`);
            setSelectedDrillIndex(index);
            setModalOpen(true);
        }
        
        else
            console.log(`Clicked on drill at index ${index}`);
    };

    const handleDeleteDrill = (index) => {
        const updatedDrills = [...drills];
        updatedDrills.splice(index, 1);
        
        setDrills(updatedDrills);
        console.log(`Deleted drill at index ${index}`);
    };

    return (
        <div>
            <ul>
            {drills.map((drill, index) => (
                <li key={index}>
                    <button className="drill-button" onClick={() => handleDrillClick(index, false)}>
                        {drill.name}
                    </button>
                    <button className="delete-drill-button" onClick={() => handleDeleteDrill(index)}>
                        Delete
                    </button>
                    <button className="modify-drill-button" onClick={() => handleDrillClick(index, true)}>
                        Modify
                    </button>
                </li>
            ))}
                <li>
                    <button className="add-drill-button" onClick={() => setModalOpen(true)}>
                    Add Drill
                    </button>
                </li>
            </ul>

            <DrillModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddDrill={handleAddDrill} />
        </div>
    );
}

export default DrillButtons;