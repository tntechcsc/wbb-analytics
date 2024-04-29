import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
 
const SessionButtons = ({ setDate }) => {
    const [startDate, setStartDate] = useState(new Date());
 
    return (
        <>
            <div className='input-field'>
                <FaCalendarAlt className="input-icon" />
                <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                        setStartDate(date);
                        setDate(date.toISOString().substring(0, 10)); // Set the date immediately when changed
                    }}
                    dateFormat="MMMM d, yyyy"
                    className="datepicker"
                />
            </div>
        </>
    );
};
 
export default SessionButtons;