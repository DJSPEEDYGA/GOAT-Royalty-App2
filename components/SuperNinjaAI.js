import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SuperNinjaAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm SuperNinja, your AI assistant for royalty management. I can help you with:\n\n• Cinema Camera controls\n• Sora 2 AI video generation\n• Royalty calculations\n• Contract analysis\n• IP protection\n• Music studio management\n• Performance tracking\n• And much more!\n\nHow can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableTools, setAvailableTools] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Initialize available tools
    setAvailableTools([
      "Cinema Camera System",
      "Sora 2 AI Studio", 
      "Royalty Calculator",
      "Contract Analyzer",
      "IP Protection Vault",
      "Music Studio",
      "Tracking Dashboard",
      "Moneypenny AI Search",
      "Codex Engine Tracker"
    ]);
  }, [messages]);

  // Prompt engineering techniques from resources
  const promptTemplates = {
    royaltyCalculation: "As an expert music royalty analyst, please calculate the royalties for the following scenario: {scenario}. Consider industry standards, contractual obligations, and all relevant factors. Provide a detailed breakdown of the calculations.",
    contractAnalysis: "As a music industry contract specialist, analyze the following contract terms: {contract}. Identify potential issues, opportunities, and risks. Provide recommendations for optimization.",
    catalogManagement: "As a music catalog management expert, provide strategies for organizing and optimizing the following catalog: {catalog}. Include suggestions for maximizing revenue streams and identifying growth opportunities.",
    marketAnalysis: "As a music industry market analyst, evaluate the following market data: {data}. Provide insights on trends, opportunities, and potential challenges for royalty generation."
  };

  // Tones for different types of interactions
  const tones = {
    professional: "Maintain a professional tone throughout the response.",
    encouraging: "Provide an encouraging and motivational tone in the response.",
    detailed: "Be extremely detailed and thorough in the response.",
    concise: "Keep the response concise and to the point.",
    creative: "Use a creative and innovative tone in the response."
  };

  // 10X Rule principles for motivation
  const tenXPrinciples = [
    "Set targets 10 times higher than what you think you want",
    "Take 10 times the action to achieve those targets",
    "Massive thoughts must be followed by massive actions",
    "Think and act in a wildly different way than you previously have been",
    "Be willing to do what others won't do"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Enhanced prompt with engineering techniques
      const enhancedPrompt = `Apply the 10X Rule principle: "${tenXPrinciples[Math.floor(Math.random() * tenXPrinciples.length)]}" to approach this query with extraordinary levels of analysis and insight.
      
      User Query: ${inputValue}
      
      Please provide a comprehensive response that incorporates advanced prompt engineering techniques for optimal results.`;

      // Simulate API call to SuperNinja AI
      const response = await axios.post('/api/superninja/chat', {
        message: enhancedPrompt,
        context: messages,
        tools: availableTools
      });

      const aiMessage = {
        id: messages.length + 2,
        text: response.data.reply || "I've analyzed your query using advanced AI techniques. Here are my insights based on the resources available.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const applyPromptTemplate = (templateName, variables = {}) => {
    let template = promptTemplates[templateName] || "Please help with: {query}";
    
    // Replace variables in template
    Object.keys(variables).forEach(key => {
      template = template.replace(`{${key}}`, variables[key]);
    });
    
    setInputValue(template);
  };

  const applyTone = (toneName) => {
    if (inputValue.trim() && tones[toneName]) {
      setInputValue(`${inputValue} ${tones[toneName]}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">🥷 SuperNinja AI Assistant</h2>
        <p className="text-sm text-gray-400">Your intelligent royalty management companion</p>
        <p className="text-xs text-purple-400 mt-1">Integrated with all GOAT app tools</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm">🥷 SuperNinja is analyzing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Engineering Toolbar */}
      <div className="p-2 bg-gray-800 border-t border-gray-700">
        <div className="flex flex-wrap gap-2 mb-2">
          <button 
            onClick={() => applyPromptTemplate('royaltyCalculation', {scenario: '[describe scenario]'})}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Royalty Calc
          </button>
          <button 
            onClick={() => applyPromptTemplate('contractAnalysis', {contract: '[paste contract terms]'})}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Contract Analysis
          </button>
          <button 
            onClick={() => applyPromptTemplate('catalogManagement', {catalog: '[describe catalog]'})}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Catalog Mgmt
          </button>
          <button 
            onClick={() => applyTone('professional')}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Professional Tone
          </button>
          <button 
            onClick={() => applyTone('encouraging')}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Encouraging Tone
          </button>
        </div>
        <div className="flex">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message SuperNinja... (e.g. 'Help me set up the cinema camera' or 'Calculate royalties for 1M streams')"
            className="flex-1 border border-gray-600 bg-gray-700 text-white rounded-l-lg p-2 text-sm resize-none"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 rounded-r-lg"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Available tools: {availableTools.slice(0, 5).join(', ')}...
        </div>
      </div>
    </div>
  );
};

export default SuperNinjaAI;