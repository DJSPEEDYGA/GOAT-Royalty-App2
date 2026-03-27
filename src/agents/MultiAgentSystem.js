/**
 * Multi-Agent System for Collaborative Problem Solving
 * 
 * Multiple specialized agents work collaboratively or competitively
 * in a shared environment to solve large-scale problems.
 * 
 * Features:
 * - Agent communication protocols
 * - Shared memory and context
 * - Consensus building
 * - Competitive evaluation
 */

const EventEmitter = require('events');
const crypto = require('crypto');

// Agent communication protocol (MCP-like)
const PROTOCOL_VERSION = '1.0';

class AgentMessage {
  constructor(from, to, type, payload) {
    this.id = crypto.randomUUID();
    this.from = from;
    this.to = to; // 'broadcast' for all agents
    this.type = type; // 'request', 'response', 'notify', 'vote', 'consensus'
    this.payload = payload;
    this.timestamp = new Date();
    this.protocol = PROTOCOL_VERSION;
  }
}

class CollaborativeAgent extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.id = crypto.randomUUID();
    this.name = config.name || `Agent-${this.id.slice(0, 8)}`;
    this.role = config.role || 'general';
    this.expertise = config.expertise || [];
    this.personality = config.personality || 'helpful';
    
    // Memory systems
    this.localMemory = {
      shortTerm: [],
      longTerm: new Map(),
      workingMemory: null
    };
    
    // State
    this.status = 'idle';
    this.currentTask = null;
    this.confidence = 0;
    
    // Communication
    this.messageQueue = [];
    this.collaborators = new Map();
    
    // Specialized tools
    this.tools = config.tools || [];
  }

  /**
   * Process incoming message
   */
  async receiveMessage(message) {
    this.messageQueue.push(message);
    this.emit('message:received', { agent: this.name, message });
    
    switch (message.type) {
      case 'request':
        return await this.handleRequest(message);
      case 'vote':
        return await this.handleVote(message);
      case 'consensus':
        return await this.handleConsensus(message);
      case 'notify':
        return await this.handleNotification(message);
      default:
        return { status: 'acknowledged' };
    }
  }

  /**
   * Handle collaboration request
   */
  async handleRequest(message) {
    const { task, context } = message.payload;
    
    this.status = 'processing';
    this.currentTask = task;
    
    try {
      // Process with specialized knowledge
      const result = await this.processTask(task, context);
      
      // Update memory
      this.localMemory.shortTerm.push({
        task,
        result,
        timestamp: new Date()
      });
      
      this.status = 'completed';
      this.confidence = result.confidence || 0.8;
      
      return {
        agentId: this.id,
        agentName: this.name,
        role: this.role,
        result,
        confidence: this.confidence
      };
    } catch (error) {
      this.status = 'failed';
      return {
        agentId: this.id,
        error: error.message,
        confidence: 0
      };
    }
  }

  /**
   * Process task based on specialization
   */
  async processTask(task, context) {
    // Default processing - override in specialized agents
    return {
      output: `Processed by ${this.name}`,
      insights: [],
      confidence: 0.75
    };
  }

  /**
   * Handle voting request
   */
  async handleVote(message) {
    const { proposal, options } = message.payload;
    
    // Make decision based on expertise and analysis
    const vote = await this.analyzeAndVote(proposal, options);
    
    return {
      agentId: this.id,
      vote,
      reasoning: vote.reasoning
    };
  }

  async analyzeAndVote(proposal, options) {
    // Default: random choice with confidence
    const choice = options[Math.floor(Math.random() * options.length)];
    return {
      choice,
      confidence: 0.5,
      reasoning: 'Default analysis'
    };
  }

  /**
   * Handle consensus request
   */
  async handleConsensus(message) {
    const { topic, proposals } = message.payload;
    
    // Evaluate each proposal
    const evaluations = await Promise.all(
      proposals.map(async (p) => ({
        proposal: p,
        score: await this.evaluateProposal(p),
        agentId: this.id
      }))
    );
    
    return {
      agentId: this.id,
      evaluations,
      preferredProposal: evaluations.sort((a, b) => b.score - a.score)[0]
    };
  }

  async evaluateProposal(proposal) {
    // Score from 0 to 1
    return 0.5 + (Math.random() * 0.5);
  }

  /**
   * Handle notification
   */
  async handleNotification(message) {
    // Store in memory for context
    this.localMemory.longTerm.set(message.id, message);
    return { acknowledged: true };
  }

  /**
   * Send message to another agent or broadcast
   */
  sendMessage(to, type, payload) {
    const message = new AgentMessage(this.id, to, type, payload);
    this.emit('message:sent', { agent: this.name, message });
    return message;
  }
}

