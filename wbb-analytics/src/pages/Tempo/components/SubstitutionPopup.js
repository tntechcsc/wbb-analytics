import React from 'react';
import './SubstitutionPopup.css';
import { IoCloseSharp } from "react-icons/io5";

function SubstitutionPopup({ isOpen, onClose, onSubstitute, playersOnCourt, allPlayers }) {
    const playersNotOnCourt = allPlayers.filter(p =>
        !playersOnCourt.some(onCourt => onCourt.number === p.number)
    );

    return (
        <div className="Popup">
            <div class="relative h-32 w-32 ...">
                <div class="absolute top-0 right-0 h-16 w-16 ..."><IoCloseSharp onClick={onClose}></IoCloseSharp></div>
            </div>
            {playersNotOnCourt.map(player => (
                <div key={player.number} className="PopupPlayerContainer" onClick={() => onSubstitute(player)}>
                    <div className="PopupPlayerCircle">{player.number}</div>
                    <div className="PopupPlayerName">{player.name}</div>
                </div>
            ))}
        </div>
    );
}

export default SubstitutionPopup