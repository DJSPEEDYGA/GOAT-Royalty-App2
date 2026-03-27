'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Brain,
  Network,
  Target,
  TrendingUp,
  MessageSquare,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Users,
  Layers,
  Search,
  Shield,
  Lightbulb,
  Settings,
  ChevronDown,
  ChevronRight,
  Send
} from 'lucide-react';

// Agent Types
interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  capabilities: string[];
  icon: React.ReactNode;
  color: string;
  level: 'advanced' | 'moderate' | 'basic';
}

interface Task {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  progress?: number;
}

// Agent Definitions
const AGENTS: Agent[] = [
  {
    id: 'hierarchical-orchestrator',
    name: 'Hierarchical Orchestrator',
    type: 'HierarchicalOrchestrator',
    description: 'Most Advanced - Supervisor/Worker architecture that decomposes complex goals into subtasks and delegates to specialized workers',
    status: 'idle',
    capabilities: ['Goal Decomposition', 'Worker Delegation', 'Workflow Coordination', 'Progress Tracking'],
    icon: <Layers className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    level: 'advanced'
  },
  {
    id: 'multi-agent-system',
    name: 'Multi-Agent System',
    type: 'MultiAgentOrchestrator',
    description: 'Multiple specialized agents working collaboratively or competitively to solve large-scale problems',
    status: 'idle',
    capabilities: ['Agent Communication', 'Consensus Building', 'Peer Review', 'Shared Memory'],
    icon: <Network className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    level: 'advanced'
  },
  {
    id: 'autonomous-agent',
    name: 'Autonomous Agent',
    type: 'AutonomousAgent',
    description: 'Full autonomy with tool use, memory management, and multi-step task execution',
    status: 'idle',
    capabilities: ['Tool Use', 'Memory System', 'Decision Making', 'Self-Healing'],
    icon: <Bot className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    level: 'advanced'
  },
  {
    id: 'learning-agent',
    name: 'Learning Agent',
    type: 'LearningAgent',
    description: 'Improves performance over time by analyzing feedback and updating internal models',
    status: 'idle',
    capabilities: ['Feedback Learning', 'Skill Progression', 'Experience Buffer', 'Model Adaptation'],
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-orange-500 to-amber-600',
    level: 'moderate'
  },
  {
    id: 'utility-agent',
    name: 'Utility-Based Agent',
    type: 'UtilityBasedAgent',
    description: 'Uses utility functions to evaluate and select optimal paths, weighing cost, risk, and speed',
    status: 'idle',
    capabilities: ['Cost-Benefit Analysis', 'Risk Assessment', 'Decision Optimization', 'Trade-off Analysis'],
    icon: <Target className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    level: 'moderate'
  },
  {
    id: 'goal-agent',
    name: 'Goal-Based Agent',
    type: 'GoalBasedAgent',
    description: 'Plans multi-step actions to achieve specific objectives using various planning strategies',
    status: 'idle',
    capabilities: ['Goal Planning', 'State Management', 'Plan Execution', 'Recovery Handling'],
    icon: <Target className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-600',
    level: 'moderate'
  },
  {
    id: 'agentic-rag',
    name: 'Agentic RAG System',
    type: 'AgenticRAGSystem',
    description: 'Intelligent retrieval system that decides what to retrieve and verifies information to eliminate hallucinations',
    status: 'idle',
    capabilities: ['Smart Retrieval', 'Verification', 'Hallucination Detection', 'Multi-Source Integration'],
    icon: <Search className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    level: 'advanced'
  }
];

// Worker Types for Orchestrator
const WORKER_TYPES = [
  { id: 'coder', name: 'Coder', description: 'Software development and coding tasks' },
  { id: 'analyst', name: 'Analyst', description: 'Data analysis and insights generation' },
  { id: 'researcher', name: 'Researcher', description: 'Information gathering and research' },
  { id: 'finance', name: 'Finance', description: 'Financial operations and calculations' },
  { id: 'legal', name: 'Legal', description: 'Contract review and compliance' },
  { id: 'marketer', name: 'Marketer', description: 'Marketing and promotional strategies' }
];

