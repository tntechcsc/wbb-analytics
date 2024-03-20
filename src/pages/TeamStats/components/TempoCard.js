import React from 'react';
import './TempoCard.css';

function TempoCard({ title, tempo }) {
  return (
    <div className="tempo-card">
      <h3 className="tempo-title">{title}</h3>
      <div className="tempo-value">
        <time>{tempo}</time> seconds
      </div>
    </div>
  );
}

export default TempoCard;
