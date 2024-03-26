import React from 'react';
import './ShotPopup.css';
import ClickAwayListener from 'react-click-away-listener';
import { IoCloseSharp } from "react-icons/io5";
import { useState } from 'react';


import area from './Court';
import { set } from 'mongoose';

function ShotPopup({ isOpen, onClose}) {
    
    const [isMade, setIsMade] = useState(false);
    const [setShot, setSetShot] = useState(false);
    const [isZoneSelected, setIsZoneSelected] = useState(false);
    const [setClock, setSetClock] = useState(0);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const submitShot = (area, isMade) => {
        const shotData = {
            area: area,
            isMade: isMade

        };

        fetch( serverUrl + '/api/shots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shotData)
        })
            .then(response => response.json())
            .then(data => console.log('Shot submitted:', data))
            .catch(error => console.error('Error submitting shot:', error));
    };

    const handleMade = () => {
        setIsMade(true);
        setSetShot(true);
        // submitShot(area.name, true);
    }

    const handleMissed = () => {
        setIsMade(false);
        setSetShot(true);
        handleReady();
        // submitShot(area.name, false);
    }

    const handleClockClick = (clock) => {
        setIsZoneSelected(true);
        setSetClock(clock);
        handleReady();
        
    };

    const handleReady = () => {
        if (isZoneSelected && setShot) {
            submitShot(area.name, isMade, setClock);
            onClose();
        }
    };

    return (
        <div>
        <ClickAwayListener onClickAway={onClose}>

            <div className="CPopup">
                {/* two buttons for made and missed shots */}
                <div className = "Title">{isMade}</div>
                   
                    <div className="MadeButton"
                        onClick={() => {
                            handleMade();  
                        }}
                    >Made</div>
                    <div className="Space"></div>
                    <div className= "MissedButton"
                        onClick={() => {
                            handleMissed();
                        }}
                    >Missed</div>
                    
                    <div className="ClockButton1" onClick={() => {handleClockClick(1);}}>1-10</div>
                    <div className="ClockButton2" onClick={() => {handleClockClick(2);}}>11-20</div>
                    <div className="ClockButton3" onClick={() => {handleClockClick(3);}}>21-30</div>
            
            </div>
        </ClickAwayListener>
        </div>
    );
}

export default ShotPopup;