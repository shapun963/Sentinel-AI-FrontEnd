
import React, { useState, useEffect } from 'react';
import HighlightedText from './HighlightedText';
import { IndexSpan } from '../api';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  highlightIndices?: IndexSpan[];
  showHighlights?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = '',
  highlightIndices = [],
  showHighlights = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setShowCursor(false);
      setIsComplete(true);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setShowCursor(true);
    setIsComplete(false);
  }, [text]);

  // If typewriter is complete and we should show highlights, use HighlightedText
  if (isComplete && showHighlights && highlightIndices.length > 0) {
    return (
      <div className={className}>
        <HighlightedText text={text} indices={highlightIndices} />
      </div>
    );
  }

  // Otherwise, show typewriter effect
  return (
    <span className={`typewriter-text ${className}`}>
      {displayedText}
      {showCursor && <span className="typewriter-cursor"></span>}
    </span>
  );
};

export default TypewriterText;
