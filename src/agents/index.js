/**
 * GOAT Royalty App - AI Agent Systems
 * 
 * Complete suite of AI agents from Most Advanced to Least Advanced:
 * 
 * 1. HIERARCHICAL ORCHESTRATOR (Most Advanced)
 *    - Supervisor/Worker architecture
 *    - CrewAI-style delegation
 *    - Complex goal decomposition
 * 
 * 2. MULTI-AGENT SYSTEM
 *    - Collaborative problem solving
 *    - Agent communication protocols
 *    - Consensus building
 * 
 * 3. AUTONOMOUS AGENT
 *    - Full autonomy with tool use
 *    - Memory and state management
 *    - Multi-step task execution
 * 
 * 4. LEARNING AGENT
 *    - Feedback-driven improvement
 *    - Experience-based learning
 *    - Skill progression
 * 
 * 5. UTILITY-BASED AGENT
 *    - Multi-criteria decision making
 *    - Cost-benefit analysis
 *    - Risk assessment
 * 
 * 6. GOAL-BASED AGENT
 *    - Multi-step planning
 *    - State management
 *    - Goal decomposition
 * 
 * 7. AGENTIC RAG SYSTEM
 *    - Intelligent retrieval
 *    - Hallucination detection
 *    - Verification and validation
 */

// Most Advanced: Autonomous & Collaborative
const { HierarchicalOrchestrator, WorkerAgent, WORKER_TYPES } = require('./HierarchicalOrchestrator');
const { MultiAgentOrchestrator, CollaborativeAgent, AgentMessage } = require('./MultiAgentSystem');
const AutonomousAgent = require('./AutonomousAgent');

// Moderately Advanced: Learning & Goal-Based
const { LearningAgent } = require('./LearningAgent');
const { UtilityBasedAgent } = require('./UtilityBasedAgent');
const { GoalBasedAgent } = require('./GoalBasedAgent');

// RAG System
const { AgenticRAGSystem } = require('./AgenticRAGSystem');

// Export all agents
module.exports = {
  // Most Advanced
  HierarchicalOrchestrator,
  WorkerAgent,
  WORKER_TYPES,
  MultiAgentOrchestrator,
  CollaborativeAgent,
  AgentMessage,
  AutonomousAgent,
  
  // Moderately Advanced
  LearningAgent,
  UtilityBasedAgent,
  GoalBasedAgent,
  
  // RAG
  AgenticRAGSystem,
  
  // Agent Factory for easy creation
  AgentFactory: {
    createHierarchicalOrchestrator: (config) => new HierarchicalOrchestrator(config),
    createMultiAgentSystem: (config) => new MultiAgentOrchestrator(config),
    createLearningAgent: (config) => new LearningAgent(config),
    createUtilityAgent: (config) => new UtilityBasedAgent(config),
    createGoalAgent: (config) => new GoalBasedAgent(config),
    createRAGSystem: (config) => new AgenticRAGSystem(config),
    
    // Create specialized worker
    createWorker: (type, config) => new WorkerAgent(type, config),
    
    // Create collaborative agent
    createCollaborativeAgent: (config) => new CollaborativeAgent(config)
  },
  
  // Agent Types enum
  AgentTypes: {
    HIERARCHICAL_ORCHESTRATOR: 'hierarchical_orchestrator',
    MULTI_AGENT_SYSTEM: 'multi_agent_system',
    AUTONOMOUS: 'autonomous',
    LEARNING: 'learning',
    UTILITY_BASED: 'utility_based',
    GOAL_BASED: 'goal_based',
    AGENTIC_RAG: 'agentic_rag'
  }
};