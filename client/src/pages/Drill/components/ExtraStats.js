import React from 'react';
import './ExtraStats.css';

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
