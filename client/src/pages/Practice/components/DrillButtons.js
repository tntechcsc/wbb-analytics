import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrillModal from '../components/DrillModal';

const DrillButtons = ({ drills, setDrills, onAddDrill, onUpdateDrill, practiceID }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editDrill, setEditDrill] = useState(null);
    const navigate = useNavigate();
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handleNewDrill = (drill) => {
        if (editDrill) {
            onUpdateDrill(drill);
        } else {
            onAddDrill(drill);
        }

        setModalOpen(false);
        setEditDrill(null);
    };
    

    const handleDrillClick = (index) => {
        navigate(`/drill?PracticeID=${practiceID}&DrillID=${drills[index]._id}`);
    };

    const handleEditDrill = (index) => {
        setEditDrill(drills[index]);
        setModalOpen(true);
    };

    const handleDeleteDrill = async (index) => {
        const drillId = drills[index]._id;

        try {
            const response = await fetch(serverUrl + `/api/drills/${drillId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setDrills(currentDrills => currentDrills.filter(drill => drill._id !== drillId));

        } catch (error) {
            console.error(`Error deleting drill with ID ${drillId}:`, error);
        }
    };

    return (
        <div className="drill-list">
            <ul>
                {drills.map((drill, index) => (
                    <li key={drill._id || index}>
                        <div className="drill-card">

                            <button className="drill-button" onClick={() => handleDrillClick(index)}>
                                {drill.name}
                            </button>

                            <button className="delete-drill-button" onClick={() => handleDeleteDrill(index)}>
                                <i className="fas fa-trash"></i>
                            </button>

                            <button className="edit-drill-button" onClick={() => handleEditDrill(index)}>
                                Edit <i className="fas fa-edit"></i>
                            </button>

                        </div>
                    </li>
                ))}
                <li>
                    <button className="add-drill-button" onClick={() => {
                        setEditDrill(null);
                        setModalOpen(true);
                    }}>
                        Add Drill
                    </button>
                </li>
            </ul>
            {isModalOpen && <DrillModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddDrill={handleNewDrill} drill={editDrill} />}
        </div>
    );
};

export default DrillButtons;
