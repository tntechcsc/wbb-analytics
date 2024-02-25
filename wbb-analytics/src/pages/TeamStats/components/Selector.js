import React from 'react';
import './Selector.css';

function Selector({ options, onChange, label, value }) { // Add a value prop here
  return (
    <>
      <label className="selector-label">{label}: </label>
      <select className="selector-select" onChange={onChange} value={value}>
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
