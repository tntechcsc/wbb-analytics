import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import random from 'lodash/random';
import Chart from 'chart.js/auto';
import Heatmap from './components/Heatmap';
import NavagationHeader from './components/NavagationHeader';
import Selector from './components/Selector';
import StatCard from './components/StatsDisplay';
import StatsTable from './components/StatsTable';
import TempoCard from './components/TempoCard';
import './TeamStats.css';

const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ffffff', // Making Y-axis labels white
      }
    },
    x: {
      ticks: {
        color: '#ffffff', // Making X-axis labels white
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#ffffff', // Making legend text white
      }
    },
    tooltip: {
      enabled: false, // Optionally disable tooltips
    }
  },
  // Optionally remove hover effects
  hover: {
    mode: null
  },
};

function TeamStats() {
  // Define the base URL for your API
  const BASE_URL = 'http://10.105.194.195:3001';
  // const BASE_URL = 'http://localhost:3001';

  const [sessions, setSessions] = useState([]);
  const [allDrills, setAllDrills] = useState([]);
  const [filteredDrills, setFilteredDrills] = useState([]);
  const [allTempos, setAllTempos] = useState([]);
  const [filteredTempos, setFilteredTempos] = useState([]);
  const [avgOffensiveTempo, setAvgOffensiveTempo] = useState(0);
  const [avgDefensiveTempo, setAvgDefensiveTempo] = useState(0);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedDrill, setSelectedDrill] = useState('');
  const [barChartData, setBarChartData] = useState({
    labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8'],
    datasets: [
      {
        label: '% of Shots Made',
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: Array(8).fill().map(() => Math.round(Math.random() * 100)), // Initialize with random data
      }
    ]
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdParam = urlParams.get('sessionId');
      const drillIdParam = urlParams.get('drillId');

      try {
        const sessionResponse = await fetch('http://localhost:3001/api/sessions');
        const sessionData = await sessionResponse.json();
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
        setSessions(formattedSessions);
        if (sessionIdParam) {
          setSelectedSession(sessionIdParam);
        } else if (formattedSessions.length > 0) {
          setSelectedSession(formattedSessions[0].value);
        }

        const drillResponse = await fetch('http://localhost:3001/api/drills');
        const drillData = await drillResponse.json();
        setAllDrills(drillData);
        if (drillIdParam) {
          setSelectedDrill(drillIdParam);
        } else if (drillData.length > 0) {
          setSelectedDrill(drillData[0]._id.toString());
        }

        const tempoResponse = await fetch('http://localhost:3001/api/tempos');
        const tempoData = await tempoResponse.json();
        setAllTempos(tempoData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    setFilteredDrills(allDrills.filter(drill => drill.practice_id === selectedSession)
      .map(drill => ({
        label: `${drill.name}`,
        value: drill._id.toString(),
      })));

    if (selectedDrill) {
      const temposForDrill = allTempos.filter(tempo => tempo.DrillID === selectedDrill);
      setFilteredTempos(temposForDrill);

      const offensiveTempoTimes = temposForDrill
        .filter(tempo => tempo.TimeToHalfCourt !== undefined)
        .map(tempo => tempo.TimeToHalfCourt);
      setAvgOffensiveTempo(offensiveTempoTimes.length
        ? (offensiveTempoTimes.reduce((acc, cur) => acc + cur, 0) / offensiveTempoTimes.length).toFixed(2)
        : 'N/A');

      const defensiveTempoTimes = temposForDrill
        .filter(tempo => tempo.PressDefenseTime !== undefined)
        .map(tempo => tempo.PressDefenseTime);
      setAvgDefensiveTempo(defensiveTempoTimes.length
        ? (defensiveTempoTimes.reduce((acc, cur) => acc + cur, 0) / defensiveTempoTimes.length).toFixed(2)
        : 'N/A');
    }

    // Update the bar chart data
    if (selectedDrill) {
      // Generate random data for each zone
      const newData = Array(8).fill().map(() => Math.round(Math.random() * 100));
      setBarChartData({
        ...barChartData,
        datasets: [
          {
            ...barChartData.datasets[0],
            data: newData,
          },
        ],
      });
    }
  }, [selectedSession, selectedDrill, allDrills, allTempos]);

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

      // Optionally, update the URL with the new drill ID as well
      urlParams.set('drillId', firstDrillId);
      window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
    } else {
      // If no drills are found for the selected session, clear the selected drill
      setSelectedDrill('');
    }
  };

  const handleDrillChange = (event) => {
    const newDrillId = event.target.value;
    setSelectedDrill(newDrillId);

    // Update the URL with the new drill ID
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('drillId', newDrillId);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
  }

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
          <TempoCard title="Avg Offensive Tempo" tempo={avgOffensiveTempo} />
          <TempoCard title="Avg Defensive Tempo" tempo={avgDefensiveTempo} />
        </div>
        <div className="heatmap">
          <Bar
            data={barChartData}
            options={chartOptions}
          />
        </div>
      </div>

      <div className="stats-overview">
        <StatCard title="Total Points" value={Math.round(Math.random() * 100)} />
        <StatCard title="Total Rebounds" value={Math.round(Math.random() * 10)} />
        <StatCard title="Total Assists" value={Math.round(Math.random() * 10)} />
      </div>
    </div>
  );
}

export default TeamStats;