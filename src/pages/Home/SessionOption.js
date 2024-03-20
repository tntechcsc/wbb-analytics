import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './HomePage.css';

const SessionOption = ({isOpen,onClose}) => {
    let navigate = useNavigate();
    const [check1, setCheck1] = useState(0);
    const [data, setData] = useState([]);
    
    const gotoSession = (check) => {
        setCheck1(check)
        if(check !== 0)
        {
        let path = '/CreateSession';
        navigate(path,
            {
                state: { ID: check1 }
        });
        }
    };
    const useEffect = () => {
    };
    return(

        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <section>
                    <button className="close-button" onClick={onClose}>X</button>
                        <h2>Select Session type</h2>
                    <section>
                        <div>
                            <button className="Linkish-Button" onClick={() =>gotoSession(1)} >Create Practice</button>
                        </div>
                        <div>
                            <button className="Linkish-Button" onClick={() =>gotoSession(2)}>Create Game</button>
                        </div>
                    </section>
                    </section>
                </div>
            </div>
        )
        
    );
};

export default SessionOption;