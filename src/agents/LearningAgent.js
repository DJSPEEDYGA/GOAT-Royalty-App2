/**
 * Learning Agent System
 * 
 * These systems improve performance over time by analyzing feedback
 * and experience, updating their internal models based on successes
 * and failures.
 * 
 * Features:
 * - Feedback collection and analysis
 * - Performance tracking
 * - Model adaptation
 * - Experience-based learning
 * - Continuous improvement
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class LearningAgent extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      learningRate: config.learningRate || 0.1,
      experienceBufferSize: config.experienceBufferSize || 1000,
      modelUpdateInterval: config.modelUpdateInterval || 3600000, // 1 hour
      minExperiencesForUpdate: config.minExperiencesForUpdate || 10,
      persistencePath: config.persistencePath || './data/learning-agent',
      ...config
    };
    
    // Experience buffer
    this.experiences = [];
    
    // Performance metrics
    this.metrics = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      averageExecutionTime: 0,
      averageConfidence: 0,
      improvementRate: 0
    };
    
    // Learning model (simplified neural-like weights)
    this.model = {
      weights: new Map(),
      biases: new Map(),
      lastUpdated: new Date(),
      version: 1
    };
    
    // Feedback history
    this.feedbackHistory = [];
    
    // Knowledge base (learned patterns)
    this.knowledgeBase = new Map();
    
    // Skill levels
    this.skills = {
      royaltyAnalysis: { level: 0.5, experiences: 0 },
      paymentProcessing: { level: 0.5, experiences: 0 },
      reportGeneration: { level: 0.5, experiences: 0 },
      contractReview: { level: 0.5, experiences: 0 },
      marketAnalysis: { level: 0.5, experiences: 0 },
      communication: { level: 0.5, experiences: 0 }
    };
    
    // Initialize
    this.initializeModel();
  }

  /**
   * Initialize the learning model
   */
  initializeModel() {
    // Initialize weights for different task types
    const taskTypes = [
      'analyze', 'calculate', 'generate', 'process', 'review', 'predict', 'optimize'
    ];
    
    taskTypes.forEach(type => {
      this.model.weights.set(type, Math.random());
      this.model.biases.set(type, 0);
    });
  }

  /**
   * Execute task with learning
   */
  async executeWithLearning(task, context = {}) {
    const startTime = Date.now();
    const taskId = `task-${Date.now()}`;
    
    this.emit('task:started', { taskId, task });
    
    try {
      // Get relevant experiences
      const relevantExperiences = this.getRelevantExperiences(task);
      
      // Adjust approach based on past experiences
      const adaptedApproach = this.adaptApproach(task, relevantExperiences);
      
      // Execute the task
      const result = await this.executeTask(task, {
        ...context,
        approach: adaptedApproach,
        pastExperiences: relevantExperiences.slice(0, 5) // Top 5 relevant
      });
      
      const executionTime = Date.now() - startTime;
      
      // Record experience
      const experience = {
        id: taskId,
        task,
        context,
        approach: adaptedApproach,
        result,
        executionTime,
        timestamp: new Date(),
        success: true
      };
      
      this.addExperience(experience);
      
      // Update metrics
      this.updateMetrics(experience);
      
      this.emit('task:completed', { taskId, result, executionTime });
      
      return {
        ...result,
        learning: {
          experiencesUsed: relevantExperiences.length,
          adaptedApproach,
          confidenceBoost: this.calculateConfidenceBoost(relevantExperiences)
        }
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Record failure
      const experience = {
        id: taskId,
        task,
        context,
        error: error.message,
        executionTime,
        timestamp: new Date(),
        success: false
      };
      
      this.addExperience(experience);
      this.metrics.failedTasks++;
      
      this.emit('task:failed', { taskId, error: error.message });
      
      throw error;
    }
  }

  /**
   * Execute task (core logic)
   */
  async executeTask(task, context) {
    // Determine task type
    const taskType = this.classifyTask(task);
    
    // Get model prediction
    const confidence = this.predictConfidence(taskType);
    
    // Get skill level
    const skillLevel = this.getSkillLevel(taskType);
    
    // Generate result based on task type
    const output = await this.generateOutput(task, context, taskType);
    
    return {
      output,
      taskType,
      confidence: confidence * skillLevel,
      skillLevel
    };
  }

  /**
   * Classify task type
   */
  classifyTask(task) {
    const taskLower = (task.description || task).toLowerCase();
    
    if (taskLower.includes('analy') || taskLower.includes('exam')) return 'analyze';
    if (taskLower.includes('calculat') || taskLower.includes('comput')) return 'calculate';
    if (taskLower.includes('generat') || taskLower.includes('creat')) return 'generate';
    if (taskLower.includes('process') || taskLower.includes('handl')) return 'process';
    if (taskLower.includes('review') || taskLower.includes('check')) return 'review';
    if (taskLower.includes('predict') || taskLower.includes('forecast')) return 'predict';
    if (taskLower.includes('optim') || taskLower.includes('improv')) return 'optimize';
    
    return 'analyze'; // Default
  }

  /**
   * Predict confidence using model
   */
  predictConfidence(taskType) {
    const weight = this.model.weights.get(taskType) || 0.5;
    const bias = this.model.biases.get(taskType) || 0;
    
    // Sigmoid function
    const z = weight + bias;
    return 1 / (1 + Math.exp(-z));
  }

  /**
   * Get skill level for task type
   */
  getSkillLevel(taskType) {
    const skillMap = {
      analyze: 'royaltyAnalysis',
      calculate: 'paymentProcessing',
      generate: 'reportGeneration',
      review: 'contractReview',
      predict: 'marketAnalysis',
      process: 'paymentProcessing',
      optimize: 'royaltyAnalysis'
    };
    
    const skill = skillMap[taskType] || 'royaltyAnalysis';
    return this.skills[skill].level;
  }

  /**
   * Generate output for task
   */
  async generateOutput(task, context, taskType) {
    // Check knowledge base for similar tasks
    const similarPattern = this.findSimilarPattern(task);
    
    if (similarPattern) {
      return {
        type: 'learned',
        content: `Applied learned pattern: ${similarPattern.name}`,
        pattern: similarPattern,
        confidence: similarPattern.successRate
      };
    }
    
    // Default output generation
    return {
      type: 'generated',
      content: `Processed ${taskType} task: ${task.description || task}`,
      suggestions: this.generateSuggestions(taskType)
    };
  }

  /**
   * Find similar pattern in knowledge base
   */
  findSimilarPattern(task) {
    const taskDesc = (task.description || task).toLowerCase();
    
    for (const [name, pattern] of this.knowledgeBase) {
      const similarity = this.calculateSimilarity(taskDesc, pattern.keywords);
      if (similarity > 0.7) {
        return { name, ...pattern, similarity };
      }
    }
    
    return null;
  }

  /**
   * Calculate similarity between strings
   */
  calculateSimilarity(str1, keywords) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = keywords.map(k => k.toLowerCase());
    
    let matchCount = 0;
    for (const word of words1) {
      if (words2.some(k => k.includes(word) || word.includes(k))) {
        matchCount++;
      }
    }
    
    return matchCount / Math.max(words1.length, 1);
  }

  /**
   * Generate suggestions based on task type
   */
  generateSuggestions(taskType) {
    const suggestions = {
      analyze: ['Review historical data', 'Compare with benchmarks', 'Identify trends'],
      calculate: ['Verify input data', 'Apply correct formula', 'Cross-check results'],
      generate: ['Use templates', 'Include relevant data', 'Format for readability'],
      review: ['Check compliance', 'Verify completeness', 'Flag issues'],
      predict: ['Consider multiple factors', 'Account for seasonality', 'Show confidence interval'],
      optimize: ['Identify bottlenecks', 'Prioritize changes', 'Measure impact']
    };
    
    return suggestions[taskType] || ['Proceed with standard approach'];
  }

  /**
   * Get relevant experiences from buffer
   */
  getRelevantExperiences(task) {
    const taskType = this.classifyTask(task);
    
    return this.experiences
      .filter(exp => {
        const expType = this.classifyTask(exp.task);
        return expType === taskType && exp.success;
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  }

  /**
   * Adapt approach based on past experiences
   */
  adaptApproach(task, experiences) {
    if (experiences.length === 0) {
      return { type: 'default', reason: 'No relevant experiences' };
    }
    
    // Find most successful approaches
    const successfulApproaches = experiences
      .filter(e => e.success && e.approach)
      .map(e => e.approach);
    
    if (successfulApproaches.length > 0) {
      // Combine best approaches
      return {
        type: 'adapted',
        baseApproach: successfulApproaches[0],
        confidence: experiences[0].result?.confidence || 0.5,
        reason: `Based on ${successfulApproaches.length} successful experiences`
      };
    }
    
    return { type: 'default', reason: 'No successful approaches found' };
  }

  /**
   * Calculate confidence boost from experiences
   */
  calculateConfidenceBoost(experiences) {
    if (experiences.length === 0) return 0;
    
    const avgSuccess = experiences
      .filter(e => e.success)
      .length / experiences.length;
    
    return avgSuccess * 0.1; // Up to 10% boost
  }

  /**
   * Add experience to buffer
   */
  addExperience(experience) {
    this.experiences.push(experience);
    
    // Maintain buffer size
    if (this.experiences.length > this.config.experienceBufferSize) {
      this.experiences.shift();
    }
    
    this.metrics.totalTasks++;
    if (experience.success) {
      this.metrics.successfulTasks++;
    }
  }

  /**
   * Receive feedback on task
   */
  receiveFeedback(taskId, feedback) {
    const experience = this.experiences.find(e => e.id === taskId);
    
    if (!experience) {
      this.emit('feedback:error', { taskId, error: 'Experience not found' });
      return;
    }
    
    // Store feedback
    this.feedbackHistory.push({
      taskId,
      feedback,
      timestamp: new Date()
    });
    
    // Update model based on feedback
    this.updateModelFromFeedback(experience, feedback);
    
    // Update skill levels
    this.updateSkillLevels(experience, feedback);
    
    this.emit('feedback:received', { taskId, feedback });
  }

  /**
   * Update model from feedback
   */
  updateModelFromFeedback(experience, feedback) {
    const taskType = this.classifyTask(experience.task);
    const currentWeight = this.model.weights.get(taskType) || 0.5;
    const currentBias = this.model.biases.get(taskType) || 0;
    
    // Calculate reward/penalty
    const reward = feedback.rating > 3 ? 0.1 : feedback.rating < 3 ? -0.1 : 0;
    
    // Update weights using gradient descent-like approach
    const newWeight = currentWeight + (this.config.learningRate * reward);
    const newBias = currentBias + (this.config.learningRate * reward * 0.5);
    
    this.model.weights.set(taskType, Math.max(0, Math.min(1, newWeight)));
    this.model.biases.set(taskType, newBias);
    
    this.model.lastUpdated = new Date();
    
    // If feedback is very positive, add to knowledge base
    if (feedback.rating >= 4 && feedback.correctAnswer) {
      this.addToKnowledgeBase(experience, feedback);
    }
  }

  /**
   * Update skill levels based on experience and feedback
   */
  updateSkillLevels(experience, feedback) {
    const taskType = this.classifyTask(experience.task);
    const skillMap = {
      analyze: 'royaltyAnalysis',
      calculate: 'paymentProcessing',
      generate: 'reportGeneration',
      review: 'contractReview',
      predict: 'marketAnalysis',
      process: 'paymentProcessing',
      optimize: 'royaltyAnalysis'
    };
    
    const skill = skillMap[taskType] || 'royaltyAnalysis';
    const skillData = this.skills[skill];
    
    // Increment experience count
    skillData.experiences++;
    
    // Adjust level based on feedback
    const adjustment = (feedback.rating - 3) * 0.05; // -0.1 to +0.1 per feedback
    skillData.level = Math.max(0.1, Math.min(1, skillData.level + adjustment));
    
    // Natural progression from experience
    const experienceBonus = Math.min(0.1, skillData.experiences * 0.001);
    skillData.level = Math.min(1, skillData.level + experienceBonus);
  }

  /**
   * Add successful pattern to knowledge base
   */
  addToKnowledgeBase(experience, feedback) {
    const pattern = {
      keywords: (experience.task.description || experience.task).toLowerCase().split(/\s+/),
      approach: experience.approach,
      result: experience.result,
      successRate: 1,
      addedAt: new Date()
    };
    
    const patternName = `pattern-${this.knowledgeBase.size + 1}`;
    this.knowledgeBase.set(patternName, pattern);
    
    this.emit('knowledge:added', { patternName, pattern });
  }

  /**
   * Update overall metrics
   */
  updateMetrics(experience) {
    const total = this.metrics.totalTasks;
    
    // Update average execution time
    this.metrics.averageExecutionTime = (
      (this.metrics.averageExecutionTime * (total - 1) + experience.executionTime) / total
    );
    
    // Update average confidence
    if (experience.result?.confidence) {
      this.metrics.averageConfidence = (
        (this.metrics.averageConfidence * (total - 1) + experience.result.confidence) / total
      );
    }
    
    // Calculate improvement rate
    const recentExperiences = this.experiences.slice(-10);
    const recentSuccessRate = recentExperiences.filter(e => e.success).length / recentExperiences.length;
    const overallSuccessRate = this.metrics.successfulTasks / this.metrics.totalTasks;
    
    this.metrics.improvementRate = recentSuccessRate - overallSuccessRate;
  }

  /**
   * Get learning progress report
   */
  getLearningReport() {
    return {
      metrics: this.metrics,
      skills: this.skills,
      modelVersion: this.model.version,
      lastUpdated: this.model.lastUpdated,
      experienceCount: this.experiences.length,
      feedbackCount: this.feedbackHistory.length,
      knowledgeBaseSize: this.knowledgeBase.size,
      topPatterns: Array.from(this.knowledgeBase.entries())
        .slice(0, 5)
        .map(([name, pattern]) => ({ name, keywords: pattern.keywords }))
    };
  }

  /**
   * Save state to disk
   */
  async saveState() {
    const state = {
      model: {
        weights: Object.fromEntries(this.model.weights),
        biases: Object.fromEntries(this.model.biases),
        lastUpdated: this.model.lastUpdated,
        version: this.model.version
      },
      skills: this.skills,
      metrics: this.metrics,
      knowledgeBase: Object.fromEntries(this.knowledgeBase)
    };
    
    await fs.mkdir(this.config.persistencePath, { recursive: true });
    await fs.writeFile(
      path.join(this.config.persistencePath, 'state.json'),
      JSON.stringify(state, null, 2)
    );
    
    this.emit('state:saved', { timestamp: new Date() });
  }

  /**
   * Load state from disk
   */
  async loadState() {
    try {
      const data = await fs.readFile(
        path.join(this.config.persistencePath, 'state.json'),
        'utf-8'
      );
      
      const state = JSON.parse(data);
      
      this.model.weights = new Map(Object.entries(state.model.weights));
      this.model.biases = new Map(Object.entries(state.model.biases));
      this.model.lastUpdated = new Date(state.model.lastUpdated);
      this.model.version = state.model.version;
      
      this.skills = state.skills;
      this.metrics = state.metrics;
      this.knowledgeBase = new Map(Object.entries(state.knowledgeBase));
      
      this.emit('state:loaded', { timestamp: new Date() });
    } catch (error) {
      // No saved state, use defaults
      this.emit('state:load:error', { error: error.message });
    }
  }
}

module.exports = { LearningAgent };