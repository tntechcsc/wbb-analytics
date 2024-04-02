import React, { useState } from 'react';
import './ShotPopup.css';
import ClickAwayListener from 'react-click-away-listener';

function ShotPopup({ isOpen, onClose, gameOrDrill_id, onModel, player_id, zone }) {
    const [shotOutcome, setShotOutcome] = useState(null); // 'made' or 'missed'
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const submitShot = (isMade, shotClockTime) => {
        const shotData = {
            gameOrDrill_id: gameOrDrill_id,
            onModel: onModel,
            player_id: player_id,
            made: isMade === 'made',
            zone: zone,
            shot_clock_time: shotClockTime,
            timestamp: new Date()
        };
        console.log('Submitting shot:', shotData);

        fetch( serverUrl + '/api/shots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shotData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shot submitted:', data);
            resetAndClose(); // Close the popup after submission
        })
        .catch(error => console.error('Error submitting shot:', error));
    };

    const resetAndClose = () => {
        setShotOutcome(null);
        onClose();
    };

    const handleClockTimeSelection = (timeMapping) => {
        if (shotOutcome) {
            submitShot(shotOutcome === 'made', timeMapping);
            console.log('Shot submitted:', shotOutcome, timeMapping);
        }
    };

    const handleShotOutcome = (outcome) => {
        setShotOutcome(outcome);
    };

    return isOpen ? (
        <ClickAwayListener onClickAway={resetAndClose}>
            <div className="ShotPopup">
                <div className="ShotOutcomeSelection">
                    {!shotOutcome ? (
                        <>
                            <div className="MadeButton" onClick={() => handleShotOutcome('made')}>Made</div>
                            <div className="MissedButton" onClick={() => handleShotOutcome('missed')}>Missed</div>
                        </>
                    ) : (
                        <div className="ClockTimeSelection">
                            <div className="ClockButton1" onClick={() => handleClockTimeSelection('first_third')}>1-10</div>
                            <div className="ClockButton2" onClick={() => handleClockTimeSelection('second_third')}>11-20</div>
                            <div className="ClockButton3" onClick={() => handleClockTimeSelection('final_third')}>21-30</div>
                        </div>
                    )}
                </div>
            </div>
        </ClickAwayListener>
    ) : null;
}

export default ShotPopup;
