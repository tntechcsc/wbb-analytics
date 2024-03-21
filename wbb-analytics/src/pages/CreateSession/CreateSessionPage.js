// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import StoredSessions from '../../data/sessionData';
import DrillModal from './DrillModal';
import SessionInfoModal from './SessionInfoModal';
import './CreateSessionPage.css';
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import TabButton from '../../components/TabButton';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


const CreateSessionsPage = () => {

  const navigate = useNavigate();
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
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [seasID, setSeasID] = useState('');
  const [SeasonData, setSeasonData] = useState([]);
  const [activeTab, setActiveTab] = useState('Drills');
  const [team, setOpponentTeam] = useState('');
  const [time, setTime] = useState('');
  const [isSessionInfoModalOpen, setSessionInfoModalOpen] = useState(false); // State for SessionInfoModal
  const serverUrl = process.env.REACT_APP_SERVER_URL;
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
    console.log(`Deleted drill at index ${index}`);
  };

  const [listA, setListA] = useState([]);
  const [listB, setListB] = useState([]);
  const x=StoredSessions;
  const playerArray = useMemo(
    () => [
      'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5',
      'Player B', 'Player A', 'Player C', 'Player D', 'Player E'
    ],
    []
  );
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    parent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });
  
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
    setListA([...listA, { playerName: `New Player ${listA.length + 1}` }]);
  };

  const handleAddDropdownB = () => {
    setListB([...listB, { playerName: `New Player ${listB.length + 1}` }]);
  };
  const handleSaveDrill = (customId) => {
    console.log(drills);
    console.log(customId);
    for (let i = 0; i < drills.length; i++) {
      const drillData = {
        practice_id: customId,
        name: drills[i].name,
        tempo_events: [],
        shot_events: [],
      };
      console.log(drillData);
      fetch(serverUrl + '/api/drills', {
        method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
        body: JSON.stringify(drillData),
      })
      .then(response => response.json())
      .then(data => console.log('Drill submitted:', data))
      .catch(error => console.error('Error submitting drill:', error));
    }
  };
  const handleSaveSession = async () => {
    const currentDate = new Date();

    FindSeason(seasID);
    console.log(seasID);

    // Handle successful response
    navigate('/tempo');
  };
  const FindSeason = () => {
    
    const date = new Date().toLocaleDateString();
    const splitDate = date.split("/");
    const year = splitDate[2];
      const x = SeasonData.find(season => season.year === year)
      if(!x)
      {
      const seasonData = {
        year: year,
        players: [],

      };
      const respons = fetch(serverUrl + '/api/seasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(seasonData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('submitting Season',data);
        postSession(data._id);
      })
      .catch(error => console.error('Error submitting Seasion:', error));
      }
      else
      {
      const season = SeasonData.find(season => season.year === year);
      console.log(season);
      postSession(season.ID);
      }
  }
  const postSession = (sesData) => {
    const sessionData = {
      //Include all necessary data here
      season_id: sesData,
      date: new Date(),

    };
      // Send POST request to save session data
      const respons = fetch(serverUrl + '/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(sessionData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Session submitted:', data);
        handleSaveDrill(data._id);
      })
      .catch(error => console.error('Error submitting Session:', error));

    // Handle successful response
    navigate('/tempo');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log(`Switched to ${tab} tab`);
  };
  
  const handleAddSessionInfo = (opponentTeam, startTime, endTime) => {
    if (opponentTeam.trim() !== '' && startTime.trim() !== '' && endTime.trim() !== '') {
      let sessionInfoData = [];
      sessionInfoData.push({ opponentTeam, startTime, endTime });
      console.log('Adding Session Information: ', '\nOpponent Team: ', sessionInfoData[0].opponentTeam,
                  '\nStart Time: ',sessionInfoData[0].startTime, '\nEnd Time: ', sessionInfoData[0].endTime); // can be used to grab individual elements
    }
  };
  
  const handleAddOpponentTeam = (team) => {
    setOpponentTeam(team);
    setSessionInfoModalOpen(true);
    console.log(`Clicked on Add Opponent Team`);
  };
  
  const handleAddTime = (startTime, endTime) => {
    setTime({ startTime, endTime });
    setSessionInfoModalOpen(true);
    console.log(`Clicked on Add Time`);
  };
  //Use Effect at the end
  useEffect(() => {
    // Populate default selections for List A
    
    const FetchData = async () => {
      try {
        const playerResponse = await fetch(serverUrl + '/api/players');
        const playerData = await playerResponse.json();
        const formattedPlayer = playerData.map(player => {
          const Pname = player.name;
          return {
            name: Pname,
          }
        });
        setPlayerData(formattedPlayer);
      }
      catch (error) {
        console.error('Failed to fetch players:', error);
      }
      try {
        const seasonResponse = await fetch(serverUrl + '/api/seasons');
        const seasonData = await seasonResponse.json();
        const formattedSeasons = seasonData.map(season => {
          const seasonID = season._id.toString();
          const year = season.year;
          return {
            year: year,
            ID: season._id.toString(),
          }
        });
        setSeasonData(formattedSeasons);
      }
      catch (error) {
        console.error('Failed to fetch seasons:', error);
      }
    };
    FetchData();
    const defaultListA = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray[index],
    }));
    // Populate default selections for List B
    const defaultListB = Array.from({ length: 5 }, (_, index) => ({
      playerName: playerArray[5 + index],   
    }));
    if(id1 !== -1)
    {
      setListA(StoredSessions[id1].Team_A);
      setListB(StoredSessions[id1].Team_B);
      setDrills(StoredSessions[id1].Drills);
    }
    else
    {
    setListA(defaultListA);
    setListB(defaultListB);
    };
  },[playerArray]);
  return (
    <div> 
    <div className="create-sessions-container">
      <div className="drills-column">
        <div>
          <View style={{ flexDirection: 'row' }}>
            <TabButton text={"Drills"} onPress={() => handleTabClick('Drills')} active={activeTab === 'Drills'} />
            <TabButton text={"Session Information"} onPress={() => handleTabClick('Session Information')} active={activeTab === "Session Information"} />
          </View>
        </div>
        {activeTab === 'Drills' && (
          <>
          <h2>{activeTab === 'Drills' ? 'Drills' : 'Session Information'}</h2>
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
        </>
        )}
        <div className="session-information">
          {activeTab === 'Session Information' && (
            <>
              <h2>Session Information</h2>
              <button className="add-opponent-team" onClick={() => handleAddOpponentTeam(team)}> Add Session Information </button>
              {/* <button className="add-time" onClick={() => handleAddTime(time)}> Add Time </button> */}
              <SessionInfoModal isOpen={isSessionInfoModalOpen}
               onClose={() => setSessionInfoModalOpen(false)}
               onAddSessionInfo={handleAddSessionInfo}
               startTime={time.startTime}
               endTime={time.endTime} />
            </>
          )}
        </div>
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
    </div>
  );
};

export default CreateSessionsPage;
