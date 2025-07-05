import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAgents, 
  preProcessText, 
  generateContent, 
  postProcessText,
  AgentInfo,
  PreProcessResponse,
  PostProcessResponse,
  GeneratedContentResponse
} from '../api';
import AnalysisReport from './AnalysisReport';
import HighlightedText from './HighlightedText';
import TypewriterText from './TypewriterText';

interface PromptWorkspaceProps {
  onBack: () => void;
}

type WorkflowStep = 'input' | 'pre-analysis' | 'generation' | 'post-analysis';

const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({ onBack }) => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [preAnalysis, setPreAnalysis] = useState<PreProcessResponse | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentResponse | null>(null);
  const [postAnalysis, setPostAnalysis] = useState<PostProcessResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async (): Promise<void> => {
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

  const analyzePrompt = async (): Promise<void> => {
    if (!prompt.trim() || !selectedAgent) return;

    setLoading(true);
    setLoadingText('Analyzing prompt for security risks...');
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

  const proceedToGenerate = async (): Promise<void> => {
    setLoading(true);
    setLoadingText('Generating AI content...');
    setCurrentStep('generation');

    try {
      const content = await generateContent(selectedAgent, prompt);
      setGeneratedContent(content);

      setLoadingText('Analyzing generated content...');
      setShowTypewriter(true);
      setTypewriterComplete(false);
      const postAnalysisResult = await postProcessText(content.generated_text);
      setPostAnalysis(postAnalysisResult);

      setTimeout(() => {
        setCurrentStep('post-analysis');
        setLoading(false);
      }, 1000); // Wait 1 second for typewriter effect
    } catch (error) {
      console.error('Generation or post-processing failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const editPrompt = (): void => {
    setCurrentStep('input');
    setPreAnalysis(null);
    setGeneratedContent(null);
    setPostAnalysis(null);
  };

  const startOver = (): void => {
    setPrompt('');
    setCurrentStep('input');
    setPreAnalysis(null);
    setGeneratedContent(null);
    setPostAnalysis(null);
    setShowTypewriter(false);
    setTypewriterComplete(false);
    setShowHighlights(false);
  };

  const getStepStatus = (step: WorkflowStep): 'completed' | 'current' | 'pending' => {
    const steps: WorkflowStep[] = ['input', 'pre-analysis', 'generation', 'post-analysis'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <motion.div 
      className="prompt-workspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="workspace-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="workspace-title">Sentinel AI Workspace</h1>
        <p className="workspace-subtitle">
          Secure AI interactions with comprehensive security analysis
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div 
        className="progress-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
          gap: 'var(--space-md)'
        }}
      >
        {(['input', 'pre-analysis', 'generation', 'post-analysis'] as WorkflowStep[]).map((step, index) => {
          const status = getStepStatus(step);
          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: status === 'completed' ? 'var(--primary-blue)' :
                             status === 'current' ? 'var(--accent-amber)' :
                             'var(--gray-200)',
                  color: status === 'pending' ? 'var(--text-secondary)' : 'white'
                }}
              >
                {index + 1}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: status === 'current' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textTransform: 'capitalize'
                }}
              >
                {step.replace('-', ' ')}
              </span>
              {index < 3 && (
                <div
                  style={{
                    width: '24px',
                    height: '2px',
                    background: status === 'completed' ? 'var(--primary-blue)' : 'var(--gray-200)',
                    marginLeft: 'var(--space-sm)'
                  }}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="input-section"
          >
            <div className="agent-selector">
              <label htmlFor="agent-select">AI Agent Selection</label>
              <select
                id="agent-select"
                className="agent-dropdown"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} — {agent.description}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-sm)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Prompt Input
              </label>
            </div>

            <textarea
              className="prompt-input"
              placeholder="Enter your prompt here. For demonstration, try including sensitive information like an email address or attempt a prompt injection to see the security features in action..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <motion.button
              className="analyze-button"
              onClick={analyzePrompt}
              disabled={!prompt.trim() || !selectedAgent}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Begin Security Analysis
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="loading"
          >
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingText}</div>
          </motion.div>
        )}

        {currentStep === 'pre-analysis' && preAnalysis && !loading && (
          <motion.div
            key="pre-analysis"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnalysisReport 
              analysis={preAnalysis} 
              title="Pre-Processing Security Analysis"
              text={prompt}
              showBias={false}
              useTypewriter={true}
            />

            <div className="actions">
              <motion.button
                className="action-button edit-button"
                onClick={editPrompt}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Modify Prompt
              </motion.button>
              <motion.button
                className="action-button proceed-button"
                onClick={proceedToGenerate}
                disabled={preAnalysis.risk_level === 'critical'}
                whileHover={preAnalysis.risk_level !== 'critical' ? { y: -1 } : {}}
                whileTap={preAnalysis.risk_level !== 'critical' ? { scale: 0.98 } : {}}
              >
                {preAnalysis.risk_level === 'critical' ? 'Risk Level Too High' : 'Proceed to Generation'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 'post-analysis' && generatedContent && postAnalysis && !loading && (
          <motion.div
            key="post-analysis"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="generated-content">
              <h3 className="generated-title">Generated Content</h3>
              <TypewriterText
                text={generatedContent.generated_text}
                speed={20}
                onComplete={() => {
                  setTypewriterComplete(true);
                  setTimeout(() => setShowHighlights(true), 500);
                }}
                className="generated-text-content"
                highlightIndices={postAnalysis?.pii?.indices || []}
                showHighlights={showHighlights}
              />
            </div>

            <AnalysisReport 
              analysis={postAnalysis} 
              title="Post-Processing Content Analysis"
              text={generatedContent.generated_text}
              showBias={true}
              useTypewriter={true}
            />

            <div className="actions">
              <motion.button
                className="action-button edit-button"
                onClick={startOver}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                New Analysis
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="action-button edit-button"
        onClick={onBack}
        style={{ 
          position: 'fixed', 
          top: 'var(--space-xl)', 
          left: 'var(--space-xl)',
          zIndex: 1000
        }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ← Back to Home
      </motion.button>
    </motion.div>
  );
};

export default PromptWorkspace;