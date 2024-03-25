import React, { useState, useEffect } from 'react';
import Selector from '../TeamStats/components/Selector';
import Heatmap from '../TeamStats/components/Heatmap';
import TempoCard from '../TeamStats/components/TempoCard';
import StatCard from '../TeamStats/components/StatsDisplay';
import StatsTable from '../TeamStats/components/StatsTable';
import NavagationHeader from '../TeamStats/components/NavigationHeader'

import ShotsByClock from './components/ShotsByClock';
import './PlayerStats.css';
import { set } from 'mongoose';

function PlayerStats() {
  /* 
    
  */
  const urlParams = new URLSearchParams(window.location.search);


  const [sessions, setSessions] = useState([]);
  const [allDrills, setAllDrills] = useState([]);
  const [filteredDrills, setFilteredDrills] = useState([]);
  const [allTempos, setAllTempos] = useState([]);
  const [filteredTempos, setFilteredTempos] = useState([]);
  const [allShots, setAllShots] = useState([]);
  const [filteredShots, setFilteredShots] = useState([]);
  const [avgOffensiveTempo, setAvgOffensiveTempo] = useState(0);
  const [avgDefensiveTempo, setAvgDefensiveTempo] = useState(0);
  const [shotClockData, setShotClockData] = useState([]); //
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedDrill, setSelectedDrill] = useState(''); //This is a numerical ID, not an object

  const sessionIdParam  = urlParams.get('seasonId');
  const session = urlParams.get('session');
  const drillIdParam = urlParams.get('drillId');
  const playerID  = urlParams.get('playerID');
  const [selectedPlayer, setSelectedPlayer] = useState(''); //

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const playerResponse = await fetch('http://localhost:3001/api/players/jersey/' + playerID); //Note to self: feetches as an ARRAY // Also should switch this to player ID at some point
      const playerData = await playerResponse.json();
      //console.log(playerData[0]); //Array
      setSelectedPlayer(playerData[0]._id); //What about jersey number that no exis?
      try {
        const drillResponse = await fetch('http://localhost:3001/api/drills/players/'+ playerData[0]._id);
        const drillData = await drillResponse.json();
        //console.log("These are the drills Maddie is in: ")
        //console.log(drillData);
        setAllDrills(drillData);
        if (drillIdParam) {
          setSelectedDrill(drillIdParam);
        } else if (drillData.length > 0) {
          setSelectedDrill(drillData[0]._id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch drill data:", error);
      }
      try {
        const tempoResponse = await fetch('http://localhost:3001/api/tempos/byPlayer/' + playerData[0]._id);
        const tempoData = await tempoResponse.json();
        //console.log("These are tempos:")
        //console.log(tempoData);
        setAllTempos(tempoData);
      } catch (error){
        console.error("Failed to fetch tempos from drill data:", error);
      }
      try {
        const shotsResponse = await fetch('http://localhost:3001/api/shots/');//byPlayer/' + playerData[0]._id);
        const shotsData = await shotsResponse.json(); //This is not programmed to get shots by player yet; the route does not cooperate
        //console.log("These are shots:")
        //console.log(shotsData);
        setAllShots(shotsData);
      } catch (error) {
        console.error("Failed to fetch shot data:", error);
      }
    } catch (error){
      console.error("Failed to player data: ", error);
    }
    try{
      const sessionResponse = await fetch('http://localhost:3001/api/practices');
      const sessionData = await sessionResponse.json();
      //console.log(sessionData)
      const formattedSessions = sessionData.map(session => {
        const date = new Date(session.date); // Create a date object
        // Format the date as MM/dd/yyyy
        const formattedDate = ((date.getMonth() + 1) + '').padStart(2, '0') + '/' + 
                              (date.getDate() + '').padStart(2, '0') + '/' + 
                              date.getFullYear();
        return {
          label: `Session: ${formattedDate}`,
          value: session._id.toString(),
        };
      });
      //console.log("These are sessions: ")
      //console.log(sessionData);
      setSessions(formattedSessions);
      if (sessionIdParam) {
        setSelectedSession(sessionIdParam);
      } else if (formattedSessions.length > 0) {
        setSelectedSession(formattedSessions[0].value);
      }
    } catch (error){
      console.error("Failed to fetch session data: ", error);
    }
  };
  fetchInitialData();
  //submitTempo();
}, []);


