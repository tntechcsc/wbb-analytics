// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import ButtonExplanation from './ButtonExplanation';
import './DrillPage.css';

const CreateSessionsPage = () => {
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [whichButtonPressed, setButtonPress] = useState("");
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
      'Player B', 'Player A', 'Player C', 'Player D', 'Player E'
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
    <div className="drills-container">
      <div className="teams-court-container">
        <div className="teams-column">
          <h2>Team Roster</h2>
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
          </ul>
        </div>
        <div className="court-column">
          <img src="../placehold.png"></img>
        </div>
      </div>

      <div className="main-content">
        {/* Add your session details form or components here */}
      </div>

      <div className="buttons-container">
        <button className="button-rebound" onClick={()=>{setModalOpen(true); setButtonPress("Rebound")}}>Rebound</button> {/*REACT/JS DOES NOT LIKE &&*/}
        <button className="button-steal">Steal</button>
        <button className="button-turnover">Turnover</button>
        <button className="button-assist">Assist</button>
        <button className="button-block">Block</button>
        <ButtonExplanation isOpen={isModalOpen} onClose={() => setModalOpen(false)} whichButton={whichButtonPressed} />
      </div>

    </div>
  );
};

export default CreateSessionsPage;
