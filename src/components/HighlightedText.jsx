
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HighlightedText = ({ text, indices = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getHighlightClass = (type) => {
    switch (type) {
      case 'pii': return 'highlight-pii';
      case 'injection': return 'highlight-injection';
      default: return 'highlight-pii';
    }
  };

  const handleMouseEnter = (index, event) => {
    setHoveredIndex(index);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY - 40
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const renderHighlightedText = () => {
    if (!indices || indices.length === 0) {
      return <span>{text}</span>;
    }

    // Sort indices by start position
    const sortedIndices = [...indices].sort((a, b) => a.start - b.start);
    const segments = [];
    let lastIndex = 0;

    sortedIndices.forEach((highlight, i) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        segments.push(
          <span key={`text-${i}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      segments.push(
        <motion.span
          key={`highlight-${i}`}
          className={`highlight ${getHighlightClass(highlight.type)}`}
          onMouseEnter={(e) => handleMouseEnter(i, e)}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          {text.slice(highlight.start, highlight.end)}
        </motion.span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  return (
    <div className="highlighted-text">
      {renderHighlightedText()}
      
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="tooltip"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <strong>Type:</strong> {indices[hoveredIndex]?.type}<br/>
            {indices[hoveredIndex]?.piiType && (
              <>
                <strong>PII Type:</strong> {indices[hoveredIndex].piiType}<br/>
              </>
            )}
            <strong>Severity:</strong> {indices[hoveredIndex]?.severity_score}/10<br/>
            <strong>Explanation:</strong> {indices[hoveredIndex]?.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HighlightedText;
