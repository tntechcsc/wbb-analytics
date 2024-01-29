import React from 'react';
import './SubstitutionPopup.css';

function SubstitutionPopup({ isOpen, onClose, onSubstitute, playersOnCourt, allPlayers }) {
    const playersNotOnCourt = allPlayers.filter(p =>
        !playersOnCourt.some(onCourt => onCourt.number === p.number)
    );

    return (
        <div className="Popup">
            {playersNotOnCourt.map(player => (
                <div key={player.number} className="PopupPlayerContainer" onClick={() => onSubstitute(player)}>
                    <div className="PopupPlayerCircle">{player.number}</div>
                    <div className="PopupPlayerName">{player.name}</div>
                </div>
            ))}
            <div className="PopupCloseButtonContainer">
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default SubstitutionPopup