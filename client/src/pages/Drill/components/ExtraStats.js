import React from 'react';
import './ExtraStats.css';
import './ExtraStatPopup.js';

function ExtraStats({ onClick, className }) {
    const buttonClass = `ExtraStats ${className}`;

    return (
        <button 
            className={buttonClass}
            onClick={onClick}
        >{className}
        </button>
    );
    }

export default ExtraStats;
