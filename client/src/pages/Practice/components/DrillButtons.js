import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DrillButtons.css';
import DrillModal from '../components/DrillModal'; // Adjust the import path as necessary

const DrillButtons = ({ drills, setDrills, onAddDrill, practiceID }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate
    const serverUrl = useState(process.env.REACT_APP_SERVER_URL);

    // Function to handle adding a new drill
    const handleNewDrill = (drill) => {
        onAddDrill(drill); // Calls the function passed from Practice to add the drill to the backend
        setModalOpen(false); // Close the modal after adding the drill
    };

    const handleDrillClick = (index) => {
        console.log(`Clicked on drill at index ${index}`);
        navigate(`/drill?PracticeID=${practiceID}&DrillID=${drills[index]._id}`); // Navigate to the drill details page
    };

    const handleDeleteDrill = async (index) => {
        const drillId = drills[index]._id; // Access the _id of the drill to be deleted

        try {
            // Assuming you have a function or API endpoint to delete the drill by its ID
            const response = await fetch(serverUrl + `/api/drills/${drillId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any necessary authentication headers
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(`Drill with ID ${drillId} deleted successfully`);
            // Update the local state to remove the deleted drill
            setDrills(currentDrills => currentDrills.filter(drill => drill._id !== drillId));
        } catch (error) {
            console.error(`Error deleting drill with ID ${drillId}:`, error);
        }
    };

    return (
        <div>
            <ul>
                {drills.map((drill, index) => (
                    <li key={drill._id || index}>
                        <button className="drill-button" onClick={() => handleDrillClick(index)}>
                            {drill.name}
                        </button>
                        <button className="delete-drill-button" onClick={() => handleDeleteDrill(index)}>
                            Delete
                        </button>
                    </li>
                ))}
                <li>
                    <button className="add-drill-button" onClick={() => setModalOpen(true)}>
                        Add Drill
                    </button>
                </li>
            </ul>

            <DrillModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddDrill={handleNewDrill} />
        </div>
    );
};

export default DrillButtons;
