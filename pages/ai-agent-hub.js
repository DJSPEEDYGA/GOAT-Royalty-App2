/**
 * AI Agent Hub - Central Dashboard for All AI Agents
 * GOAT Royalty App - Advanced AI Agent Interface
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AIAgentHub() {
  const [activeAgent, setActiveAgent] = useState('orchestrator');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  // Form states
  const [goalInput, setGoalInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('medium');
  
  // Fetch agent status
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };
  
  // Orchestrate goal
  const handleOrchestrate = async () => {
    if (!goalInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalInput })
      });
      const data = await res.json();
      setResults(prev => [{ type: 'orchestrate', ...data }, ...prev]);
    } catch (error) {
      console.error('Orchestration failed:', error);
    }
    setLoading(false);
  };
  
  // Autonomous execution
  const handleAutonomous = async () => {
    if (!goalInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=autonomous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalInput })
      });
      const data = await res.json();
      setResults(prev => [{ type: 'autonomous', ...data }, ...prev]);
    } catch (error) {
      console.error('Autonomous execution failed:', error);
    }
    setLoading(false);
  };
  
  // Multi-agent task
  const handleMultiAgent = async () => {
    if (!taskInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=multi-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { description: taskInput, priority: priorityInput } })
      });
      const data = await res.json();
      setResults(prev => [{ type: 'multi-agent', ...data }, ...prev]);
    } catch (error) {
      console.error('Multi-agent execution failed:', error);
    }
    setLoading(false);
  };
  
  // Learning task
  const handleLearn = async () => {
    if (!taskInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { description: taskInput, type: 'general' } })
      });
      const data = await res.json();
      setResults(prev => [{ type: 'learn', ...data }, ...prev]);
    } catch (error) {
      console.error('Learning failed:', error);
    }
    setLoading(false);
  };
  
  // Utility optimization
  const handleUtility = async () => {
    if (!taskInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { description: taskInput, priority: priorityInput } })
      });
      const data = await res.json();
      setResults(prev => [{ type: 'utility', ...data }, ...prev]);
    } catch (error) {
      console.error('Utility optimization failed:', error);
    }
    setLoading(false);
  };
  
  // Set goal
  const handleSetGoal = async () => {
    if (!goalInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agents/orchestrate?action=goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalDescription: goalInput, priority: priorityInput })
      });
      const data = await res.json();
      
      if (data.success && data.goal) {
        // Execute the goal
        const execRes = await fetch('/api/ai-agents/orchestrate?action=goal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goalId: data.goal.id })
        });
        const execData = await execRes.json();
        setResults(prev => [{ type: 'goal', ...execData }, ...prev]);
      }
    } catch (error) {
      console.error('Goal execution failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
      <Head>
        <title>AI Agent Hub - GOAT Royalty App</title>
        <meta name="description" content="Advanced AI Agent Hub for GOAT Royalty App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🤖 AI Agent Hub
              </h1>
              <p className="text-gray-400 text-sm">Advanced AI Agent Control Center</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-gray-400">All Systems Online</span>
              </div>
              <a href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Back to App</a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Agent Type Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Select Agent Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'orchestrator', name: 'Orchestrator', level: 1, icon: '🎯', desc: 'Hierarchical Task Management' },
              { id: 'autonomous', name: 'Autonomous', level: 1, icon: '🚀', desc: 'Full Autonomy Agent' },
              { id: 'multi-agent', name: 'Multi-Agent', level: 1, icon: '👥', desc: 'Collaborative Agents' },
              { id: 'learning', name: 'Learning', level: 2, icon: '🧠', desc: 'Self-Improving Agent' },
              { id: 'utility', name: 'Utility-Based', level: 2, icon: '⚖️', desc: 'Optimal Path Selection' },
              { id: 'goal', name: 'Goal-Based', level: 2, icon: '🎯', desc: 'Multi-Step Planning' }
            ].map(agent => (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`p-4 rounded-xl border transition-all ${
                  activeAgent === agent.id 
                    ? 'bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'bg-gray-800/30 border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <div className="text-3xl mb-2">{agent.icon}</div>
                <div className="font-semibold text-sm">{agent.name}</div>
                <div className="text-xs text-gray-400 mt-1">Level {agent.level}</div>
                <div className="text-xs text-gray-500 mt-1">{agent.desc}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-gray-800/50 rounded-2xl border border-purple-500/30 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">
                {activeAgent === 'orchestrator' && '🎯'}
                {activeAgent === 'autonomous' && '🚀'}
                {activeAgent === 'multi-agent' && '👥'}
                {activeAgent === 'learning' && '🧠'}
                {activeAgent === 'utility' && '⚖️'}
                {activeAgent === 'goal' && '🎯'}
              </span>
              {activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)} Agent
            </h2>
            
            {/* Goal/Task Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {activeAgent === 'orchestrator' || activeAgent === 'autonomous' || activeAgent === 'goal' 
                  ? 'Goal Description' 
                  : 'Task Description'}
              </label>
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                rows={4}
                placeholder="Enter your goal or task..."
              />
            </div>
            
            {/* Priority Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <div className="flex gap-4">
                {['low', 'medium', 'high', 'urgent', 'critical'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityInput(p)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      priorityInput === p 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {activeAgent === 'orchestrator' && (
                <button
                  onClick={handleOrchestrate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Orchestrating...' : '🎯 Orchestrate Goal'}
                </button>
              )}
              
              {activeAgent === 'autonomous' && (
                <button
                  onClick={handleAutonomous}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Executing...' : '🚀 Execute Autonomously'}
                </button>
              )}
              
              {activeAgent === 'multi-agent' && (
                <button
                  onClick={handleMultiAgent}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Coordinating...' : '👥 Dispatch to Agents'}
                </button>
              )}
              
              {activeAgent === 'learning' && (
                <button
                  onClick={handleLearn}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Learning...' : '🧠 Execute & Learn'}
                </button>
              )}
              
              {activeAgent === 'utility' && (
                <button
                  onClick={handleUtility}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Optimizing...' : '⚖️ Optimize & Execute'}
                </button>
              )}
              
              {activeAgent === 'goal' && (
                <button
                  onClick={handleSetGoal}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Planning...' : '🎯 Set & Execute Goal'}
                </button>
              )}
            </div>
          </div>
          
          {/* Status Panel */}
          <div className="bg-gray-800/50 rounded-2xl border border-purple-500/30 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              📊 Agent Status
            </h2>
            
            {status ? (
              <div className="space-y-4">
                {/* Orchestrator Status */}
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-400 mb-2">🎯 Orchestrator</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Status: <span className="text-green-400">{status.orchestrator?.status || 'idle'}</span></div>
                    <div>Workers: <span className="text-blue-400">{status.orchestrator?.workers?.length || 0}</span></div>
                  </div>
                </div>
                
                {/* Autonomous Agent Status */}
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-400 mb-2">🚀 Autonomous Agent</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Status: <span className="text-green-400">{status.autonomousAgent?.status || 'idle'}</span></div>
                    <div>Tools: <span className="text-blue-400">{status.autonomousAgent?.toolsAvailable || 0}</span></div>
                  </div>
                </div>
                
                {/* Learning Agent Status */}
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-400 mb-2">🧠 Learning Agent</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Experiences: <span className="text-blue-400">{status.learningAgent?.totalExperiences || 0}</span></div>
                    <div>Exploration: <span className="text-blue-400">{((status.learningAgent?.explorationRate || 0) * 100).toFixed(1)}%</span></div>
                  </div>
                </div>
                
                {/* Goal Agent Status */}
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <h3 className="font-semibold text-red-400 mb-2">🎯 Goal Agent</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Active Goals: <span className="text-blue-400">{status.goalAgent?.activeGoals?.length || 0}</span></div>
                    <div>State Items: <span className="text-blue-400">{Object.keys(status.goalAgent?.currentState || {}).length}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">Loading status...</div>
            )}
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="mt-8 bg-gray-800/50 rounded-2xl border border-purple-500/30 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            📋 Execution Results
          </h2>
          
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-400 uppercase">
                      {result.type}
                    </span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              No results yet. Execute a task to see results here.
            </div>
          )}
        </div>
        
        {/* Agent Hierarchy Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🏗️ AI Agent Hierarchy (2026 Standard)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-xl p-4">
              <h3 className="font-bold text-green-400 mb-3">Level 1: Most Advanced</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>🎯 <strong>Hierarchical Orchestrator</strong> - Manages worker agents</li>
                <li>🚀 <strong>Autonomous Agents</strong> - Full self-governance</li>
                <li>👥 <strong>Multi-Agent Systems</strong> - Collaborative problem solving</li>
              </ul>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4">
              <h3 className="font-bold text-yellow-400 mb-3">Level 2: Moderately Advanced</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>🧠 <strong>Learning Agents</strong> - Improve from experience</li>
                <li>⚖️ <strong>Utility-Based Agents</strong> - Optimal path selection</li>
                <li>🎯 <strong>Goal-Based Agents</strong> - Multi-step planning</li>
              </ul>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4">
              <h3 className="font-bold text-gray-400 mb-3">Level 3: Basic</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>📊 <strong>Model-Based Reflex</strong> - Internal state tracking</li>
                <li>⚡ <strong>Simple Reflex</strong> - If-then rules</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-purple-500/30 bg-black/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>GOAT Royalty App - AI Agent Hub v2.0.0</p>
            <p className="mt-1">Powered by 6 AI Engines • 242 API Endpoints • Self-Healing System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}