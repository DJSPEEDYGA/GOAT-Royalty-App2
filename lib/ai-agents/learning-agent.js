/**
 * Learning Agent for GOAT Royalty App
 * Level 2: Learning & Goal-Based Systems
 * Improves performance over time by analyzing feedback and experience
 */

class LearningAgent {
  constructor(config = {}) {
    this.name = config.name || 'GOAT-Learning-Agent';
    this.version = '2.0.0';
    
    // Learning systems
    this.experienceBuffer = new ExperienceBuffer();
    this.modelManager = new ModelManager();
    this.feedbackProcessor = new FeedbackProcessor();
    this.performanceTracker = new PerformanceTracker();
    
    // Learning parameters
    this.learningRate = config.learningRate || 0.1;
    this.discountFactor = config.discountFactor || 0.95;
    this.explorationRate = config.explorationRate || 0.2;
    
    // State
    this.currentModel = null;
    this.trainingQueue = [];
    this.isTraining = false;
    
    // Initialize
    this.initialize();
  }

  /**
   * Initialize the learning agent
   */
  async initialize() {
    // Load existing model if available
    this.currentModel = await this.modelManager.loadModel('default');
    
    // Start background training loop
    this.startTrainingLoop();
  }

  /**
   * Execute a task and learn from the result
   */
  async execute(task) {
    console.log(`[LearningAgent] Executing task: ${task.description}`);
    
    // Get current state representation
    const state = this.encodeState(task);
    
    // Select action using current policy
    const action = await this.selectAction(state);
    
    // Execute action
    const result = await this.performAction(action, task);
    
    // Get feedback
    const feedback = await this.collectFeedback(result, task);
    
    // Store experience
    this.experienceBuffer.store({
      state,
      action,
      result,
      feedback,
      timestamp: new Date().toISOString()
    });
    
    // Learn from experience
    await this.learn(state, action, feedback, result);
    
    // Track performance
    this.performanceTracker.record({
      task,
      action,
      result,
      feedback,
      success: feedback.reward > 0
    });
    
    return {
      task: task.description,
      action,
      result,
      feedback,
      performanceScore: feedback.reward,
      learned: true
    };
  }

  /**
   * Select action using exploration/exploitation
   */
  async selectAction(state) {
    // Epsilon-greedy exploration
    if (Math.random() < this.explorationRate) {
      // Explore: random action
      return this.getRandomAction();
    } else {
      // Exploit: use learned policy
      return await this.currentModel.predict(state);
    }
  }

  /**
   * Learn from experience
   */
  async learn(state, action, feedback, result) {
    // Calculate target value
    const currentValue = await this.currentModel.evaluate(state, action);
    const targetValue = feedback.reward + this.discountFactor * this.getMaxNextValue(result.nextState);
    
    // Update model
    const loss = Math.pow(targetValue - currentValue, 2);
    await this.currentModel.update(state, action, targetValue, this.learningRate);
    
    // Add to training queue
    this.trainingQueue.push({
      state,
      action,
      target: targetValue,
      loss
    });
    
    // Track learning progress
    this.performanceTracker.recordLearning({
      loss,
      learningRate: this.learningRate,
      timestamp: new Date().toISOString()
    });
    
    // Decay exploration rate
    this.explorationRate = Math.max(0.01, this.explorationRate * 0.999);
    
    return { loss, targetValue, currentValue };
  }

  /**
   * Batch learning from experience buffer
   */
  async batchLearn(batchSize = 32) {
    if (this.experienceBuffer.size() < batchSize) {
      return null;
    }
    
    // Sample from experience buffer
    const batch = this.experienceBuffer.sample(batchSize);
    
    let totalLoss = 0;
    
    for (const experience of batch) {
      const { state, action, feedback, result } = experience;
      const learnResult = await this.learn(state, action, feedback, result);
      totalLoss += learnResult.loss;
    }
    
    const avgLoss = totalLoss / batchSize;
    
    // Save model checkpoint
    await this.modelManager.saveModel(this.currentModel, `checkpoint-${Date.now()}`);
    
    return {
      batchSize,
      averageLoss: avgLoss,
      explorationRate: this.explorationRate
    };
  }

