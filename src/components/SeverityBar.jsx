
import React from 'react';
import { motion } from 'framer-motion';

const SeverityBar = ({ label, value, max = 10, color = '#00ff88', format = 'score' }) => {
  const percentage = (value / max) * 100;
  
  const formatValue = () => {
    if (format === 'percentage') {
      return `${Math.round(value * 100)}%`;
    }
    return `${value}/${max}`;
  };

  const getGradientColor = () => {
    if (percentage <= 30) return '#00ff88';
    if (percentage <= 60) return '#ffc107';
    if (percentage <= 80) return '#ff5722';
    return '#f44336';
  };

  return (
    <div className="severity-bar">
      <div className="severity-label">
        <span>{label}</span>
        <span>{formatValue()}</span>
      </div>
      <div className="severity-track">
        <motion.div
          className="severity-fill"
          style={{
            background: `linear-gradient(90deg, ${getGradientColor()}, ${color})`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.2
          }}
        />
      </div>
    </div>
  );
};

export default SeverityBar;
