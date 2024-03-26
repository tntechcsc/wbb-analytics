import './SessionButtons.css';
import React, { useState } from 'react';

const SessionButtons = ({ setOpponentTeam, setDate }) => {
    const [opponentTeamInput, setOpponentTeamInput] = useState('');
    const [dateInput, setDateInput] = useState('');

    const handleAddSessionInfo = () => {
        if (opponentTeamInput.trim() !== '') {
            setOpponentTeam(opponentTeamInput);
        }

        if (dateInput.trim() !== '') {
            setDate(dateInput);
        }
    
        // Reset input fields
        setOpponentTeamInput('');
        setDateInput('');
    };
    
    

    return (
        <>
            {/*<div className='opp-team'>
                <h3 style={{ color: 'white' }}> Opponent Team </h3>
                <input type="text" value={opponentTeamInput} onChange={(e) => setOpponentTeamInput(e.target.value)} />
            </div>*/}

            <div className='date'>
                <h3> Date </h3>
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
            </div>

            <div>
                <button className='add-button' onClick={handleAddSessionInfo}>Add Session Info</button>
            </div>
        </>
    );
};

export default SessionButtons;