import React from 'react';

const UndoButton = ({ onUndo }) => {
    return (
        <button onClick={onUndo} className="undo-button">
            Undo
        </button>
    );
};

export default UndoButton;
