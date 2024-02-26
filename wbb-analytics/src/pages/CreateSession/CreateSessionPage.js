// CreateSessionsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StoredSessions from '../../data/sessionData';
import DrillModal from './DrillModal';
import './CreateSessionPage.css';
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import TabButton from '../../components/TabButton';
import Stack from '@mui/material/Stack';
import { avatarClasses } from '@mui/material';

const CreateSessionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [players, setPlayers] = useState([]); // Stores all players
  const [teamPurple, setTeamPurple] = useState([]); // Selected players for Team Purple
  const [teamGray, setTeamGray] = useState([]); // Selected players for Team Gray 
  const [listA, setListA] = useState([{playerName: ''}]);
  const [listB, setListB] = useState([{playerName: ''}]);
  const [drills, setDrills] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // May not need code from here to line 36
  let id1 = -1; //Defualt value so CreateSession can run normally if not directed from OpenSession
  if(location.pathname === '/CreateSession')
  {
  id1 = location.state.ID; // send the session ID to make paramenters for sessionData
  }
  let y= 0;
  let s = 0;

  const [drill_data, setDrillData] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState([]);
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(null);
  // Here

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/players');
        const jsonData = await response.json();
        setPlayers(jsonData);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };
    fetchPlayers();
  }, []); // Empty dependency array to run only once

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

  const getAvailabePlayers = () => {
    const selectedPlayers = [...teamPurple, ...teamGray];
    return players.filter((player) => !selectedPlayers.includes(player._id));
  };

  const handlePlayerChange = (team, index, event) => {
    const newSelection = event.target.value; // Player ID
    if (team === 'A') {
      const updatedTeam = [...teamPurple];
      updatedTeam[index] = newSelection;
      setTeamPurple(updatedTeam);
      const updatedListA = [...listA];
      updatedListA[index].playerName = players.find(player => player._id === newSelection)?.name || '';
      setListA(updatedListA);
    } else if (team === 'B') {
      const updatedTeam = [...teamGray];
      updatedTeam[index] = newSelection;
      setTeamGray(updatedTeam);
      const updatedListB = [...listB];
      updatedListB[index].playerName = players.find(player => player._id === newSelection)?.name || '';
      setListB(updatedListB);
    }
  };

  const handleRemovePlayer = (team, index) => {
    if (team === 'A') {
      const updatedListA = [...listA];
      updatedListA.splice(index, 1);
      setListA(updatedListA);
    } else if (team === 'B') {
      const updatedListB = [...listB];
      updatedListB.splice(index, 1);
      setListB(updatedListB);
    }
  };
  
  useEffect(() => {
    // Populate default selections for List A
    FetchDrillData();
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
    }
    else
    {
    setListA(defaultListA);
    setListB(defaultListB);
    };
    if(id1 !== -1)
    {
      setDrills(StoredSessions[id1].Drills);
    }
  },[playerArray]);

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

  const handleAddDropdown = (team) => {
    if (team === 'A') {
      setListA([...listA, { playerName: '' }]);
    } else if (team === 'B') {
      setListB([...listB, { playerName: '' }]);
    }
  };

  const handleSaveDrill = (customId) => {
    console.log(drills);
    console.log(customId);
    for (let i = 0; i < drills.length; i++) {
      const drillData = {
        SessionID: customId,
        StartTime: "11:00am",
        EndTime: "11:00am",
        DrillName: drills[i].name,
      };
      console.log(drillData);
      fetch('http://localhost:3001/api/drills', {
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
  
  const generateMongoID = () => {
    // Generate a UUID (version 4)
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16); // Timestamp in hexadecimal
    const machineId = generateRandomHexString(6); // 6-character random hexadecimal string
    const processId = generateRandomHexString(4); // 4-character random hexadecimal string
    const counter = generateRandomHexString(6); // 6-character random hexadecimal string

    // Concatenate all parts to form the MongoDB ObjectID
    const mongoId = timestamp + machineId + processId + counter;

    return mongoId;
  }
  const generateRandomHexString = (length) => {
    const characters = 'abcdef0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
  const FetchDrillData = async () => {
    const response = await fetch('/api/drills');
    const jsonData = await response.json();
    setDrillData(jsonData);
  };
  const handleSaveSession = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); // You can customize the format as needed
    const customId = generateMongoID();
  
    FetchDrillData();
    
    const sessionData = {
      //Include all necessary data here
      _id: customId,
      Date: new Date().toLocaleDateString(),
    };
      // Send POST request to save session data
      const respons = fetch('http://localhost:3001/api/sessions', {
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
          <h2>Team Purple</h2>
          <ul>
            {listA.map((player, index) => (
              <li key={index}>
                <select className='dropdown' value={player.playerName} onChange={(e) => handlePlayerChange('A', index, e)}>
                  <option value="">Select Player</option>
                  {getAvailabePlayers().map((availablePlayer) => (
                    <option key={availablePlayer._id} value={availablePlayer._id}>
                      {availablePlayer.name}
                      </option>
                  ))}
                </select>
                <button className="remove-player-button" onClick={() => handleRemovePlayer('A', index)}>
                  Remove Player
                </button>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdown('A')}>
                Add Player  
              </button>
            </li>
          </ul>
        </div>

        <div className="list">
          <h2>Team Gray</h2>
          <ul>
            {listB.map((player, index) => (
              <li key={index}>
               <select className='dropdown' value={player.playerName} onChange={(e) => handlePlayerChange('B', index, e)}>
                  <option value="">Select Player</option>
                  {getAvailabePlayers().map((availablePlayer) => (
                    <option key={availablePlayer._id} value={availablePlayer._id}>
                      {availablePlayer.name}
                      </option>
                  ))}
                </select>
                <button className="remove-player-button" onClick={() => handleRemovePlayer('B', index)}>
                  Remove Player
                </button>
              </li>
            ))}
            <li>
              <button className="add-dropdown-button" onClick={handleAddDropdown('B')}>
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