/**
 * Multi-Agent Orchestrator
 * Manages agent collaboration and communication
 */
class MultiAgentOrchestrator extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      maxAgents: config.maxAgents || 10,
      consensusThreshold: config.consensusThreshold || 0.7,
      messageTimeout: config.messageTimeout || 30000,
      ...config
    };
    
    // Agent registry
    this.agents = new Map();
    
    // Shared memory
    this.sharedMemory = {
      context: {},
      knowledge: new Map(),
      conversations: [],
      decisions: []
    };
    
    // Communication bus
    this.messageBus = [];
    
    // Task management
    this.activeTasks = new Map();
  }

  /**
   * Register an agent
   */
  registerAgent(agent) {
    if (this.agents.size >= this.config.maxAgents) {
      throw new Error('Maximum agents limit reached');
    }
    
    this.agents.set(agent.id, agent);
    
    // Set up event forwarding
    agent.on('message:sent', (data) => {
      this.routeMessage(data.message);
    });
    
    this.emit('agent:registered', { 
      agentId: agent.id, 
      name: agent.name, 
      role: agent.role 
    });
    
    return agent.id;
  }

  /**
   * Create specialized agent
   */
  createAgent(config) {
    const agent = new CollaborativeAgent(config);
    this.registerAgent(agent);
    return agent;
  }

  /**
   * Route message to destination
   */
  async routeMessage(message) {
    this.messageBus.push(message);
    
    if (message.to === 'broadcast') {
      // Send to all agents except sender
      const responses = [];
      for (const [id, agent] of this.agents) {
        if (id !== message.from) {
          responses.push(await agent.receiveMessage(message));
        }
      }
      return responses;
    } else {
      // Send to specific agent
      const targetAgent = this.agents.get(message.to);
      if (targetAgent) {
        return await targetAgent.receiveMessage(message);
      }
    }
  }

  /**
   * Collaborative task execution
   */
  async executeCollaborativeTask(task, options = {}) {
    const taskId = crypto.randomUUID();
    
    this.emit('task:started', { taskId, task });
    
    // Phase 1: Decompose task
    const subtasks = await this.decomposeTask(task);
    
    // Phase 2: Assign to best-suited agents
    const assignments = this.assignSubtasks(subtasks);
    
    // Phase 3: Execute in parallel
    const results = await this.executeAssignments(taskId, assignments);
    
    // Phase 4: Synthesize results
    const synthesized = await this.synthesizeResults(results);
    
    // Phase 5: Peer review (optional)
    let reviewed = synthesized;
    if (options.peerReview) {
      reviewed = await this.peerReview(synthesized);
    }
    
    this.emit('task:completed', { taskId, result: reviewed });
    
    return reviewed;
  }

  /**
   * Decompose complex task into subtasks
   */
  async decomposeTask(task) {
    const subtasks = [];
    
    // Analyze task requirements
    const requirements = this.analyzeRequirements(task);
    
    // Create subtasks for each requirement
    requirements.forEach((req, index) => {
      subtasks.push({
        id: `subtask-${index}`,
        description: req.description,
        requiredExpertise: req.expertise,
        priority: req.priority,
        dependencies: req.dependencies || []
      });
    });
    
    return subtasks;
  }

  analyzeRequirements(task) {
    // Default analysis - can be enhanced with AI
    return [{
      description: task.description || task,
      expertise: ['general'],
      priority: 1
    }];
  }

  /**
   * Assign subtasks to best-suited agents
   */
  assignSubtasks(subtasks) {
    const assignments = [];
    
    for (const subtask of subtasks) {
      const bestAgent = this.findBestAgent(subtask.requiredExpertise);
      
      if (bestAgent) {
        assignments.push({
          subtask,
          agent: bestAgent,
          assignedAt: new Date()
        });
      }
    }
    
    return assignments;
  }

  findBestAgent(requiredExpertise) {
    let bestAgent = null;
    let bestScore = 0;
    
    for (const agent of this.agents.values()) {
      const score = this.calculateExpertiseMatch(agent, requiredExpertise);
      if (score > bestScore && agent.status === 'idle') {
        bestScore = score;
        bestAgent = agent;
      }
    }
    
    return bestAgent;
  }

  calculateExpertiseMatch(agent, requiredExpertise) {
    const agentExpertise = new Set(agent.expertise);
    const required = new Set(requiredExpertise);
    
    let matchCount = 0;
    for (const exp of required) {
      if (agentExpertise.has(exp)) matchCount++;
    }
    
    return matchCount / required.size;
  }

  /**
   * Execute assignments in parallel
   */
  async executeAssignments(taskId, assignments) {
    this.activeTasks.set(taskId, { assignments, status: 'running' });
    
    const results = await Promise.all(
      assignments.map(async (assignment) => {
        const message = new AgentMessage(
          'orchestrator',
          assignment.agent.id,
          'request',
          { task: assignment.subtask, context: this.sharedMemory.context }
        );
        
        const result = await assignment.agent.receiveMessage(message);
        
        // Update shared memory
        this.sharedMemory.knowledge.set(assignment.subtask.id, result);
        
        return {
          subtask: assignment.subtask,
          agent: assignment.agent.name,
          result
        };
      })
    );
    
    this.activeTasks.delete(taskId);
    return results;
  }

  /**
   * Synthesize results from multiple agents
   */
  async synthesizeResults(results) {
    // Combine all outputs
    const combinedOutput = results.map(r => ({
      agent: r.agent,
      output: r.result?.result?.output || r.result?.result || 'No output'
    }));
    
    // Calculate average confidence
    const avgConfidence = results.reduce((sum, r) => {
      return sum + (r.result?.confidence || 0.5);
    }, 0) / results.length;
    
    return {
      success: true,
      combinedOutput,
      confidence: avgConfidence,
      agentCount: results.length,
      timestamp: new Date()
    };
  }

  /**
   * Peer review process
   */
  async peerReview(result) {
    // Select reviewers (agents not involved in original task)
    const reviewers = Array.from(this.agents.values())
      .filter(a => !result.combinedOutput.some(o => o.agent === a.name))
      .slice(0, 3);
    
    if (reviewers.length === 0) return result;
    
    // Request reviews
    const reviews = await Promise.all(
      reviewers.map(async (reviewer) => {
        const message = new AgentMessage(
          'orchestrator',
          reviewer.id,
          'request',
          { task: { description: 'Review and validate results' }, context: result }
        );
        
        return await reviewer.receiveMessage(message);
      })
    );
    
    // Calculate review score
    const reviewScore = reviews.reduce((sum, r) => {
      return sum + (r?.result?.confidence || 0.5);
    }, 0) / reviews.length;
    
    return {
      ...result,
      peerReviewed: true,
      reviewScore,
      reviews: reviews.map(r => r?.result)
    };
  }

  /**
   * Consensus building among agents
   */
  async buildConsensus(topic, options) {
    const message = new AgentMessage(
      'orchestrator',
      'broadcast',
      'consensus',
      { topic, proposals: options }
    );
    
    const responses = await this.routeMessage(message);
    
    // Aggregate votes
    const voteCounts = {};
    options.forEach(opt => voteCounts[opt] = 0);
    
    responses.forEach(response => {
      const preferred = response?.evaluations?.[0]?.proposal || response?.vote?.choice;
      if (preferred && voteCounts[preferred] !== undefined) {
        voteCounts[preferred]++;
      }
    });
    
    // Find consensus
    const totalVotes = this.agents.size;
    const consensus = Object.entries(voteCounts)
      .filter(([_, count]) => count / totalVotes >= this.config.consensusThreshold)
      .map(([option]) => option);
    
    // Store decision
    const decision = {
      topic,
      options,
      votes: voteCounts,
      consensus,
      timestamp: new Date()
    };
    
    this.sharedMemory.decisions.push(decision);
    
    return decision;
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      agentCount: this.agents.size,
      agents: Array.from(this.agents.values()).map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        status: a.status,
        expertise: a.expertise
      })),
      sharedMemorySize: this.sharedMemory.knowledge.size,
      messageBusLength: this.messageBus.length,
      activeTaskCount: this.activeTasks.size
    };
  }
}

module.exports = {
  MultiAgentOrchestrator,
  CollaborativeAgent,
  AgentMessage
};