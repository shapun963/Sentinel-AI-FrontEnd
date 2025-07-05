
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndexSpan } from '../api';

interface HighlightedTextProps {
  text: string;
  indices?: IndexSpan[];
}

interface TooltipPosition {
  x: number;
  y: number;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, indices = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  const getHighlightClass = (type: string): string => {
    switch (type) {
      case 'pii': return 'highlight-pii';
      case 'injection': return 'highlight-injection';
      default: return 'highlight-pii';
    }
  };

  const handleMouseEnter = (index: number, event: React.MouseEvent): void => {
    setHoveredIndex(index);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY - 40
    });
  };

  const handleMouseLeave = (): void => {
    setHoveredIndex(null);
  };

  const renderHighlightedText = (): (string | JSX.Element)[] => {
    if (!indices || indices.length === 0) {
      return [text];
    }

    // Sort indices by start position
    const sortedIndices = [...indices].sort((a, b) => a.start - b.start);
    const segments: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    sortedIndices.forEach((highlight, i) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        segments.push(text.slice(lastIndex, highlight.start));
      }

      // Add highlighted text
      segments.push(
        <motion.span
          key={`highlight-${i}`}
          className={`highlight ${getHighlightClass(highlight.type)}`}
          onMouseEnter={(e) => handleMouseEnter(i, e)}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          {text.slice(highlight.start, highlight.end)}
        </motion.span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
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
            transition={{ duration: 0.15 }}
          >
            <strong>Type:</strong> {indices[hoveredIndex]?.type}<br/>
            {indices[hoveredIndex]?.piiType && (
              <>
                <strong>PII Type:</strong> {indices[hoveredIndex].piiType}<br/>
              </>
            )}
            <strong>Severity:</strong> {indices[hoveredIndex]?.severity_score}/10<br/>
            <strong>Details:</strong> {indices[hoveredIndex]?.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HighlightedText;
