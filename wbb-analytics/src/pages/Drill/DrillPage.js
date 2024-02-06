// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import ButtonExplanation from './ButtonExplanation';
import './DrillPage.css';
import TabButton from '../../components/TabButton';
import Stack from '@mui/material/Stack';

const CreateSessionsPage = () => {
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [whichButtonPressed, setButtonPress] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [listA, setListA] = useState([]);
  const [listB, setListB] = useState([]);

  const [currentList, setCurrentList] = useState([]); //Denotes the current team that is having stats taken for it right now.
  const [availablePlayers, setAvailablePlayers] = useState([]); //List of available players that are not currently displayed but are part of the same list as the currentList is drawn from.

  //These are separate Arrays because I was having an aneurysm delimiting them during creation.
  const playerArray = useMemo(
    () => [
      'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6', 'Player 7'
    ],
    []
  );
  const playerArray2 = useMemo(
    () => [
      'Player A', 'Player B', 'Player C', 'Player D', 'Player E'
    ],
    []
  )

  
  useEffect(() => {
    // Populate default selections for List A
    const defaultListA = Array.from({ length: 7 }, (_, index) => ({
      playerName: playerArray[index],
    }));
    setListA(defaultListA);

    // Populate default selections for List B
    const defaultListB = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray2[index],
    }));
    setListB(defaultListB);

    setCurrentList(listA);
    setAvailablePlayers(prevAvailablePlayers => {
      const currentSlice = currentList.slice(5).map(item => item.playerName);
      return [...prevAvailablePlayers, ...currentSlice];
    });
  }, [playerArray]);

  /**
   * Handles switching the displayed player in the buttons by first returning the replaced player to the available set, adding the new player to the currently displayed list, 
   * and removing the selected player from the available list.
   * 
   * @param index         The index from the currently displayed list that the replaced player is being taken out of.
   * @param newPlayer     The player that will be replacing the one currently displayed.
   */
  const handlePlayerChange = (index, newPlayer) => {
    setAvailablePlayers(prevAvailablePlayers => {
      // If the replaced player exists, add it back to available players
      const replacedPlayer = currentList[index]?.playerName;
      if (replacedPlayer) {
        return [...prevAvailablePlayers, replacedPlayer];
      }
      return prevAvailablePlayers;
    });

    setCurrentList(prevCurrentList => {
      const newList = [...prevCurrentList];
      newList[index] = {playerName: newPlayer};
      return newList;
    });
  
    setAvailablePlayers(prevAvailablePlayers => {
      // Exclude the newly selected player from available players
      return prevAvailablePlayers.filter(player => player !== newPlayer);
    });
  };

  /** 
   * Updates the current team that is having their stats recording. Differenciated between Team Purple and Team Gold by default.
   *
   * @param selectedTeam   Determines which team is being displayed, passed by drop-down.
   * @return               No return value.
   */
  const handleTeamSelect = (selectedTeam) => {
    switch(selectedTeam){
      case "teamPurple":
        setCurrentList(listA);
        setAvailablePlayers(prevAvailablePlayers => {
          const currentSlice = listA.slice(5).map(item => item.playerName);
          return [...currentSlice];
        });
        break;
      case "teamGold":
        setCurrentList(listB);
        setAvailablePlayers(prevAvailablePlayers => {
          const currentSlice = listB.slice(5).map(item => item.playerName);
          return [...currentSlice];
        });
        break;
    }
  };

  /**
   * This function returns a bloc of html code that shows buttons for up to five players in a team and drop-down selection menus to replace those members with those that are not currently on the court.
   * It is dependent on the handlePlayerChange() function to work update the list of buttons and the handleTeamSelect() function to know which team to display.
   * 
   * @returns   A bloc of html code that displays a list of buttons and drop-down menus for each button.
   */
  const displayTeam = () => {
    return <ul>
      {currentList.slice(0,5).map((item, index) => (  
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
  }

  return (
    <div>
      <div>
      <Stack spacing={2} direction="row">
      <a href='/createsession'>
        <TabButton text={"Create Session"} />
      </a>
      <a href='/drill'>
        <TabButton text={"Drill"} />
      </a>
      </Stack>
    </div>
    <div className="drills-container">
      
      <div className="teams-court-container">
        <div className="teams-column">
          <h2>Current Players</h2>
          <select className='changeTeam' onChange={(e) => handleTeamSelect(e.target.value)}>
            <option value="" hidden>Select Team</option>
            <option value="teamPurple">Team Purple</option>
            <option value="teamGold">Team Gold</option>
          </select>
          {displayTeam()}
        </div>
        <div className="court-column">
          <img src="../placehold.png"></img>
        </div>
      </div>

      <div className="main-content">
        {/* Add your session details form or components here */}
      </div>

      <div className="buttons-container-top">
        <button className={`button-rebound ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Rebound")}}>Rebound</button> {/*REACT/JS DOES NOT LIKE &&*/}
        <button className={`button-steal ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Steal")}}>Steal</button>
        <button className={`button-turnover ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Turnover")}}>Turnover</button>
        <button className={`button-assist ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Assist")}}>Assist</button>
        <button className={`button-block ${selectedPlayer ? '' : 'greyed-out'}`} onClick={()=>{setModalOpen(true); setButtonPress("Block")}}>Block</button>
      </div>
      <div className="buttons-container-bottom">
        <button className="button-startTempo" onClick={()=>{setModalOpen(true); setButtonPress("Start Tempo")}}>Start Tempo</button>
        <button className="button-stopTempo" onClick={()=>{setModalOpen(true); setButtonPress("Stop Tempo")}}>Stop Tempo</button>
      </div>
      <ButtonExplanation isOpen={isModalOpen} onClose={() => {setModalOpen(false); setSelectedPlayer(null)}} whichButton={whichButtonPressed} whichPlayer={selectedPlayer}/>
    </div>
    </div>
  );
};

export default CreateSessionsPage;
