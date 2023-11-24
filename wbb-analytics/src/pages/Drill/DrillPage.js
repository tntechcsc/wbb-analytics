// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import ButtonExplanation from './ButtonExplanation';
import './DrillPage.css';

const CreateSessionsPage = () => {
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [whichButtonPressed, setButtonPress] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);

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
    const defaultListA = Array.from({ length: 7 }, (_, index) => ({
      playerName: playerArray[index],
    }));
    setListA(defaultListA);
    setAvailablePlayers(prevAvailablePlayers => {
      const listASlice = listA.slice(5).map(item => item.playerName);
      return [...prevAvailablePlayers, ...listASlice];
    });

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

  const handlePlayerChange = (index, newPlayer) => {
    setAvailablePlayers(prevAvailablePlayers => {
      // If the replaced player exists, add it back to available players
      const replacedPlayer = listA[index]?.playerName;
      if (replacedPlayer) {
        return [...prevAvailablePlayers, replacedPlayer];
      }
      return prevAvailablePlayers;
    });
  
    setListA(prevListA => {
      const newList = [...prevListA];
      newList[index] = { playerName: newPlayer };
      return newList;
    });

    setListA(prevListB => {
      const newList = [...prevListB];
      newList[index] = { playerName: newPlayer };
      return newList;
    });
  
    setAvailablePlayers(prevAvailablePlayers => {
      // Exclude the newly selected player from available players
      return prevAvailablePlayers.filter(player => player !== newPlayer);
    });
  };

  return (
    <div className="drills-container">
      <div className="teams-court-container">
        <div className="teams-column">
          <h2>Team Roster</h2>
          <ul>
            {listA.slice(0,5).map((item, index) => (  
              <li key={index}> {/* The array in the line above is sliced such that if a team has more than five players assigned, the drill will automatically only show the first five. */}
                <button key={index} className={selectedPlayer === item ? 'selectPlayer' : 'selectPlayer'} onClick={() => setSelectedPlayer(item.playerName)}>
                  {item.playerName}
                </button>
                <select className='changePlayer'
                value={item.playerName || ''}
                onChange={(e) => handlePlayerChange(index, e.target.value)}>
                <option value="" hidden>Select Player</option>
                {availablePlayers.map((player, idx) => (
                  <option key={idx} value={player}>{player}</option>
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
        <button className={`button-rebound ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Rebound")}}>Rebound</button> {/*REACT/JS DOES NOT LIKE &&*/}
        <button className={`button-steal ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Steal")}}>Steal</button>
        <button className={`button-turnover ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Turnover")}}>Turnover</button>
        <button className={`button-assist ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Assist")}}>Assist</button>
        <button className={`button-block ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Block")}}>Block</button>
        <ButtonExplanation isOpen={isModalOpen} onClose={() => {setModalOpen(false); setSelectedPlayer(null)}} whichButton={whichButtonPressed} whichPlayer={selectedPlayer}/>
      </div>

    </div>
  );
};

export default CreateSessionsPage;
