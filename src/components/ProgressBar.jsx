import React from 'react';
import axios from 'axios';

const ProgressBar = ({ title, current, total, description }) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="progress-card">
      <h3>{title}</h3>
      {description && <p style={{ marginBottom: '1rem', color: '#64748b' }}>{description}</p>}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="progress-text">
          <span>{current} of {total} completed</span>
          <span className="progress-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;