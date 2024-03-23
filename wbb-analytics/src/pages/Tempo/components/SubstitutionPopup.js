import React from 'react';
import './SubstitutionPopup.css';
import ClickAwayListener from 'react-click-away-listener';
import { IoCloseSharp } from "react-icons/io5";

function SubstitutionPopup({ isOpen, onClose, onSubstitute, playersOnCourt, allPlayers }) {
    const playersNotOnCourt = allPlayers.filter(p =>
        !playersOnCourt.some(onCourt => onCourt.number === p.number)
    );

    return (
        <div>
        <ClickAwayListener onClickAway={onClose}>
        <div className="Popup">
            {playersNotOnCourt.map(player => (
                <div key={player.number} className="PopupPlayerContainer" onClick={() => onSubstitute(player)}>
                    <div className="PopupPlayerCircle">{player.number}</div>
                    <div className="PopupPlayerName">{player.name}</div>
                </div>
            ))}
        </div>
        </ClickAwayListener>
        </div>
    );
}

export default SubstitutionPopup