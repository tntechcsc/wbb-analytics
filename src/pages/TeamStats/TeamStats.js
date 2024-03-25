import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // For displaying bar charts
import Chart from 'chart.js/auto'; // Auto-import necessary for Chart.js to function correctly
import { random } from 'lodash'; // Utility for generating random values (used for demo purposes)
import NavigationHeader from './components/NavigationHeader'; // Custom component for navigation header
import Selector from './components/Selector'; // Custom component for selection dropdowns
import TempoCard from './components/TempoCard'; // Displays tempo stats
import StatCard from './components/StatsDisplay'; // Displays various statistics
import './TeamStats.css'; // Stylesheet for the TeamStats component

// Configuration options for Chart.js bar charts
const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ffffff', // White y-axis labels
      }
    },
    x: {
      ticks: {
        color: '#ffffff', // White x-axis labels
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#ffffff', // White legend text
      }
    },
    tooltip: {
      enabled: false, // Disable tooltips
    }
  },
  hover: {
    mode: null // Disable hover effects
  },
};

function TeamStats() {
  // State variables for storing fetched data and user selections
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [drills, setDrills] = useState([]);
  const [selectedDrill, setSelectedDrill] = useState('');
  const [error, setError] = useState(''); // State for storing any error messages
  
  // State variables for statistics calculations
  const [avgOffensiveTempo, setAvgOffensiveTempo] = useState(0);
  const [avgDefensiveTempo, setAvgDefensiveTempo] = useState(0);
  const [TotalPoints, setTotalPoints] = useState(0);
  const [ThreePointPercentage, setThreePointPercentage] = useState(0);
  const [TwoPointPercentage, setTwoPointPercentage] = useState(0);
  
  // Initial state for bar chart data, with dummy values replaced later
  const [barChartData, setBarChartData] = useState({
    labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8'],
    datasets: [
      {
        label: '% of Shots Made',
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: Array(8).fill(0).map(() => random(0, 100)), // Dummy data for chart initialization
      },
    ],
  });

  // Fetches the list of seasons from the server
  const fetchSeasons = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/seasons');
      const data = await response.json();
      setSeasons(data);
    } catch (error) {
      console.error('Failed to fetch seasons:', error);
      setError('Failed to load seasons. Please try again.');
    }
  };

  // Fetches sessions for a given season ID
  const fetchSessions = async (seasonId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sessions/season/${seasonId}`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError('Failed to load sessions. Please try again.');
    }
  };

  // Fetches drills for a given session ID
  const fetchDrills = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/drills/session/${sessionId}`);
      const data = await response.json();
      setDrills(data);
    } catch (error) {
      console.error('Failed to fetch drills:', error);
      setError('Failed to load drills. Please try again.');
    }
  };

  // Function to fetch all tempos and filter based on the selected drill ID
  const fetchTempos = async (gameOrDrillId) => {
    try {
      // Fetching all tempos
      const response = await fetch(`http://localhost:3001/api/tempos/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allTempos = await response.json();

      // Filtering by gameOrDrillId on the client side
      const filteredTempos = allTempos.filter(tempo => tempo.gameOrDrill_id === gameOrDrillId);
      console.log('Filtered tempos:', filteredTempos);

      const offensiveTempos = filteredTempos.filter(tempo => tempo.tempo_type === 'offensive');
      const defensiveTempos = filteredTempos.filter(tempo => tempo.tempo_type === 'defensive');

      const offensiveTempoSum = offensiveTempos.reduce((total, tempo) => total + tempo.transition_time, 0);
      const defensiveTempoSum = defensiveTempos.reduce((total, tempo) => total + tempo.transition_time, 0);

      const offensiveTempoAvg = offensiveTempos.length > 0 ? offensiveTempoSum / offensiveTempos.length : 0;
      const defensiveTempoAvg = defensiveTempos.length > 0 ? defensiveTempoSum / defensiveTempos.length : 0;

      // Assuming setAvgOffensiveTempo and setAvgDefensiveTempo are React state setters
      setAvgOffensiveTempo(offensiveTempoAvg.toFixed(2));
      setAvgDefensiveTempo(defensiveTempoAvg.toFixed(2));
      setError(''); // Assuming setError is a React state setter for handling errors
    } catch (error) {
      console.error('Failed to fetch tempos:', error);
      setError('Failed to load tempos. Please try again.');
    }
  };

  // Fetch all shots
  const fetchShots = async (gameOrDrillId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/shots/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allShots = await response.json();

      // Filtering by gameOrDrillId on the client side
      const filteredShots = allShots.filter(shot => shot.gameOrDrill_id === gameOrDrillId);

      // Initialize counters
      let totalPoints = 0;
      let twoPointAttempts = 0;
      let twoPointMade = 0;
      let threePointAttempts = 0;
      let threePointMade = 0;

      filteredShots.forEach(shot => {
        if (shot.zone >= 1 && shot.zone <= 5) { // 2-point shots
          twoPointAttempts++;
          if (shot.made) {
            twoPointMade++;
            totalPoints += 2;
          }
        } else if (shot.zone >= 6 && shot.zone <= 8) { // 3-point shots
          threePointAttempts++;
          if (shot.made) {
            threePointMade++;
            totalPoints += 3;
          }
        }
      });

      // Calculate percentages
      const twoPointPercentage = twoPointAttempts > 0 ? (twoPointMade / twoPointAttempts) * 100 : 0;
      const threePointPercentage = threePointAttempts > 0 ? (threePointMade / threePointAttempts) * 100 : 0;

      // Update state with calculated values
      setTotalPoints(totalPoints);
      setThreePointPercentage(threePointPercentage.toFixed(2));
      setTwoPointPercentage(twoPointPercentage.toFixed(2));

      processShotsForChart(filteredShots);

    } catch (error) {
      console.error('Failed to fetch shots:', error);
      setError('Failed to load shots. Please try again.');
    }
  };

  const processShotsForChart = (filteredShots) => {
    const shotCountsByZone = {}; // Object to hold counts of made and total shots by zone

    filteredShots.forEach(shot => {
      if (!shotCountsByZone[shot.zone]) {
        shotCountsByZone[shot.zone] = { made: 0, total: 0 };
      }
      shotCountsByZone[shot.zone].total += 1;
      if (shot.made) {
        shotCountsByZone[shot.zone].made += 1;
      }
    });

    const labels = [];
    const data = [];

    Object.keys(shotCountsByZone).sort().forEach(zone => {
      labels.push(`Zone ${zone}`);
      const { made, total } = shotCountsByZone[zone];
      const percentage = total > 0 ? (made / total) * 100 : 0;
      data.push(percentage.toFixed(2)); // Keep only two decimal places
    });

    setBarChartData({
      labels,
      datasets: [
        {
          label: '% of Shots Made by Zone',
          backgroundColor: 'rgba(255, 215, 0, 0.6)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          data,
        },
      ],
    });
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Seasons
      try {
        const response = await fetch('http://localhost:3001/api/seasons');
        const seasonsData = await response.json();
        setSeasons(seasonsData);
        setError(''); // Reset any previous errors
        if (seasonsData.length > 0) {
          const defaultSeasonId = seasonsData[0]._id;
          setSelectedSeason(defaultSeasonId); // Set default season

          // Fetch Sessions for default season
          const sessionsResponse = await fetch(`http://localhost:3001/api/sessions/season/${defaultSeasonId}`);
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData);
          if (sessionsData.length > 0) {
            const defaultSessionId = sessionsData[0]._id;
            setSelectedSession(defaultSessionId); // Set default session

            // Fetch Drills for default session
            const drillsResponse = await fetch(`http://localhost:3001/api/drills/session/${defaultSessionId}`);
            const drillsData = await drillsResponse.json();
            setDrills(drillsData);
            if (drillsData.length > 0) {
              const defaultDrillId = drillsData[0]._id;
              setSelectedDrill(defaultDrillId); // Set default drill
              // Optionally, fetch tempos and shots for the default drill
              fetchTempos(defaultDrillId);
              fetchShots(defaultDrillId);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to load initial data. Please try again.');
      }
    };

    fetchInitialData();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  useEffect(() => {
    if (selectedSeason) {
      const fetchSessionsForSeason = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/sessions/season/${selectedSeason}`);
          const sessionsData = await response.json();
          setSessions(sessionsData);
          setError(''); // Reset any previous errors
          if (sessionsData.length > 0) {
            setSelectedSession(sessionsData[0]._id); // Automatically select the first session
          } else {
            setSelectedSession('');
            setDrills([]); // Clear drills if no sessions are available
          }
        } catch (error) {
          console.error('Failed to fetch sessions:', error);
          setError('Failed to load sessions. Please try again.');
        }
      };

      fetchSessionsForSeason();
    }
  }, [selectedSeason]); // Re-fetch sessions when selectedSeason changes

  useEffect(() => {
    if (selectedSession) {
      const fetchDrillsForSession = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/drills/session/${selectedSession}`);
          const drillsData = await response.json();
          setDrills(drillsData);
          setError(''); // Reset any previous errors
          if (drillsData.length > 0) {
            setSelectedDrill(drillsData[0]._id); // Automatically select the first drill
            fetchTempos(drillsData[0]._id); // Fetch tempos for the first drill
            fetchShots(drillsData[0]._id); // Fetch shots for the first drill
          } else {
            setSelectedDrill('');
          }
        } catch (error) {
          console.error('Failed to fetch drills:', error);
          setError('Failed to load drills. Please try again.');
        }
      };

      fetchDrillsForSession();
    } else {
      setDrills([]); // Clear drills if no session is selected
      // Optionally clear tempos and shots data as well
    }
  }, [selectedSession]); // Re-fetch drills, tempos, and shots when selectedSession changes


  const handleSeasonChange = async (e) => {
    const newSelectedSeason = e.target.value;
    setSelectedSeason(newSelectedSeason);
    await fetchSessions(newSelectedSeason);
  };

  const handleSessionChange = async (e) => {
    const newSelectedSession = e.target.value;
    setSelectedSession(newSelectedSession);
    await fetchDrills(newSelectedSession);
  };

  const handleDrillChange = async (e) => {
    const newSelectedDrill = e.target.value;
    setSelectedDrill(newSelectedDrill);
    // Fetch tempos and calculate average tempos
    await fetchTempos(newSelectedDrill);
    await fetchShots(newSelectedDrill);
  };

  return (
    <div className="team-stats-container">
      <header className="team-header">
        {/* Assuming NavagationHeader is a typo and should be NavigationHeader */}
        <NavigationHeader />
      </header>

      <div className="selectors">
        <Selector
          options={seasons.map(season => ({ label: `Season: ${season.year}`, value: season._id }))}
          onChange={handleSeasonChange}
          label="Season"
          value={selectedSeason}
        />
        <Selector
          options={sessions.map(session => {
            const date = new Date(session.date);
            return { label: `Session: ${date.toLocaleDateString()}`, value: session._id };
          })}
          onChange={handleSessionChange}
          label="Session"
          value={selectedSession}
          disabled={!selectedSeason} // Disable if no season is selected
        />
        <Selector
          options={drills.map(drill => ({ label: drill.name, value: drill._id }))}
          onChange={handleDrillChange}
          label="Drill"
          value={selectedDrill}
          disabled={!selectedSession} // Disable if no session is selected
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
        <StatCard title="Total Points" value={TotalPoints} />
        <StatCard title="3-Point %" value={ThreePointPercentage} />
        <StatCard title="2-Point %" value={TwoPointPercentage} />
      </div>
    </div>
  );
}

export default TeamStats;