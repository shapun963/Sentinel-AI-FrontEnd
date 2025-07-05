
import { USE_MOCK_DATA, SHIELD_SERVER_URL, AGENT_SERVER_URL } from './config.js';

// Mock data that matches the API contract exactly
const mockAgents = [
  {
    id: "gpt-4",
    name: "GPT-4 Advanced",
    description: "OpenAI's most capable model for complex tasks",
    endpoint: "/agents/gpt-4"
  },
  {
    id: "claude-3",
    name: "Claude 3 Opus",
    description: "Anthropic's most powerful AI assistant",
    endpoint: "/agents/claude-3"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's advanced AI model",
    endpoint: "/agents/gemini-pro"
  }
];

const mockPreProcessResponse = {
  pii: {
    detected: true,
    indices: [
      {
        start: 25,
        end: 42,
        type: "pii",
        piiType: "email",
        severity_score: 7,
        explanation: "Email address detected: potential privacy risk"
      },
      {
        start: 65,
        end: 76,
        type: "pii",
        piiType: "ssn",
        severity_score: 9,
        explanation: "Social Security Number detected: high privacy risk"
      }
    ]
  },
  promptInjection: {
    detected: true,
    indices: [
      {
        start: 100,
        end: 130,
        type: "injection",
        piiType: null,
        severity_score: 8,
        explanation: "Potential prompt injection detected: attempting to override system instructions"
      }
    ]
  },
  overall_severity_score: 8,
  risk_level: "high",
  summary_explanations: [
    "Email address and SSN detected in prompt",
    "Potential prompt injection attempt identified",
    "High risk of data exposure and system manipulation"
  ]
};

const mockGeneratedContent = {
  generated_text: "Based on your request, here's a comprehensive analysis of cybersecurity trends. However, I cannot process personal information like john.doe@company.com or provide specific details about social security number 123-45-6789. This response may contain inherent biases regarding gender roles in technology and could perpetuate stereotypes about age-based technical competency."
};

const mockPostProcessResponse = {
  pii: {
    detected: true,
    indices: [
      {
        start: 95,
        end: 118,
        type: "pii",
        piiType: "email",
        severity_score: 6,
        explanation: "Email address leaked in generated content"
      },
      {
        start: 165,
        end: 176,
        type: "pii",
        piiType: "ssn",
        severity_score: 9,
        explanation: "SSN referenced in generated content"
      }
    ]
  },
  bias: {
    detected: true,
    indices: [],
    racial_score: 0.2,
    gender_score: 0.7,
    age_score: 0.6,
    religious_score: 0.1,
    hate_speech_score: 0.05
  },
  overall_severity_score: 7,
  risk_level: "high",
  summary_explanations: [
    "PII leakage detected in generated content",
    "Gender bias detected in technology-related context",
    "Age-based bias present in technical competency assumptions"
  ]
};

// API functions
export const getAgents = async () => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockAgents), 800));
  }

  const response = await fetch(`${AGENT_SERVER_URL}/agents`);
  return response.json();
};

export const preProcessText = async (text) => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockPreProcessResponse), 1500));
  }

  const response = await fetch(`${SHIELD_SERVER_URL}/shield/pre-process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  });
  return response.json();
};

export const generateContent = async (agentId, prompt) => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockGeneratedContent), 2500));
  }

  const response = await fetch(`${AGENT_SERVER_URL}/agents/generate/${agentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return response.json();
};

export const postProcessText = async (text) => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockPostProcessResponse), 1200));
  }

  const response = await fetch(`${SHIELD_SERVER_URL}/shield/post-process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
};
