import React from 'react';
import './Selector.css';

function Selector({ options, onChange, label }) {
  return (
    <>
      <label className="selector-label">{label}: </label>
      <select className="selector-select" onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Selector;
