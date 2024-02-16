import React, { useState } from 'react';
import Selector from './components/Selector';
import Heatmap from './components/Heatmap';
import TempoCard from './components/TempoCard';
import StatCard from './components/StatsDisplay';
import StatsTable from './components/StatsTable';
import NavagationHeader from './components/NavagationHeader'
import './TeamStats.css';

function TeamStats() {
  // Updated mock data to reflect the hierarchical relationship
  const data = {
    seasons: [
      {
        value: '2021',
        label: '2021-2022',
        sessions: [
          {
            value: '1',
            label: 'Session Date: 10/15/2021',
            drills: [
              { value: 'shooting', label: 'Shooting' },
              { value: 'defense', label: 'Defense' },
            ],
          },
          {
            value: '2',
            label: 'Session Date: 10/20/2021',
            drills: [
              { value: 'offense', label: 'Offense' },
              { value: 'freeThrows', label: 'Free Throws' },
            ],
          },
          {
            value: '3',
            label: 'Session Date: 10/25/2021',
            drills: [
              { value: 'rebounding', label: 'Rebounding' },
              { value: 'conditioning', label: 'Conditioning' },
            ],
          },
          {
            value: '4',
            label: 'Session Date: 10/30/2021',
            drills: [
              { value: 'scrimmage', label: 'Scrimmage' },
              { value: 'ballHandling', label: 'Ball Handling' },
            ],
          }
        ],
      },
      {
        value: '2022',
        label: '2022-2023',
        sessions: [
          {
            value: '1',
            label: 'Session Date: 10/15/2022',
            drills: [
              { value: 'shooting', label: 'Shooting' },
              { value: 'defense', label: 'Defense' },
            ],
          },
          {
            value: '2',
            label: 'Session Date: 10/20/2022',
            drills: [
              { value: 'offense', label: 'Offense' },
              { value: 'freeThrows', label: 'Free Throws' },
            ],
          },
          {
            value: '3',
            label: 'Session Date: 10/25/2022',
            drills: [
              { value: 'rebounding', label: 'Rebounding' },
              { value: 'conditioning', label: 'Conditioning' },
            ],
          },
          {
            value: '4',
            label: 'Session Date: 10/30/2022',
            drills: [
              { value: 'scrimmage', label: 'Scrimmage' },
              { value: 'ballHandling', label: 'Ball Handling' },
            ],
          },
          {
            value: '5',
            label: 'Session Date: 11/05/2022',
            drills: [
              { value: '3ptShooting', label: '3-Point Shooting' },
              { value: 'fastBreak', label: 'Fast Break' },
            ],
          }
        ],
      },
    ],
    selectedSeason: null,
    selectedSession: null,
    selectedDrill: null,
    // Other stats data would go here
  };

  const statCardsData = [
    { title: "3 Pt FG %", value: "43.2" }, // Points per game
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

  const [selectedData, setSelectedData] = useState({
    selectedSeason: '',
    selectedSession: '',
    selectedDrill: '',
  });

  // Handle selection changes and update state accordingly
  const handleSeasonChange = (event) => {
    setSelectedData({
      ...selectedData,
      selectedSeason: event.target.value,
      selectedSession: '',
      selectedDrill: '',
    });
  };

  const handleSessionChange = (event) => {
    setSelectedData({
      ...selectedData,
      selectedSession: event.target.value,
      selectedDrill: '',
    });
  };

  const handleDrillChange = (event) => {
    setSelectedData({
      ...selectedData,
      selectedDrill: event.target.value,
    });
  };

  // Filter sessions based on selected season
  const sessionsOptions = data.seasons.find(season => season.value === selectedData.selectedSeason)?.sessions || [];
  // Filter drills based on selected session
  const drillsOptions = sessionsOptions.find(session => session.value === selectedData.selectedSession)?.drills || [];

  return (
    <div className="team-stats-container">
      <header className="team-header">
        <NavagationHeader />
      </header>

      <div className="selectors">
        <Selector options={data.seasons} onChange={handleSeasonChange} label="Season" />
        <Selector options={sessionsOptions} onChange={handleSessionChange} label="Session" disabled={!selectedData.selectedSeason} />
        <Selector options={drillsOptions} onChange={handleDrillChange} label="Drill" disabled={!selectedData.selectedSession} />
      </div>

      <div className="detailed-stats">
        <div className="tempo-cards">
          <TempoCard title="Avg Offensive Tempo" tempo="15.3" />
          <TempoCard title="Avg Defensive Tempo" tempo="14.8" />
        </div>
        <div className="heatmap">
          <Heatmap />
        </div>
      </div>

      <div className="stats-overview">
        {statCardsData.map((card, index) => (
          <StatCard key={index} title={card.title} value={card.value} />
        ))}
      </div>

      <div className='stats-table-container'>
      <h2>Team Stats</h2>
        <div className="stats-table">
        <StatsTable stats={teamStatsData} />
        </div>
      </div>
        
    </div>
  );
}

export default TeamStats;
