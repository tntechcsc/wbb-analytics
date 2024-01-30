// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import DrillModal from './DrillModal';
import './CreateSessionPage.css';

const CreateSessionsPage = () => {
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [listA, setListA] = useState(Array(5).fill({ playerName: 'Select Player' }));
  const [listB, setListB] = useState(Array(5).fill({ playerName: 'Select Player' }));
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const [selectedDrillIndex, setSelectedDrillIndex] = useState(null);


 // Function to handle player selection
 const handleSelectPlayer = (team, index, playerName) => {
  const updatedList = team === 'A' ? [...listA] : [...listB];
  updatedList[index] = { playerName };
  if (team === 'A') {
    setListA(updatedList);
  } else {
    setListB(updatedList);
  }
  const newAvailablePlayers = players.filter(p => !listA.concat(listB).find(sp => sp.playerName === p));
  setAvailablePlayers(newAvailablePlayers);
};

  // Filter out selected players from the available list
  const getAvailablePlayersForDropdown = (selectedPlayer) => {
    return ['Select Player', ...availablePlayers].filter(p => p !== selectedPlayer.playerName);
  };
  
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

  useEffect(() => {
    // Fetch players from the database when the component mounts
    fetch('http://localhost:3001/api/players')
      .then(response => response.json())
      .then(data => {
        const playerNames = data.map(player => player.name);
        setPlayers(playerNames);
        setAvailablePlayers(playerNames); // Initialize available players
      })
      .catch(error => {
        console.error('Error fetching players', error);
      });
  }, []);

    // Replace hardcoded player names with fetched player data for List A and List B
    useEffect(() => {
      // Populate default selections for List A
      const defaultListA = players.slice(0, 5).map(playerName => ({
        playerName,
      }));
      setListA(defaultListA);
  
      // Populate default selections for List B
      const defaultListB = players.slice(5, 10).map(playerName => ({
        playerName,
      }));
      setListB(defaultListB);
    }, [players]); // Depend on the fetched players data

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

    // Render function for List A and List B dropdowns
    const renderDropdown = (team, list) => {
      return list.map((item, index) => (
        <li key={index}>
          <select
            className='dropdown'
            value={item.playerName}
            onChange={(e) => handleSelectPlayer(team, index, e.target.value)}
          >
            {getAvailablePlayersForDropdown(item).map((playerName, playerIndex) => (
              <option key={playerIndex} value={playerName}>
                {playerName}
              </option>
            ))}
          </select>
          <button className="remove-player-button" onClick={() => handleRemovePlayer(team, index)}>
            Remove Player
          </button>
        </li>
      ));
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
            <h2>Purple</h2>
            <ul>
            {listA.map((item, index) => (
              <li key={index}>
                <select
                  className='dropdown'
                  value={item.playerName}
                  onChange={(e) => handleSelectPlayer('A', index, e.target.value)}
                >
                  {getAvailablePlayersForDropdown(item).map((playerName, playerIndex) => (
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
          <h2>Gray</h2>
          <ul>
          {listB.map((item, index) => (
            <li key={index}>
              <select
                className='dropdown'
                value={item.playerName}
                onChange={(e) => handleSelectPlayer('B', index, e.target.value)}
              >
                {getAvailablePlayersForDropdown(item).map((playerName, playerIndex) => (
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
  }
export default CreateSessionsPage;
