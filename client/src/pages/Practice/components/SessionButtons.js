import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SessionButtons = ({ setDate }) => {
    const [startDate, setStartDate] = useState(new Date());

    const handleAddSessionInfo = () => {
        setDate(startDate.toISOString().substring(0, 10)); // Format as YYYY-MM-DD
    };

    return (
        <>
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
                Set Date
            </button>
        </>
    );
};

export default SessionButtons;