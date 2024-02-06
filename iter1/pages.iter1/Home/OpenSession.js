import React, { useState } from 'react';
import CreateSession from './../CreateSession/CreateSessionPage';
import StoredSessions from './../../data/sessionData';
import { useNavigate } from "react-router-dom";
import './HomePage.css'
const OpenSession = ({isOpen,onClose}) => {
    let navigate = useNavigate();
    const [selectedSession,setSession] = useState('');
    const [id, setID] = useState(0);
    const x = StoredSessions;
    const ChangeSession = (event) => {
        setSession(event.target.value)
        setID(x.findIndex(x => x.session === event.target.value));
    };
    const gotoSession = () => {
        if(selectedSession !== '')
        {
        
        let path = '/CreateSession';
        navigate(path,
            {
                state: {ID: id } 
        } );
        };
    };

    return(

        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Select Session</h2>

                    <select value={selectedSession} onChange={ChangeSession}>
                    <option>Select Option</option>
                    {StoredSessions.length > 0 && 
                    StoredSessions.map((StoredSessions) => (
                        <option key={StoredSessions.session} value={StoredSessions.session}>
                            {StoredSessions.session}
                        </option>
                    ))}
                    </select>
                    <div>{/*Session creation comfirmation*/}
                        <button onClick={gotoSession}>Confirm</button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                    
                </div>
            </div>
        )
        
    );
};

export default OpenSession;
