import React from 'react';
import './StatsTable.css';

const StatsTable = ({ stats }) => {
  return (
    <div className="stats-table-container">
      <table className="stats-table">
        <thead>
          <tr>
            {stats.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;