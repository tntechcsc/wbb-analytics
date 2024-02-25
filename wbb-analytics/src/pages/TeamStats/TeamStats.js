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
    async function fetchData() {
      // Fetch sessions
      const sessionResponse = await fetch('http://localhost:3001/api/sessions');
      const sessionsData = await sessionResponse.json();
      setSessions(sessionsData.map(session => ({
        label: `Session: ${new Date(session.date).toLocaleDateString()}`,
        value: session._id
      })));

      // Fetch drills
      const drillResponse = await fetch('http://localhost:3001/api/drills');
      const drillsData = await drillResponse.json();
      setAllDrills(drillsData);

      const temposResponse = await fetch('http://localhost:3001/api/tempos');
      const temposData = await temposResponse.json();
      setAllTempos(temposData);

      // Pre-select session and drill based on URL params, if present
      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get('sessionId');
      const drillParam = urlParams.get('drillId');
      if (sessionParam) setSelectedSession(sessionParam);
      else setSelectedSession(sessionsData[0]._id);
      if (drillParam) setSelectedDrill(drillParam);
      else setSelectedDrill(drillsData[0]._id.toString());
    }
    fetchData();
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