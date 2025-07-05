
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import PromptWorkspace from './components/PromptWorkspace';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('splash');

  useEffect(() => {
    // Force dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const enterSentinel = () => {
    setCurrentView('workspace');
  };

  const backToSplash = () => {
    setCurrentView('splash');
  };

  return (
    <div className="app">
        <AnimatePresence mode="wait">
          {currentView === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            >
              <SplashScreen onEnter={enterSentinel} />
            </motion.div>
          )}
          
          {currentView === 'workspace' && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PromptWorkspace onBack={backToSplash} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
