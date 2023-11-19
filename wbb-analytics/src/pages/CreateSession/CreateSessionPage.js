// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import DrillModal from './DrillModal';
import './CreateSessionPage.css';

const CreateSessionsPage = () => {
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState([]);

  const handleAddDrill = (name, type) => {
    setDrills([...drills, { name, type }]);
  };

  const handleDrillClick = (index) => {
    console.log(`Clicked on drill at index ${index}`);
  };

  const [listA, setListA] = useState([]);
  const [listB, setListB] = useState([]);

  const playerArray = useMemo(
    () => [
      'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5',
      'Player A', 'Player B', 'Player C', 'Player D', 'Player E'
    ],
    []
  );

  useEffect(() => {
    // Populate default selections for List A
    const defaultListA = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray[index],
    }));
    setListA(defaultListA);

    // Populate default selections for List B
    const defaultListB = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray[5 + index],
    }));
    setListB(defaultListB);
  }, [playerArray]);

  const handleAddDropdownA = () => {
    setListA([...listA, { playerName: `New Player ${listA.length + 1}` }]);
  };

  const handleAddDropdownB = () => {
    setListB([...listB, { playerName: `New Player ${listB.length + 1}` }]);
  };

  const handleSaveSession = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); // You can customize the format as needed

    const newSession = {
      sessionName: formattedDate,
      drills: [...drills],
      listA: [...listA],
      listB: [...listB],
    };

    setSavedSessions([...savedSessions, newSession]);
    // Optionally, you can clear the current session after saving
    setSessionName('');
    setDrills([]);
    setListA([]);
    setListB([]);
  };

  return (
    <div className="create-sessions-container">
      <div className="drills-column">
        <h2>Drills</h2>
        <ul>
          {drills.map((drill, index) => (
            <li key={index}>
              <button className="drill-button" onClick={() => handleDrillClick(index)}>
                {drill.name}
              </button>
            </li>
          ))}
          <li>
            <button className="add-drill-button" onClick={() => setModalOpen(true)}>
              Add Drill
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        {/* Add your session details form or components here */}
      </div>

      <div className="lists-column">
        <div className="list">
          <h2>Team A</h2>
          <ul>
            {listA.map((item, index) => (
              <li key={index}>
                <select className='dropdown'>
                  {playerArray.map((player, playerIndex) => (
                    <option key={playerIndex} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdownA}>
                Add Dropdown
              </button>
            </li>
          </ul>
        </div>

        <div className="list">
          <h2>Team B</h2>
          <ul>
            {listB.map((item, index) => (
              <li key={index}>
                <select className='dropdown'>
                  {playerArray.map((player, playerIndex) => (
                    <option key={playerIndex} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdownB}>
                Add Dropdown
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button className="create-session-button" onClick={handleSaveSession}>
        Create Session
      </button>

      <DrillModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddDrill={handleAddDrill} />
    </div>
  );
};

export default CreateSessionsPage;
