/**
 * Utility-Based Agent System
 * 
 * These agents go beyond just reaching a goal; they use a "utility function"
 * to evaluate and select the optimal path, weighing trade-offs like cost,
 * risk, and speed.
 * 
 * Features:
 * - Multi-criteria decision analysis
 * - Cost-benefit evaluation
 * - Risk assessment
 * - Optimization algorithms
 * - Trade-off analysis
 */

const EventEmitter = require('events');

class UtilityBasedAgent extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      riskTolerance: config.riskTolerance || 0.5, // 0-1 (conservative to aggressive)
      timePreference: config.timePreference || 0.5, // 0=thorough, 1=fast
      costSensitivity: config.costSensitivity || 0.5, // 0-1 (cost importance)
      qualityWeight: config.qualityWeight || 0.7,
      speedWeight: config.speedWeight || 0.3,
      ...config
    };
    
    // Utility function weights
    this.utilityWeights = {
      success: 0.3,
      cost: 0.2,
      time: 0.2,
      risk: 0.15,
      quality: 0.15
    };
    
    // Decision history
    this.decisionHistory = [];
    
    // Outcome tracking
    this.outcomes = {
      total: 0,
      optimal: 0,
      suboptimal: 0,
      averageUtility: 0
    };
    
    // Action registry
    this.availableActions = new Map();
    this.initializeActions();
  }

  /**
   * Initialize available actions
   */
  initializeActions() {
    // Royalty analysis actions
    this.registerAction('quick_analysis', {
      description: 'Fast royalty analysis with basic metrics',
      cost: 0.01,
      estimatedTime: 5000,
      riskLevel: 0.3,
      expectedQuality: 0.6,
      successProbability: 0.95
    });
    
    this.registerAction('deep_analysis', {
      description: 'Comprehensive royalty analysis with all metrics',
      cost: 0.05,
      estimatedTime: 30000,
      riskLevel: 0.1,
      expectedQuality: 0.95,
      successProbability: 0.99
    });
    
    this.registerAction('automated_report', {
      description: 'Generate automated royalty report',
      cost: 0.02,
      estimatedTime: 10000,
      riskLevel: 0.2,
      expectedQuality: 0.75,
      successProbability: 0.9
    });
    
    this.registerAction('expert_review', {
      description: 'Manual expert review of royalties',
      cost: 0.5,
      estimatedTime: 3600000, // 1 hour
      riskLevel: 0.05,
      expectedQuality: 1.0,
      successProbability: 0.99
    });
    
    // Payment actions
    this.registerAction('instant_payment', {
      description: 'Process instant payment (higher fee)',
      cost: 0.03,
      estimatedTime: 1000,
      riskLevel: 0.2,
      expectedQuality: 0.9,
      successProbability: 0.95
    });
    
    this.registerAction('standard_payment', {
      description: 'Standard payment processing',
      cost: 0.01,
      estimatedTime: 86400000, // 24 hours
      riskLevel: 0.1,
      expectedQuality: 0.85,
      successProbability: 0.99
    });
    
    this.registerAction('batch_payment', {
      description: 'Batch process multiple payments',
      cost: 0.005,
      estimatedTime: 172800000, // 48 hours
      riskLevel: 0.15,
      expectedQuality: 0.8,
      successProbability: 0.97
    });
    
    // Communication actions
    this.registerAction('ai_response', {
      description: 'AI-generated response',
      cost: 0.001,
      estimatedTime: 2000,
      riskLevel: 0.3,
      expectedQuality: 0.7,
      successProbability: 0.9
    });
    
    this.registerAction('template_response', {
      description: 'Use pre-approved template',
      cost: 0.0001,
      estimatedTime: 500,
      riskLevel: 0.15,
      expectedQuality: 0.6,
      successProbability: 0.95
    });
    
    this.registerAction('personalized_response', {
      description: 'Craft personalized response',
      cost: 0.01,
      estimatedTime: 600000, // 10 min
      riskLevel: 0.05,
      expectedQuality: 0.95,
      successProbability: 0.99
    });
  }

  /**
   * Register a new action
   */
  registerAction(actionId, actionConfig) {
    this.availableActions.set(actionId, {
      id: actionId,
      ...actionConfig,
      timesUsed: 0,
      successCount: 0,
      totalUtility: 0
    });
    
    this.emit('action:registered', { actionId, config: actionConfig });
  }

  /**
   * Make optimal decision based on utility function
   */
  async makeDecision(context) {
    const { goal, constraints = {}, preferences = {} } = context;
    
    this.emit('decision:started', { goal, constraints });
    
    // Generate possible actions
    const possibleActions = this.generatePossibleActions(goal, constraints);
    
    // Evaluate each action
    const evaluations = await Promise.all(
      possibleActions.map(action => this.evaluateAction(action, context))
    );
    
    // Calculate utility for each
    const utilities = evaluations.map((eval_, index) => ({
      action: possibleActions[index],
      evaluation: eval_,
      utility: this.calculateUtility(eval_, preferences)
    }));
    
    // Sort by utility
    utilities.sort((a, b) => b.utility - a.utility);
    
    // Select optimal action
    const optimalDecision = utilities[0];
    
    // Record decision
    const decision = {
      id: `decision-${Date.now()}`,
      goal,
      constraints,
      consideredActions: utilities.length,
      selectedAction: optimalDecision.action,
      utility: optimalDecision.utility,
      evaluation: optimalDecision.evaluation,
      alternatives: utilities.slice(1, 4), // Top 3 alternatives
      timestamp: new Date()
    };
    
    this.decisionHistory.push(decision);
    this.outcomes.total++;
    
    this.emit('decision:made', decision);
    
    return decision;
  }

  /**
   * Generate possible actions for a goal
   */
  generatePossibleActions(goal, constraints) {
    const actions = [];
    const goalLower = goal.toLowerCase();
    
    // Match goal to available actions
    if (goalLower.includes('analy') || goalLower.includes('report')) {
      actions.push(
        this.availableActions.get('quick_analysis'),
        this.availableActions.get('deep_analysis'),
        this.availableActions.get('automated_report')
      );
    }
    
    if (goalLower.includes('payment') || goalLower.includes('pay')) {
      actions.push(
        this.availableActions.get('instant_payment'),
        this.availableActions.get('standard_payment'),
        this.availableActions.get('batch_payment')
      );
    }
    
    if (goalLower.includes('respond') || goalLower.includes('communicate') || goalLower.includes('email')) {
      actions.push(
        this.availableActions.get('ai_response'),
        this.availableActions.get('template_response'),
        this.availableActions.get('personalized_response')
      );
    }
    
    // If specific actions in constraints, filter to those
    if (constraints.allowedActions) {
      return actions.filter(a => constraints.allowedActions.includes(a?.id));
    }
    
    // Filter out undefined and respect maxCost constraint
    return actions.filter(a => {
      if (!a) return false;
      if (constraints.maxCost && a.cost > constraints.maxCost) return false;
      if (constraints.maxTime && a.estimatedTime > constraints.maxTime) return false;
      return true;
    });
  }

  /**
   * Evaluate an action across all criteria
   */
  async evaluateAction(action, context) {
    if (!action) {
      return {
        success: 0,
        cost: Infinity,
        time: Infinity,
        risk: 1,
        quality: 0
      };
    }
    
    // Get historical performance
    const historicalSuccess = action.timesUsed > 0 
      ? action.successCount / action.timesUsed 
      : action.successProbability;
    
    // Adjust based on context
    const contextAdjustedQuality = this.adjustForContext(
      action.expectedQuality,
      context
    );
    
    return {
      actionId: action.id,
      success: historicalSuccess,
      cost: action.cost,
      time: action.estimatedTime,
      risk: action.riskLevel,
      quality: contextAdjustedQuality,
      historicalData: {
        timesUsed: action.timesUsed,
        successRate: historicalSuccess
      }
    };
  }

  /**
   * Adjust expectations based on context
   */
  adjustForContext(baseQuality, context) {
    let adjustment = 0;
    
    // Complexity adjustment
    if (context.complexity === 'high') adjustment -= 0.1;
    if (context.complexity === 'low') adjustment += 0.05;
    
    // Urgency adjustment (rushed = lower quality)
    if (context.urgent) adjustment -= 0.15;
    
    // Resource availability
    if (context.limitedResources) adjustment -= 0.1;
    
    return Math.max(0, Math.min(1, baseQuality + adjustment));
  }

  /**
   * Calculate utility score
   */
  calculateUtility(evaluation, preferences = {}) {
    const weights = { ...this.utilityWeights, ...preferences.weights };
    
    // Normalize values (0-1 scale, higher is better)
    const normalizedSuccess = evaluation.success;
    const normalizedCost = 1 - Math.min(evaluation.cost / 1, 1); // Invert cost
    const normalizedTime = 1 - Math.min(evaluation.time / 3600000, 1); // Invert time (1hr baseline)
    const normalizedRisk = 1 - evaluation.risk; // Invert risk
    const normalizedQuality = evaluation.quality;
    
    // Apply time preference
    const effectiveTimeWeight = weights.time * this.config.timePreference;
    const effectiveQualityWeight = weights.quality * (1 - this.config.timePreference);
    
    // Apply risk tolerance
    const effectiveRiskWeight = weights.risk * (1 - this.config.riskTolerance);
    
    // Calculate weighted utility
    const utility = (
      normalizedSuccess * weights.success +
      normalizedCost * weights.cost * this.config.costSensitivity +
      normalizedTime * effectiveTimeWeight +
      normalizedRisk * effectiveRiskWeight +
      normalizedQuality * effectiveQualityWeight
    );
    
    // Apply confidence factor
    const confidence = this.calculateConfidence(evaluation);
    
    return utility * confidence;
  }

  /**
   * Calculate confidence in evaluation
   */
  calculateConfidence(evaluation) {
    // Higher confidence with more historical data
    const dataConfidence = Math.min(1, evaluation.historicalData?.timesUsed / 10);
    
    // Base confidence
    return 0.7 + (0.3 * dataConfidence);
  }

  /**
   * Execute the selected action
   */
  async executeAction(actionId, params = {}) {
    const action = this.availableActions.get(actionId);
    
    if (!action) {
      throw new Error(`Action not found: ${actionId}`);
    }
    
    this.emit('action:started', { actionId, params });
    
    const startTime = Date.now();
    
    try {
      // Simulate action execution
      const result = await this.performAction(action, params);
      
      const executionTime = Date.now() - startTime;
      
      // Update action statistics
      action.timesUsed++;
      if (result.success) {
        action.successCount++;
      }
      action.totalUtility += result.utility || 0.5;
      
      // Update outcome tracking
      if (result.utility >= 0.7) {
        this.outcomes.optimal++;
      } else {
        this.outcomes.suboptimal++;
      }
      
      this.outcomes.averageUtility = (
        (this.outcomes.averageUtility * (this.outcomes.total - 1) + (result.utility || 0.5)) 
        / this.outcomes.total
      );
      
      this.emit('action:completed', { actionId, result, executionTime });
      
      return result;
      
    } catch (error) {
      action.timesUsed++;
      
      this.emit('action:failed', { actionId, error: error.message });
      throw error;
    }
  }

  /**
   * Perform the actual action
   */
  async performAction(action, params) {
    // This would integrate with actual services
    // For now, simulate based on action configuration
    
    const success = Math.random() < action.successProbability;
    
    return {
      success,
      actionId: action.id,
      description: action.description,
      quality: action.expectedQuality * (success ? 1 : 0.5),
      cost: action.cost,
      executionTime: action.estimatedTime * (0.8 + Math.random() * 0.4),
      utility: success ? this.calculateUtility({
        success: action.successProbability,
        cost: action.cost,
        time: action.estimatedTime,
        risk: action.riskLevel,
        quality: action.expectedQuality
      }) : 0.1
    };
  }

  /**
   * Compare multiple options
   */
  compareOptions(options, criteria = {}) {
    return options.map(option => ({
      option,
      score: this.calculateUtility(option, criteria),
      breakdown: {
        success: option.success,
        cost: option.cost,
        time: option.time,
        risk: option.risk,
        quality: option.quality
      }
    })).sort((a, b) => b.score - a.score);
  }

  /**
   * Get decision statistics
   */
  getStatistics() {
    return {
      outcomes: this.outcomes,
      averageUtility: this.outcomes.averageUtility.toFixed(3),
      optimalRate: (this.outcomes.optimal / this.outcomes.total * 100).toFixed(1) + '%',
      actionStats: Array.from(this.availableActions.values()).map(a => ({
        id: a.id,
        timesUsed: a.timesUsed,
        successRate: a.timesUsed > 0 ? (a.successCount / a.timesUsed * 100).toFixed(1) + '%' : 'N/A',
        averageUtility: a.timesUsed > 0 ? (a.totalUtility / a.timesUsed).toFixed(3) : 'N/A'
      }))
    };
  }

  /**
   * Update utility weights based on outcomes
   */
  updateWeights(feedback) {
    // Adaptive weight adjustment based on feedback
    const { preferredCriteria } = feedback;
    
    if (preferredCriteria) {
      Object.keys(preferredCriteria).forEach(criterion => {
        if (this.utilityWeights[criterion] !== undefined) {
          const adjustment = preferredCriteria[criterion] * 0.1;
          this.utilityWeights[criterion] = Math.max(0.05, 
            Math.min(0.5, this.utilityWeights[criterion] + adjustment)
          );
        }
      });
      
      // Normalize weights to sum to 1
      const total = Object.values(this.utilityWeights).reduce((a, b) => a + b, 0);
      Object.keys(this.utilityWeights).forEach(key => {
        this.utilityWeights[key] /= total;
      });
      
      this.emit('weights:updated', { weights: this.utilityWeights });
    }
  }
}

module.exports = { UtilityBasedAgent };