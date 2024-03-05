import React from 'react';
import './StatsDisplay.css';

function StatCard({ title, value, icon }) {
  return (
    <section className="stat-card">
      {icon && <img src={icon} alt="" className="stat-icon" />} {/* Conditional rendering for an icon */}
      <header className="stat-title">{title}</header>
      <div className="stat-value">{value}</div>
    </section>
  );
}

export default StatCard;
