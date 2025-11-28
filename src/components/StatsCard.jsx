import React from 'react';
import axios from 'axios';

const StatsCard = ({ number, label, color = '#4f46e5' }) => {
  return (
    <div className="stat-card">
      <span className="stat-number" style={{ color }}>
        {number}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default StatsCard;