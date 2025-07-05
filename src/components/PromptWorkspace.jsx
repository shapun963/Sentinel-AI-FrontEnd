
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAgents, preProcessText, generateContent, postProcessText } from '../api.js';
import AnalysisReport from './AnalysisReport';
import HighlightedText from './HighlightedText';

const PromptWorkspace = ({ onBack }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [preAnalysis, setPreAnalysis] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [postAnalysis, setPostAnalysis] = useState(null);
  const [currentStep, setCurrentStep] = useState('input'); // input, pre-analysis, generation, post-analysis

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const agentList = await getAgents();
      setAgents(agentList);
      if (agentList.length > 0) {
        setSelectedAgent(agentList[0].id);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const analyzePrompt = async () => {
    if (!prompt.trim() || !selectedAgent) return;

    setLoading(true);
    setLoadingText('Analyzing prompt for risks...');
    setCurrentStep('pre-analysis');

    try {
      const analysis = await preProcessText(prompt);
      setPreAnalysis(analysis);
    } catch (error) {
      console.error('Pre-processing failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToGenerate = async () => {
    setLoading(true);
    setLoadingText('Generating AI content...');
    setCurrentStep('generation');

    try {
      const content = await generateContent(selectedAgent, prompt);
      setGeneratedContent(content);
      
      setLoadingText('Analyzing generated content...');
      const postAnalysisResult = await postProcessText(content.generated_text);
      setPostAnalysis(postAnalysisResult);
      setCurrentStep('post-analysis');
    } catch (error) {
      console.error('Generation or post-processing failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const editPrompt = () => {
    setCurrentStep('input');
    setPreAnalysis(null);
    setGeneratedContent(null);
    setPostAnalysis(null);
  };

  const startOver = () => {
    setPrompt('');
    setCurrentStep('input');
    setPreAnalysis(null);
    setGeneratedContent(null);
    setPostAnalysis(null);
  };

  return (
    <motion.div 
      className="prompt-workspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="workspace-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="workspace-title">SENTINEL AI WORKSPACE</h1>
        <p className="workspace-subtitle">Secure AI interaction with real-time analysis</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="input-section"
          >
            <div className="agent-selector">
              <label htmlFor="agent-select">Select AI Agent:</label>
              <select
                id="agent-select"
                className="agent-dropdown"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} - {agent.description}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="prompt-input"
              placeholder="Enter your prompt here. Try including an email like john.doe@company.com or attempt a prompt injection to see the security features in action..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <motion.button
              className="analyze-button"
              onClick={analyzePrompt}
              disabled={!prompt.trim() || !selectedAgent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Analyze Prompt
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="loading"
          >
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingText}</div>
          </motion.div>
        )}

        {currentStep === 'pre-analysis' && preAnalysis && !loading && (
          <motion.div
            key="pre-analysis"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisReport 
              analysis={preAnalysis} 
              title="Pre-Processing Analysis"
              text={prompt}
              showBias={false}
            />
            
            <div className="actions">
              <motion.button
                className="action-button edit-button"
                onClick={editPrompt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Prompt
              </motion.button>
              <motion.button
                className="action-button proceed-button"
                onClick={proceedToGenerate}
                disabled={preAnalysis.risk_level === 'critical'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {preAnalysis.risk_level === 'critical' ? 'Risk Too High' : 'Proceed to Generate'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 'post-analysis' && generatedContent && postAnalysis && !loading && (
          <motion.div
            key="post-analysis"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="generated-content">
              <h3 className="generated-title">Generated Content</h3>
              <HighlightedText 
                text={generatedContent.generated_text}
                indices={postAnalysis.pii.indices}
              />
            </div>

            <AnalysisReport 
              analysis={postAnalysis} 
              title="Post-Processing Analysis"
              text={generatedContent.generated_text}
              showBias={true}
            />
            
            <div className="actions">
              <motion.button
                className="action-button edit-button"
                onClick={startOver}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Over
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="action-button edit-button"
        onClick={onBack}
        style={{ position: 'fixed', top: '2rem', left: '2rem' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Splash
      </motion.button>
    </motion.div>
  );
};

export default PromptWorkspace;
