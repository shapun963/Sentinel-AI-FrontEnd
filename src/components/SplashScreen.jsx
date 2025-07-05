
import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onEnter }) => {
  const features = [
    {
      icon: '🛡️',
      title: 'Pre-Processing Shield',
      description: 'Detects PII and prompt injections before AI processing'
    },
    {
      icon: '🤖',
      title: 'AI Agent Integration',
      description: 'Connect with multiple AI agents securely'
    },
    {
      icon: '🔍',
      title: 'Post-Processing Analysis',
      description: 'Analyzes generated content for bias and data leakage'
    },
    {
      icon: '📊',
      title: 'Risk Assessment',
      description: 'Real-time severity scoring and risk level determination'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="splash-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="splash-title"
        variants={itemVariants}
      >
        SENTINEL AI
      </motion.h1>
      
      <motion.p 
        className="splash-subtitle"
        variants={itemVariants}
      >
        Advanced AI Security & Bias Detection Platform
      </motion.p>
      
      <motion.div 
        className="splash-features"
        variants={itemVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.button
        className="enter-button"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 30px rgba(0, 255, 136, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onEnter}
      >
        Enter Sentinel
      </motion.button>
    </motion.div>
  );
};

export default SplashScreen;
