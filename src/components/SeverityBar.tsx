
import React from 'react';
import { motion } from 'framer-motion';

interface SeverityBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  format?: 'score' | 'percentage';
}

const SeverityBar: React.FC<SeverityBarProps> = ({ 
  label, 
  value, 
  max = 10, 
  color = '#2563eb', 
  format = 'score' 
}) => {
  const percentage = (value / max) * 100;
  
  const formatValue = (): string => {
    if (format === 'percentage') {
      return `${Math.round(value * 100)}%`;
    }
    return `${value}/${max}`;
  };

  const getGradientColor = (): string => {
    if (percentage <= 30) return '#059669';
    if (percentage <= 60) return '#d97706';
    if (percentage <= 80) return '#ea580c';
    return '#dc2626';
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
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.1
          }}
        />
      </div>
    </div>
  );
};

export default SeverityBar;