export default function AIAgentHub() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    advanced: true,
    moderate: false,
    basic: false
  });
  const [agentLogs, setAgentLogs] = useState<Record<string, string[]>>({});

  // Group agents by level
  const agentsByLevel = {
    advanced: AGENTS.filter(a => a.level === 'advanced'),
    moderate: AGENTS.filter(a => a.level === 'moderate'),
    basic: AGENTS.filter(a => a.level === 'basic')
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const executeAgentTask = async (agent: Agent, query: string) => {
    setIsProcessing(true);
    const taskId = `task-${Date.now()}`;
    
    const newTask: Task = {
      id: taskId,
      agentId: agent.id,
      description: query,
      status: 'running',
      progress: 0
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Simulate agent execution
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Starting ${agent.name}...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Analyzing query: "${query}"`);
    setAgentLogs(prev => ({ ...prev, [taskId]: logs }));

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, progress: i } : t
      ));
      
      const newLogs = [...logs];
      if (i === 20) newLogs.push(`[${new Date().toLocaleTimeString()}] Processing with ${agent.capabilities[0]}...`);
      if (i === 40) newLogs.push(`[${new Date().toLocaleTimeString()}] Applying ${agent.capabilities[1]}...`);
      if (i === 60) newLogs.push(`[${new Date().toLocaleTimeString()}] Executing ${agent.capabilities[2]}...`);
      if (i === 80) newLogs.push(`[${new Date().toLocaleTimeString()}] Finalizing results...`);
      
      setAgentLogs(prev => ({ ...prev, [taskId]: newLogs }));
    }

    // Complete task
    logs.push(`[${new Date().toLocaleTimeString()}] Task completed successfully!`);
    setAgentLogs(prev => ({ ...prev, [taskId]: logs }));

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        status: 'completed', 
        progress: 100,
        result: `Successfully processed: "${query}" using ${agent.name}. All capabilities utilized.`
      } : t
    ));

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgent && inputQuery.trim()) {
      executeAgentTask(selectedAgent, inputQuery);
      setInputQuery('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'running': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Agent Hub
          </h1>
        </div>
        <p className="text-gray-400">
          Complete suite of AI agents from Most Advanced to Least Advanced, ready for music royalty management
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Available Agents
          </h2>

          {/* Advanced Agents */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Most Advanced</span>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                  {agentsByLevel.advanced.length}
                </span>
              </div>
              {expandedSections.advanced ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            {expandedSections.advanced && (
              <div className="p-2 space-y-2">
                {agentsByLevel.advanced.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedAgent?.id === agent.id 
                        ? 'bg-gradient-to-r ' + agent.color + ' text-white' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-400 truncate">{agent.capabilities[0]}</div>
                      </div>
                      {getStatusIcon(agent.status)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Moderate Agents */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('moderate')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Moderately Advanced</span>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                  {agentsByLevel.moderate.length}
                </span>
              </div>
              {expandedSections.moderate ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            {expandedSections.moderate && (
              <div className="p-2 space-y-2">
                {agentsByLevel.moderate.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedAgent?.id === agent.id 
                        ? 'bg-gradient-to-r ' + agent.color + ' text-white' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-400 truncate">{agent.capabilities[0]}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Agent Details & Interaction */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Info Card */}
              <div className={`bg-gradient-to-r ${selectedAgent.color} p-6 rounded-2xl`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {selectedAgent.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{selectedAgent.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedAgent.capabilities.map((cap, i) => (
                        <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Query Input */}
              <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={`Ask ${selectedAgent.name} to do something...`}
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    disabled={isProcessing}
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !inputQuery.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Worker Types (for Hierarchical Orchestrator) */}
              {selectedAgent.id === 'hierarchical-orchestrator' && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Available Workers
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {WORKER_TYPES.map(worker => (
                      <div key={worker.id} className="p-3 bg-gray-700/30 rounded-lg">
                        <div className="font-medium text-sm">{worker.name}</div>
                        <div className="text-xs text-gray-400">{worker.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Results */}
              {tasks.filter(t => t.agentId === selectedAgent.id).length > 0 && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h4 className="font-medium mb-3">Task Results</h4>
                  <div className="space-y-3">
                    {tasks.filter(t => t.agentId === selectedAgent.id).slice(-3).reverse().map(task => (
                      <div key={task.id} className="p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">{task.description}</span>
                          {getStatusIcon(task.status)}
                        </div>
                        
                        {/* Progress Bar */}
                        {task.status === 'running' && (
                          <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        )}
                        
                        {/* Logs */}
                        {agentLogs[task.id] && (
                          <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono text-gray-400 max-h-32 overflow-y-auto">
                            {agentLogs[task.id].map((log, i) => (
                              <div key={i}>{log}</div>
                            ))}
                          </div>
                        )}
                        
                        {/* Result */}
                        {task.result && (
                          <div className="mt-2 text-sm text-green-400">
                            {task.result}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700 text-center">
              <Brain className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Select an Agent</h3>
              <p className="text-gray-500">
                Choose an AI agent from the left panel to view its capabilities and interact with it
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{AGENTS.length}</div>
          <div className="text-sm text-gray-400">AI Agents</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="text-sm text-gray-400">Tasks Completed</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{WORKER_TYPES.length}</div>
          <div className="text-sm text-gray-400">Worker Types</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-2xl font-bold text-pink-400">242</div>
          <div className="text-sm text-gray-400">API Endpoints</div>
        </div>
      </div>
    </div>
  );
}