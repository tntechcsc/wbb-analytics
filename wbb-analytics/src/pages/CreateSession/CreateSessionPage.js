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
        setPlayers(jsonData.map(player => ({ ...player, selected: false })));
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };
    fetchPlayers();
  }, []);

  // Handle player selection change
  const handlePlayerChange = (team, index, event) => {
    const selectedPlayerId = event.target.value;
    let updateFunc = team === 'A' ? setTeamPurple : setTeamGray;

    // Update team state with selected player
    updateFunc(prevTeam => {
      const updatedTeam = [...prevTeam];
      if(selectedPlayerId) {
        const playerToAdd = players.find(player => player._id === selectedPlayerId);
        updatedTeam[index] = playerToAdd;
      } else {
        updatedTeam.splice(index, 1);
      }
      return updatedTeam;
    });

    // Update players' selected status
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player._id === selectedPlayerId
          ? { ...player, selected: true }
          : player._id === (team === 'A' ? teamPurple[index]?._id : teamGray[index]?._id)
          ? { ...player, selected: false }
          : player
      )
    );
  };
  
  // Handle adding a new player dropdown
  const handleAddDropdown = team => { 
    let updateFunc = team === 'A' ? setTeamPurple : setTeamGray;
    updateFunc(prevTeam => [...prevTeam, {}]);
  };

  // Handle removing a player from the team
  const handleRemovePlayer = (team, index) => {
    let updateFunc = team === 'A' ? setTeamPurple : setTeamGray;
    updateFunc(prevTeam => {
      const updatedTeam = [...prevTeam];
      const playerToRemove = updatedTeam.splice(index, 1)[0];
      if(playerToRemove && playerToRemove._id) {
        // Mark the player as not selected
        setPlayers(prevPlayers =>
          prevPlayers.map(player =>
            player._id === playerToRemove._id ? { ...player, selected: false } : player
          )
        );
      }
      return updatedTeam;
    });
  };

  // Get available players for the dropdown
  const getAvailablePlayers = team => { 
    return players.filter(player => !player.selected);
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
  
  useEffect(() => {
    const FetchDrillData = async () => {
      const response = await fetch('/api/drills');
      const jsonData = await response.json();
      setDrillData(jsonData);
    };
    FetchDrillData();
  }, []);

  const handleSaveSession = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); // You can customize the format as needed

    const sessionData = {
      //Include all necessary data here
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
        {/* Team Purple List */}
        <div className="list">
          <h2>Team Purple</h2>
          <ul>
            {teamPurple.map((player, index) => (
              <li key={index}>
                <select className='dropdown' value={player._id} onChange={(e) => handlePlayerChange('A', index, e)}>
                  <option value="">Select Player</option>
                  {getAvailablePlayers().map((availablePlayer) => (
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
            {getAvailablePlayers().length > 0 && (
              <li>
                <button className="add-dropdown-button" onClick={handleAddDropdown('A')}>
                  Add Player
                </button>
              </li>
            )}
          </ul>
        </div>
            
        {/* Team Gray List */}
        <div className="list">
          <h2>Team Gray</h2>
          <ul>
            {teamGray.map((player, index) => (
              <li key={index}>
                <select className='dropdown' value={player._id} onChange={(e) => handlePlayerChange('B', index, e)}>
                  <option value="">Select Player</option>
                  {getAvailablePlayers().map((availablePlayer) => (
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
            {getAvailablePlayers().length > 0 && (
              <li>
                <button className="add-dropdown-button" onClick={handleAddDropdown('B')}>
                  Add Player
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <button className="create-session-button" onClick={handleSaveSession}>
        Create Session
      </button>
    </div>
      <DrillModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddDrill={handleAddDrill} />
    </div>
  );
};
export default CreateSessionsPage;