useEffect(() => {
  setFilteredDrills(allDrills.filter(drill => drill.practice_id === selectedSession)
    .map(drill => ({
      label: `${drill.name}`,
      value: drill._id.toString(),
    })));

  if (selectedDrill) {
    // Filter tempos for the selected drill
    updateTempoData();
    //Filter shots for the selected drill
    updateShotData();
  }
  //submitTempo();
}, [selectedSession, selectedDrill, allDrills, allTempos, allShots]);

  const statCardsData = [
    { title: "3 Pt FG %", value: "22.2" }, // Points per game
    { title: "2 Pt FG %", value: "77.5" },  // Assists per game
    { title: "Rebounds", value: "50.1" },  // Rebounds per game
    { title: "Steals", value: "8.2" },   // Steals per game
  ];

  const teamStatsData = {
    headers: ["GP", "MPG", "PPG", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%", "ORB", "DRB", "RPG", "APG", "SPG", "BPG", "TOV", "PF"],
    rows: [
      ["56", "48.0", "123.7", "46.8", "92.2", ".508", "13.6", "35.8", ".381", "10.0", "30.6", "40.6", "30.9", "7.8", "5.8", "13.4", "21.9"],
      // ... Add as many rows as needed
    ]
  };

  const sectionLabels = ["30-20", "20-10", "10-0"]; //This is for the shot clock data

  const handleSessionChange = (event) => {
    const newSessionId = event.target.value;
    setSelectedSession(newSessionId);

    // Update the URL with the new session ID
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sessionId', newSessionId);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);

    // Immediately filter drills for the newly selected session and set the first drill as selected
    // This assumes allDrills has been previously populated with all available drills
    const sessionDrills = allDrills.filter(drill => drill.practice_id === newSessionId);
    if (sessionDrills.length > 0) {
      const firstDrillId = sessionDrills[0]._id.toString();
      setSelectedDrill(firstDrillId);
      handleDrillChange({ target: { value: firstDrillId } }); //An attempt?

      // Optionally, update the URL with the new drill ID as well
      urlParams.set('drillId', firstDrillId);
      window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
    } else {
      // If no drills are found for the selected session, clear the selected drill
      setSelectedDrill('');
      console.log("This is where the code went")
    }
  };

  const handleDrillChange = (event) => {
    const newDrillId = event.target.value;
    setSelectedDrill(newDrillId);

    // Update the URL with the new drill ID
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('drillId', newDrillId);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);

    //Immediately filter tempos for the newly selected drill
    updateTempoData();
    updateShotData();
  };

  /*
    This function updates the average offensive and defensive tempos for the selected drill

    It filters the tempos for the selected drill (taken from above) and sets the average offensive and defensive tempos to 0 before doing its calculations so that no data is contaminated (hopefully)
  */
  const updateTempoData = () => {
    // Filter tempos for the selected drill
    const temposForDrill = allTempos.filter(tempo => tempo.gameOrDrill_id === selectedDrill);
    setAvgOffensiveTempo(0);
    setAvgDefensiveTempo(0);
    setFilteredTempos(temposForDrill);
    var numOffensive = 0;
    var numDefensive = 0;
    var sumOffensiveTempo = 0;
    var sumDefensiveTempo = 0;
    for (var i = 0; i < temposForDrill.length; i++){
        if(temposForDrill[i].tempo_type === "offensive" && !isNaN(temposForDrill[i].transition_time)){
            sumOffensiveTempo += temposForDrill[i].transition_time;
            numOffensive++;
        }
        else if(temposForDrill[i].tempo_type === "defensive" && !isNaN(temposForDrill[i].transition_time)){
            sumDefensiveTempo += temposForDrill[i].transition_time;
            numDefensive++;
        }
        else{
            console.log("Error: Tempo type not recognized or transition time is not a number " + temposForDrill[i].tempo_type)
        }
    }
    setAvgOffensiveTempo(numOffensive > 0 ? (sumOffensiveTempo / numOffensive).toFixed(2) : 0); //Checks if there are any tempos to average
    setAvgDefensiveTempo(numDefensive > 0 ? (sumDefensiveTempo / numDefensive).toFixed(2) : 0);
  }

  /*
    This function updates the shot data for the selected drill.

    It filters the shot data for a given player by the selected drill and then updates the shot clock data for the player.
  */
  const updateShotData = () => {
    const shotsForDrill = allShots.filter(shot => shot.gameOrDrill_id === selectedDrill);
    setFilteredShots(shotsForDrill);
    //console.log(selectedDrill)
    //console.log(shotsForDrill)
    var shotDat = [[0, 0], [0, 0], [0, 0]]; //This is a two-dimensional array that has the third in the first index, and the number of made shots and number of total shots in the second index. So, shotDat[0][0] is the shots *made* in the first third, and shotDat[0][1] is the shots attempted.
    for(var i = 0; i < shotsForDrill.length; i++){
      switch(shotsForDrill[i].shot_clock_time){ //The options are "first_third", "second_third", and "final_third" for some reason
        case "first_third":
          shotDat[0][1]++;
          if(shotsForDrill[i].made)
            shotDat[0][0]++;
          break;
        case "second_third":
          shotDat[1][1]++;
          if(shotsForDrill[i].made)
            shotDat[1][0]++;
          break;
        case "final_third":
          shotDat[2][1]++;
          if(shotsForDrill[i].made)
            shotDat[2][0]++;
          break;
        default:
          console.log("Error: Shot clock time not recognized " + shotsForDrill[i].shot_clock_time);
      }
    }
    setShotClockData(shotDat);
  }

  const submitTempo = () => {
    const tempDat = {
      gameOrPractice_id: "65f8fea3cd927f35da90a9b0", //Same as below hard code
      onModel: "Practice",
      player_ids: ["654af8a01963d3698be22110"],
      tempo_type: "offensive",
      transition_time: 3.2
    };
    fetch('http://localhost:3001/api/tempos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempDat)
    })
        .then(response => response.json())
        .then(data => console.log('Tempo submitted:', data))
        .catch(error => console.error('Error submitting tempo:', error));
  }

  const submitDrill = () => {
    const drillDat = {
        name: "This is a test instance for the route", // Since DrillID is not used yet
        practice_id: "65f8fea3cd927f35da90a9b0", //Hard coded lol (this exists I checked(?))
        tempo_events: [],
        players_involved: ["654af8a01963d3698be22110"]
    };

    fetch('http://localhost:3001/api/drills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(drillDat)
    })
        .then(response => response.json())
        .then(data => console.log('Tempo submitted:', data))
        .catch(error => console.error('Error submitting tempo:', error));
};
  
  return (
    <div className="team-stats-container">
      <header className="team-header">
        <NavagationHeader />
      </header>

      <div className="selectors">
      <Selector
          options={sessions}
          onChange={handleSessionChange}
          label="Session"
          value={selectedSession}
        />
        <Selector
          options={filteredDrills}
          onChange={handleDrillChange}
          label="Drill"
          value={selectedDrill}
          disabled={!selectedSession}
        />
      </div>

      <div className="detailed-stats">
        <div className="tempo-cards">
          <h3 classname = "player-information">Player ID: {selectedPlayer.jersey_number}, Player Name: {selectedPlayer.name}</h3>
          <TempoCard title="Avg Offensive Tempo" tempo={avgOffensiveTempo} />
          <TempoCard title="Avg Defensive Tempo" tempo={avgDefensiveTempo} />
        </div>
        <div className="heatmap">
          <Heatmap />
          <div className="shots-table-container">
            {shotClockData.map((section, index) => (
              <ShotsByClock key={index} section={sectionLabels[index]} made={section[0]} total={section[1]} />
            ))}
          </div>
        </div>
      </div>

      <div className="stats-overview">
        {statCardsData.map((card, index) => (
          <StatCard key={index} title={card.title} value={card.value} />
        ))}
      </div>

      <div className='stats-table-container'>
      <h2>Player Stats</h2>
        <div className="stats-table">
        <StatsTable stats={teamStatsData} />
        </div>
      </div>
        
    </div>
  );
}

export default PlayerStats;