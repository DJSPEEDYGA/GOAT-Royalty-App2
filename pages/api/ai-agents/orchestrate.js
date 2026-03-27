/**
 * AI Agent Orchestration API
 * Exposes all AI agent capabilities through REST endpoints
 */

import OrchestratorAgent from '../../../lib/ai-agents/orchestrator-agent';
import AutonomousAgent from '../../../lib/ai-agents/autonomous-agent';
import { MultiAgentSystem } from '../../../lib/ai-agents/multi-agent-system';
import LearningAgent from '../../../lib/ai-agents/learning-agent';
import { UtilityBasedAgent, GoalBasedAgent } from '../../../lib/ai-agents/utility-goal-agents';

// Initialize agents
const orchestrator = new OrchestratorAgent();
const autonomousAgent = new AutonomousAgent();
const multiAgentSystem = new MultiAgentSystem();
const learningAgent = new LearningAgent();
const utilityAgent = new UtilityBasedAgent();
const goalAgent = new GoalBasedAgent();

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;

  try {
    switch (action) {
      case 'orchestrate':
        return await handleOrchestrate(req, res);
      case 'autonomous':
        return await handleAutonomous(req, res);
      case 'multi-agent':
        return await handleMultiAgent(req, res);
      case 'learn':
        return await handleLearn(req, res);
      case 'utility':
        return await handleUtility(req, res);
      case 'goal':
        return await handleGoal(req, res);
      case 'status':
        return await handleStatus(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('[AI-Agents API] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle orchestration requests
 */
async function handleOrchestrate(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, context } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  const result = await orchestrator.orchestrate(goal, context || {});
  
  return res.status(200).json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle autonomous agent requests
 */
async function handleAutonomous(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, context } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  const result = await autonomousAgent.execute(goal, context || {});
  
  return res.status(200).json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle multi-agent system requests
 */
async function handleMultiAgent(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const result = await multiAgentSystem.executeComplexTask(task);
  
  return res.status(200).json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle learning agent requests
 */
async function handleLearn(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task, feedback } = req.body;

  if (feedback) {
    // Process human feedback
    const result = await learningAgent.processHumanFeedback(task.id, feedback);
    return res.status(200).json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  }

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const result = await learningAgent.execute(task);
  
  return res.status(200).json({
    success: true,
    result,
    progress: learningAgent.getLearningProgress(),
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle utility-based agent requests
 */
async function handleUtility(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const result = await utilityAgent.execute(task);
  
  return res.status(200).json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle goal-based agent requests
 */
async function handleGoal(req, res) {
  const { method } = req;
  
  if (method === 'POST') {
    const { goalDescription, priority, deadline } = req.body;
    
    if (!goalDescription) {
      return res.status(400).json({ error: 'Goal description is required' });
    }
    
    const goal = await goalAgent.setGoal(goalDescription, priority, deadline);
    
    return res.status(200).json({
      success: true,
      goal,
      timestamp: new Date().toISOString()
    });
  }
  
  if (method === 'PUT') {
    const { goalId } = req.body;
    
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }
    
    const result = await goalAgent.executeGoal(goalId);
    
    return res.status(200).json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  }
  
  if (method === 'GET') {
    const { goalId } = req.query;
    
    if (goalId) {
      const status = goalAgent.getGoalStatus(goalId);
      return res.status(200).json({ status });
    }
    
    const activeGoals = goalAgent.getActiveGoals();
    return res.status(200).json({ activeGoals });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Handle status requests
 */
async function handleStatus(req, res) {
  const status = {
    orchestrator: orchestrator.getStatus(),
    autonomousAgent: autonomousAgent.getStatus(),
    multiAgentSystem: {
      agentsCount: multiAgentSystem.agents.size,
      taskQueueLength: multiAgentSystem.taskQueue.length
    },
    learningAgent: learningAgent.getLearningProgress(),
    utilityAgent: {
      actionsCount: utilityAgent.actions.size,
      decisionHistory: utilityAgent.getDecisionHistory(5)
    },
    goalAgent: {
      activeGoals: goalAgent.getActiveGoals(),
      currentState: goalAgent.currentState
    },
    timestamp: new Date().toISOString()
  };
  
  return res.status(200).json(status);
}