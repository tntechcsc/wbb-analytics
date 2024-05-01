import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SessionButtons = ({ setDate, SeasonData, onSeasonChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedSeasonID, setSelectedSeasonID] = useState(''); // This is the season ID that will be used to create the practice session
    
    const handleAddSessionInfo = () => {
        onSeasonChange(selectedSeasonID);
        setDate(startDate.toISOString().substring(0, 10)); // Format as YYYY-MM-DD
    };

    const handleSeasonSelect = (event) => {
        setSelectedSeasonID(event.target.value);
    };

    return (
        <>
            <select onChange={handleSeasonSelect} value={selectedSeasonID}>
                {SeasonData.map((season) => (
                    <option key={season._id} value={season._id}>{season.year}</option>
                ))}
            </select>
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
                Set Date and Season
            </button>
        </>
    );
};

export default SessionButtons;