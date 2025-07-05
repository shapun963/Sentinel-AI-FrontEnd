
import React from 'react';
import { motion } from 'framer-motion';
import HighlightedText from './HighlightedText';
import SeverityBar from './SeverityBar';

const AnalysisReport = ({ analysis, title, text, showBias = false }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#00ff88';
      case 'medium': return '#ffc107';
      case 'high': return '#ff5722';
      case 'critical': return '#f44336';
      default: return '#a0a0a0';
    }
  };

  const getAllIndices = () => {
    const allIndices = [];
    
    if (analysis.pii?.indices) {
      allIndices.push(...analysis.pii.indices);
    }
    
    if (analysis.promptInjection?.indices) {
      allIndices.push(...analysis.promptInjection.indices);
    }
    
    return allIndices;
  };

  const biasMetrics = showBias && analysis.bias ? [
    { label: 'Racial Bias', value: analysis.bias.racial_score, color: '#ff0088' },
    { label: 'Gender Bias', value: analysis.bias.gender_score, color: '#ff5722' },
    { label: 'Age Bias', value: analysis.bias.age_score, color: '#ff9800' },
    { label: 'Religious Bias', value: analysis.bias.religious_score, color: '#9c27b0' },
    { label: 'Hate Speech', value: analysis.bias.hate_speech_score, color: '#f44336' }
  ] : [];

  return (
    <motion.div 
      className="analysis-report"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <motion.h2 
          className="report-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span 
            className={`risk-level risk-${analysis.risk_level}`}
            style={{ 
              boxShadow: `0 0 20px ${getRiskColor(analysis.risk_level)}40` 
            }}
          >
            {analysis.risk_level} Risk
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SeverityBar 
          label="Overall Severity"
          value={analysis.overall_severity_score}
          max={10}
          color={getRiskColor(analysis.risk_level)}
        />
      </motion.div>

      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HighlightedText 
            text={text}
            indices={getAllIndices()}
          />
        </motion.div>
      )}

      {showBias && biasMetrics.length > 0 && (
        <motion.div 
          className="bias-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="bias-title">Bias Analysis</h3>
          <div className="bias-bars">
            {biasMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <SeverityBar 
                  label={metric.label}
                  value={metric.value}
                  max={1}
                  color={metric.color}
                  format="percentage"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {analysis.summary_explanations && analysis.summary_explanations.length > 0 && (
        <motion.div 
          className="explanations"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h4>Summary Explanations</h4>
          <ul>
            {analysis.summary_explanations.map((explanation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                {explanation}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalysisReport;
