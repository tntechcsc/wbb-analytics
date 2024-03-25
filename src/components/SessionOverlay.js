import React from 'react';
import { useHistory } from 'react-router-dom';

const SessionOverlay = ({ onClose }) => {
    const history = useHistory();

    // Dummy sessions for illustration
    const sessions = [
        { id: '1', name: 'Session 1' },
        { id: '2', name: 'Session 2' },
        // Add more sessions as needed
    ];

    const handleSessionSelect = (sessionId) => {
        // Close the overlay
        onClose();
        // Redirect to the Practice Tempo Page with the selected sessionId
        history.push(`/tempo/${sessionId}`);
    };

    return (
        <div className="session-overlay">
            <h2>Select a Session</h2>
            <ul>
                {sessions.map(session => (
                    <li key={session.id} onClick={() => handleSessionSelect(session.id)}>
                        {session.name}
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default SessionOverlay;
