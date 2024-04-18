import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FormControl, InputLabel, Select, MenuItem, Button, Grid, Box } from '@mui/material';

const ExportPage = () => {
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [stats, setStats] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    fetch(`${serverUrl}/api/practices`)
      .then(response => response.json())
      .then(data => {
        setPractices(data.map(practice => ({ id: practice._id, name: practice.date })));
      });
  }, []);

  const handlePracticeChange = (event) => {
    setSelectedPractice(event.target.value);
    if (event.target.value) {
      fetch(`${serverUrl}/api/stats/exportPractice/${event.target.value}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
        })
        .catch(error => console.error('Failed to fetch stats:', error));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const exportToCSV = () => {
    const headers = [
      'PracticeDate', 'DrillName', 'PlayerNumber', 'offensive_rebound', 'defensive_rebounds', 'assists', 
      'steals', 'blocks', 'turnovers', 'fieldGoalsMade', 'fieldGoalsAttempted', 'threePointMade', 
      'threePointAttempted', 'zone1Made', 'zone1Attempted', 'zone2Made', 'zone2Attempted', 
      'zone3Made', 'zone3Attempted', 'zone4Made', 'zone4Attempted', 'zone5Made', 'zone5Attempted', 
      'zone6Made', 'zone6Attempted', 'zone7Made', 'zone7Attempted', 'zone8Made', 'zone8Attempted', 
      'shotClockFirstThirdMade', 'shotClockFirstThirdAttempted', 'shotClockSecondThirdMade', 
      'shotClockSecondThirdAttempted', 'shotClockFinalThirdMade', 'shotClockFinalThirdAttempted', 
      'averageOffensiveTempo', 'averageDefensiveTempo'
    ];
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\r\n";

    stats.forEach(row => {
      const rowData = headers.map(header => row[header] || 0); // Default to 0 if data is undefined
      csvContent += rowData.join(',') + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');

    const practiceDate = stats.length ? formatDate(stats[0].PracticeDate) : '';
    const filename = `practice_stats_${practiceDate.replace(/-/g, '_')}.csv`;

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(stats);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const practiceDate = stats.length ? formatDate(stats[0].PracticeDate) : '';
    const filename = `practice_stats_${practiceDate.replace(/-/g, '_')}.json`;

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 360, my: 4 }}>
        <FormControl fullWidth variant="filled" sx={{ backgroundColor: '#FFCC33', '.MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }}>
          <InputLabel id="practice-select-label" sx={{ color: 'black' }}>Practice</InputLabel>
          <Select
            labelId="practice-select-label"
            value={selectedPractice}
            onChange={handlePracticeChange}
            sx={{ color: 'black', '& .MuiSvgIcon-root': { color: 'black' } }}
          >
            {practices.map(practice => (
              <MenuItem key={practice.id} value={practice.id} sx={{ backgroundColor: '#FFCC33', '&:hover': { backgroundColor: '#E6B800' } }}>
                {formatDate(practice.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" onClick={exportToCSV} disabled={!stats.length}>Export to CSV</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={exportToJSON} disabled={!stats.length}>Export to JSON</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ExportPage;
