// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import StoredSessions from './../../data/sessionData';
import DrillModal from './DrillModal';
import './../Home/OpenSession'
import './CreateSessionPage.css';

const CreateSessionsPage = () => {
  const x=StoredSessions;
  let id1 = -1; //Defualt value so CreateSession can run normally if not directed from OpenSession
  const  location = useLocation();
  if(location.pathname === '/CreateSession')
  {
  id1 = location.state.ID; // send the session ID to make paramenters for sessionData
  
  }
  let y= 0;
  let s = 0;
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState([]);

  const [selectedDrillIndex, setSelectedDrillIndex] = useState(null);

  const handleAddDrill = (name, type) => {
    if (selectedDrillIndex !== null) {
      const updatedDrills = [...drills];
      updatedDrills[selectedDrillIndex] = { name, type };
      setDrills(updatedDrills);
      setSelectedDrillIndex(null);
    } 
    
    else
      setDrills([...drills, { name, type }]);
  };

  const handleDrillClick = (index, isModifyButton) => {
    if (isModifyButton) {
      console.log(`Clicked on modify button for drill at index ${index}`);
      setSelectedDrillIndex(index);
      setModalOpen(true);
    } 

    else
      console.log(`Clicked on drill at index ${index}`);
  };

  const handleDeleteDrill = (index) => {
    const updatedDrills = [...drills];
    updatedDrills.splice(index, 1);
    setDrills(updatedDrills);
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
    // Populate default selections for List B
    const defaultListB = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray[5 + index],   
    }));
    if(id1 !== -1)
    {
      //Add size of list into createSession
      setListA(StoredSessions[id1].Team_A);
      setListB(StoredSessions[id1].Team_B);
    }
    else
    {
    setListA(defaultListA);
    setListB(defaultListB);
    };
    if(id1 !== -1)
    {
      //Add Drills into createSession
      setDrills(StoredSessions[id1].Drills);
    }
  }, [playerArray]);

  const handleRemovePlayer = (team, index) => {
    if (team === 'A') {
      const updatedListA = [...listA];
      updatedListA.splice(index, 1);
      setListA(updatedListA);
      console.log(`Removed player from Team A at index ${index}`);
    }
    
    else if (team === 'B') {
      const updatedListB = [...listB];
      updatedListB.splice(index, 1);
      setListB(updatedListB);
      console.log(`Removed player from Team B at index ${index}`);
    }
  };

  const handlePlayerChange = (team, index, event) => {
    const { value } = event.target;
    if (team === 'A') {
      const updatedListA = [...listA];
      updatedListA[index].playerName = value;
      setListA(updatedListA);
    }
    
    else if (team === 'B') {
      const updatedListB = [...listB];
      updatedListB[index].playerName = value;
      setListB(updatedListB);
    }
  };

  const handleAddDropdownA = () => {
    const newPlayer = { playerName: `New Player ${listA.length + 1}` };
    setListA([...listA, newPlayer]);
  };

  const handleAddDropdownB = () => {
    const newPlayer = { playerName: `New Player ${listB.length + 1}` };
    setListB([...listB, newPlayer]);
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
              <button className="drill-button" onClick={() => handleDrillClick(index, false)}>
                {drill.name}
              </button>
              <button className="delete-drill-button" onClick={() => handleDeleteDrill(index)}>
                Delete
              </button>
              <button className="modify-drill-button" onClick={() => handleDrillClick(index, true)}>
                Modify
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
            {listA.map((player, index) => (
              <li key={index}>
                <select className='dropdown' value={player.playerName} onChange={(e) => handlePlayerChange('A', index, e)}>
                  {(id1 !== -1) && (s < x[id1].Team_A.length) && <option key={s} value={x[id1].Team_A}>{x[id1].Team_A[s++]}</option>} 
                  {playerArray.map((playerName, playerIndex) => (
                    <option key={playerIndex} value={playerName}>
                      {playerName}
                    </option>
                  ))}
                </select>
                <button className="remove-player-button" onClick={() => handleRemovePlayer('A', index)}>
                  Remove Player
                </button>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdownA}>
                Add Player
              </button>
            </li>
          </ul>
        </div>

        <div className="list">
          <h2>Team B</h2>
          <ul>
            {listB.map((player, index) => (
              <li key={index}>
                <select className='dropdown' value={player.playerName} onChange={(e) => handlePlayerChange('B', index, e)}>
                 {(id1 !== -1) && (y < x[id1].Team_B.length) &&  <option key={y} value={x[id1].Team_B}>{x[id1].Team_B[y++]}</option>}
                  {playerArray.map((playerName, playerIndex) => (
                    <option key={playerIndex} value={playerName}>
                      {playerName}
                    </option>
                  ))}
                </select>
                <button className="remove-player-button" onClick={() => handleRemovePlayer('B', index)}>
                  Remove Player
                </button>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdownB}>
                Add Player
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
