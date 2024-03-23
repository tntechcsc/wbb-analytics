import React from 'react';
import './ShotPopup.css';
import ClickAwayListener from 'react-click-away-listener';
import { IoCloseSharp } from "react-icons/io5";

function ShotPopup({ isOpen, onClose, area}) {
    return (
        <div>
        <ClickAwayListener onClickAway={onClose}>
        <div className="Popup">
            <div class="relative h-32 w-32 ...">
                <div class="absolute top-0 right-0 h-16 w-16 ..."><IoCloseSharp onClick={onClose}></IoCloseSharp></div>
            </div>
            <div className="MadeButton"
                onClick={() => {
                    alert('Made'); 
                }}
            >Made</div>
            <div className="Space"></div>
            <div className= "MissedButton"

                onClick={() => {
                    alert('Missed');
                }}
                >Missed</div>
        </div>
        </ClickAwayListener>
        </div>
    );
}

export default SubstitutionPopup



// import React from 'react';
// import './ShotPopup.css';
// import ClickAwayListener from 'react-click-away-listener';
// import { IoCloseSharp } from "react-icons/io5";
// import { useState } from 'react';


// import area from './Court';

// function ShotPopup({ isOpen, onClose}) {

//     const [isMade, setIsMade] = useState(false);

//     const submitShot = (area, isMade) => {
//         const shotData = {
//             area: area,
//             isMade: isMade

//         };

//         fetch('http://localhost:3001/api/shots', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(shotData)
//         })
//             .then(response => response.json())
//             .then(data => console.log('Shot submitted:', data))
//             .catch(error => console.error('Error submitting shot:', error));
//     };

//     const handleMade = () => {
//         setIsMade(true);
//         submitShot(area.name, true);
//         onClose();

//     }

//     const handleMissed = () => {
//         setIsMade(false);
//         submitShot(area.name, false);
//         onClose();
//     }

//     return (
//         <div>
//         <ClickAwayListener onClickAway={onClose}>

//             <div className="CPopup">
//                 {/* two buttons for made and missed shots */}
                   
//                     <div className="MadeButton"
//                         onClick={() => {
//                             handleMade();  
//                         }}
//                     >Made</div>
//                     <div className="Space"></div>
//                     <div className= "MissedButton"
//                         onClick={() => {
//                             handleMissed();
//                         }}
//                         >Missed</div>
//                     </div>
            
            
//         </ClickAwayListener>
//         </div>
//     );
// }

// export default ShotPopup;