  /**
   * Process human feedback
   */
  async processHumanFeedback(taskId, feedback) {
    // Get the original experience
    const experience = this.experienceBuffer.getById(taskId);
    
    if (!experience) {
      throw new Error(`Experience ${taskId} not found`);
    }
    
    // Process feedback
    const processedFeedback = this.feedbackProcessor.processHumanFeedback(feedback);
    
    // Re-learn with corrected feedback
    await this.learn(experience.state, experience.action, processedFeedback, experience.result);
    
    // Mark as human-corrected
    experience.humanCorrected = true;
    experience.correctedFeedback = processedFeedback;
    
    return {
      taskId,
      originalFeedback: experience.feedback,
      correctedFeedback: processedFeedback,
      learned: true
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceTracker.getMetrics();
  }

  /**
   * Get learning progress
   */
  getLearningProgress() {
    return {
      totalExperiences: this.experienceBuffer.size(),
      explorationRate: this.explorationRate,
      learningRate: this.learningRate,
      performanceMetrics: this.getPerformanceMetrics(),
      trainingQueueSize: this.trainingQueue.length
    };
  }

  // Helper methods
  encodeState(task) {
    // Convert task to state vector
    return {
      type: task.type || 'general',
      complexity: this.calculateComplexity(task),
      priority: task.priority || 'medium',
      context: task.context || {},
      encodedAt: new Date().toISOString()
    };
  }

  calculateComplexity(task) {
    return task.description.split(' ').length / 10;
  }

  getRandomAction() {
    const actions = [
      'analyze_royalties',
      'update_catalog',
      'distribute_content',
      'generate_report',
      'process_payments',
      'check_compliance',
      'optimize_workflow'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  async performAction(action, task) {
    // Execute the action
    return {
      action,
      output: `Executed ${action} for ${task.description}`,
      success: true,
      nextState: {},
      timestamp: new Date().toISOString()
    };
  }

  async collectFeedback(result, task) {
    // Calculate reward based on result
    let reward = 0;
    
    if (result.success) {
      reward += 1;
    }
    
    if (result.executionTime && result.executionTime < 5000) {
      reward += 0.5; // Bonus for fast execution
    }
    
    if (result.error) {
      reward -= 0.5;
    }
    
    return {
      reward,
      success: result.success,
      executionTime: result.executionTime,
      collectedAt: new Date().toISOString()
    };
  }

  getMaxNextValue(nextState) {
    // Estimate maximum value for next state
    return 1.0; // Simplified
  }

  startTrainingLoop() {
    // Periodic batch training
    setInterval(async () => {
      if (!this.isTraining && this.experienceBuffer.size() >= 32) {
        this.isTraining = true;
        try {
          await this.batchLearn(32);
        } catch (error) {
          console.error('[LearningAgent] Training error:', error);
        }
        this.isTraining = false;
      }
    }, 60000); // Every minute
  }
}

/**
 * Experience Buffer for storing learning experiences
 */
class ExperienceBuffer {
  constructor(maxSize = 10000) {
    this.buffer = [];
    this.maxSize = maxSize;
    this.index = 0;
  }

  store(experience) {
    if (this.buffer.length < this.maxSize) {
      this.buffer.push(experience);
    } else {
      this.buffer[this.index] = experience;
      this.index = (this.index + 1) % this.maxSize;
    }
    return experience;
  }

  sample(batchSize) {
    const sample = [];
    for (let i = 0; i < batchSize && i < this.buffer.length; i++) {
      const idx = Math.floor(Math.random() * this.buffer.length);
      sample.push(this.buffer[idx]);
    }
    return sample;
  }

  getById(id) {
    return this.buffer.find(e => e.id === id);
  }

  size() {
    return this.buffer.length;
  }

  clear() {
    this.buffer = [];
    this.index = 0;
  }
}

/**
 * Model Manager for saving/loading models
 */
class ModelManager {
  constructor() {
    this.models = new Map();
    this.checkpoints = [];
  }

  async loadModel(name) {
    if (this.models.has(name)) {
      return this.models.get(name);
    }
    
    // Create default model
    const model = new LearningModel(name);
    this.models.set(name, model);
    return model;
  }

  async saveModel(model, name) {
    this.models.set(name, model);
    this.checkpoints.push({
      name,
      savedAt: new Date().toISOString()
    });
  }
}

/**
 * Learning Model (simplified neural network representation)
 */
class LearningModel {
  constructor(name) {
    this.name = name;
    this.weights = new Map();
    this.bias = 0;
    this.createdAt = new Date().toISOString();
  }

  async predict(state) {
    // Simplified prediction
    const stateHash = JSON.stringify(state);
    if (this.weights.has(stateHash)) {
      return this.weights.get(stateHash);
    }
    return 'default_action';
  }

  async evaluate(state, action) {
    // Calculate value
    const stateHash = JSON.stringify({ state, action });
    return this.weights.get(stateHash) || 0;
  }

  async update(state, action, target, learningRate) {
    const stateHash = JSON.stringify({ state, action });
    const current = this.weights.get(stateHash) || 0;
    this.weights.set(stateHash, current + learningRate * (target - current));
  }
}

/**
 * Feedback Processor
 */
class FeedbackProcessor {
  constructor() {
    this.feedbackHistory = [];
  }

  processHumanFeedback(feedback) {
    const processed = {
      reward: feedback.rating ? feedback.rating / 5 : 0,
      correction: feedback.correction || null,
      processedAt: new Date().toISOString()
    };
    
    this.feedbackHistory.push({
      original: feedback,
      processed,
      timestamp: new Date().toISOString()
    });
    
    return processed;
  }

  getHistory() {
    return this.feedbackHistory;
  }
}

/**
 * Performance Tracker
 */
class PerformanceTracker {
  constructor() {
    this.metrics = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      averageReward: 0,
      learningLoss: []
    };
    this.history = [];
  }

  record(entry) {
    this.metrics.totalTasks++;
    if (entry.success) {
      this.metrics.successfulTasks++;
    } else {
      this.metrics.failedTasks++;
    }
    
    this.history.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
    
    // Update average reward
    this.metrics.averageReward = this.history.reduce((sum, h) => sum + (h.feedback?.reward || 0), 0) / this.history.length;
  }

  recordLearning(entry) {
    this.metrics.learningLoss.push(entry.loss);
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalTasks > 0 ? 
        this.metrics.successfulTasks / this.metrics.totalTasks : 0,
      recentHistory: this.history.slice(-10)
    };
  }
}

module.exports = {
  LearningAgent,
  ExperienceBuffer,
  ModelManager,
  FeedbackProcessor,
  PerformanceTracker
};