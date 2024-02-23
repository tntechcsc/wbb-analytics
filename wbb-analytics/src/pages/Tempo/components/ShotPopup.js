import React from 'react';
import './ShotPopup.css';
import ClickAwayListener from 'react-click-away-listener';
import { IoCloseSharp } from "react-icons/io5";


function ShotPopup({ isOpen, onClose}) {

    return (
        <div>
        <ClickAwayListener onClickAway={onClose}>

            <div className="CPopup">
                {/* two buttons for made and missed shots */}
                   
                    <div className="MadeButton"
                        onClick={() => {
                            console.log('made');
                            alert('made');                     
                            onClose();
                            
                        }}
                    >Made</div>
                    <div className="Space"></div>
                    <div className= "MissedButton"
                        onClick={() => {
                            console.log('missed');
                            alert('missed');
                            onClose();
                        }}
                        >Missed</div>
                    </div>
            
            
        </ClickAwayListener>
        </div>
    );
}

export default ShotPopup;