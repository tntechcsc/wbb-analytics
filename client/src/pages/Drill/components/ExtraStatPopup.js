import React, { useState } from 'react';
import './ExtraStatPopup.css';
import ClickAwayListener from 'react-click-away-listener';

function StatPopup({ isOpen, className, onClose}) {

    const resetAndClose = () => {
        onClose();
    };

    return (
        <div>
            <ClickAwayListener onClickAway={resetAndClose}>
            <div className="Popup">
                <div className="PopupStatName">{className}</div>
                <div>Stat Recorded</div>

            </div>
            </ClickAwayListener>
        </div>
    )
}

export default StatPopup;
