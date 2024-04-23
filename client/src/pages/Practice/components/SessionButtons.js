import React, { useState } from 'react';
import './SessionButtons.css';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS

const SessionButtons = ({ setOpponentTeam, setDate }) => {
    const [opponentTeamInput, setOpponentTeamInput] = useState('');
    const [startDate, setStartDate] = useState(new Date());

    const handleAddSessionInfo = () => {
        if (opponentTeamInput.trim()) {
            setOpponentTeam(opponentTeamInput);
        }
        setDate(startDate.toISOString().substring(0, 10)); // Format as YYYY-MM-DD
        setOpponentTeamInput('');
    };

    return (
        <>
            <div className='input-field'>
                <FaUsers className="input-icon" />
                <input
                    type="text"
                    placeholder="Enter opponent team"
                    value={opponentTeamInput}
                    onChange={e => setOpponentTeamInput(e.target.value)}
                />
            </div>

            <div className='input-field'>
                <FaCalendarAlt className="input-icon" />
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMMM d, yyyy"
                    className="datepicker"
                />
            </div>

            <button className='add-button' onClick={handleAddSessionInfo}>
                Add Practice Info
            </button>
        </>
    );
};

export default SessionButtons;