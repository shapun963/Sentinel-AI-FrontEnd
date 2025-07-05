
import React from 'react';
import { motion } from 'framer-motion';
import HighlightedText from './HighlightedText';
import SeverityBar from './SeverityBar';
import { PreProcessResponse, PostProcessResponse, IndexSpan } from '../api';

interface AnalysisReportProps {
  analysis: PreProcessResponse | PostProcessResponse;
  title: string;
  text?: string;
  showBias?: boolean;
}

interface BiasMetric {
  label: string;
  value: number;
  color: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ 
  analysis, 
  title, 
  text, 
  showBias = false 
}) => {
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return '#059669';
      case 'medium': return '#d97706';
      case 'high': return '#ea580c';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getAllIndices = (): IndexSpan[] => {
    const allIndices: IndexSpan[] = [];
    
    if (analysis.pii?.indices) {
      allIndices.push(...analysis.pii.indices);
    }
    
    if ('promptInjection' in analysis && analysis.promptInjection?.indices) {
      allIndices.push(...analysis.promptInjection.indices);
    }
    
    return allIndices;
  };

  const biasMetrics: BiasMetric[] = showBias && 'bias' in analysis && analysis.bias ? [
    { label: 'Racial Bias', value: analysis.bias.racial_score, color: '#dc2626' },
    { label: 'Gender Bias', value: analysis.bias.gender_score, color: '#ea580c' },
    { label: 'Age Bias', value: analysis.bias.age_score, color: '#d97706' },
    { label: 'Religious Bias', value: analysis.bias.religious_score, color: '#7c2d12' },
    { label: 'Hate Speech', value: analysis.bias.hate_speech_score, color: '#991b1b' }
  ] : [];

  return (
    <motion.div 
      className="analysis-report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="report-header">
        <motion.h2 
          className="report-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`risk-level risk-${analysis.risk_level}`}>
            {analysis.risk_level} Risk
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SeverityBar 
          label="Overall Severity Score"
          value={analysis.overall_severity_score}
          max={10}
          color={getRiskColor(analysis.risk_level)}
        />
      </motion.div>

      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
        >
          <h3 className="bias-title">Bias Analysis</h3>
          <div className="bias-bars">
            {biasMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
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
          transition={{ delay: 0.7 }}
        >
          <h4>Analysis Summary</h4>
          <ul>
            {analysis.summary_explanations.map((explanation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
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
