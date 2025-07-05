
import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const features = [
    {
      icon: '🛡️',
      title: 'Pre-Processing Shield',
      description: 'Advanced detection of PII and prompt injections before AI processing'
    },
    {
      icon: '🤖',
      title: 'Multi-Agent Integration',
      description: 'Seamlessly connect with multiple AI agents while maintaining security'
    },
    {
      icon: '🔍',
      title: 'Content Analysis',
      description: 'Comprehensive analysis of generated content for bias and data leakage'
    },
    {
      icon: '📊',
      title: 'Risk Assessment',
      description: 'Real-time severity scoring and intelligent risk level determination'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
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
        Sentinel AI
      </motion.h1>
      
      <motion.p 
        className="splash-subtitle"
        variants={itemVariants}
      >
        Enterprise-grade AI security and bias detection platform for safe AI interactions
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
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
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
          y: -2,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onEnter}
      >
        Access Platform
      </motion.button>
    </motion.div>
  );
};

export default SplashScreen;
