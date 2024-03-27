import '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';

const ExportPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [gamesAndPractices, setGamesAndPractices] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'name', headerName: 'Opponent/Session', width: 200 },
    { field: 'location', headerName: 'Location', width: 150 },
  ];

  useEffect(() => {
    fetch(serverUrl + '/api/seasons')
      .then(response => response.json())
      .then(data => {
        setSeasons(data.map(season => ({ id: season._id, name: season.year })));
      });
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;
  
    Promise.all([
        fetch(serverUrl + `/api/seasons/${selectedSeason}/gamesDate`).then(res => res.json()),
        fetch(serverUrl + `/api/seasons/${selectedSeason}/practicesDate`).then(res => res.json())
    ]).then(([games, practices]) => {
        const combinedData = [...games, ...practices].map((item, index) => ({
            id: item._id,
            date: new Date(item.date).toLocaleDateString('en-US'),
            type: item.hasOwnProperty('opponent') ? 'Game' : 'Practice',
            name: item.opponent || 'Practice Session',
            location: item.location || 'N/A'
        }));
        setGamesAndPractices(combinedData);
    }).catch(error => {
      console.error("Failed to fetch games or practices:", error);
    });
  }, [selectedSeason]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const exportToCSV = (data, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,";
  
    // Add the header row
    const headers = ['Date', 'Type', 'Opponent/Session', 'Location'];
    csvContent += headers.join(',') + '\r\n';
  
    // Add the data rows
    data.forEach(row => {
      const rowData = [row.date, row.type, row.name, row.location];
      csvContent += rowData.join(',') + '\r\n';
    });
  
    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);
  
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Cleanup
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', gap: '20px' }}>
      <FormControl variant="filled" style={{ minWidth: 200 }}>
        <InputLabel>Season</InputLabel>
        <Select
          value={selectedSeason}
          onChange={handleSeasonChange}
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.id}>{season.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 400, width: '80%' }}>
        <DataGrid
          rows={gamesAndPractices}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.id} // Ensure this matches the identifier field in your row data
        />
        <Button variant="contained" onClick={exportToCSV}>Export to CSV</Button>

      </div>
    </div>
  );
};

export default ExportPage;
