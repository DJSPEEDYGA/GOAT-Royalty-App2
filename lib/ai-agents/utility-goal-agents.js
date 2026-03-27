/**
 * Utility-Based and Goal-Based Agents for GOAT Royalty App
 * Level 2: Moderately Advanced - Learning & Goal-Based Systems
 * 
 * Utility-Based Agents: Evaluate and select optimal paths using utility functions
 * Goal-Based Agents: Plan multi-step actions to achieve desired end states
 */

// ============================================
// UTILITY-BASED AGENT
// ============================================

class UtilityBasedAgent {
  constructor(config = {}) {
    this.name = config.name || 'GOAT-Utility-Agent';
    this.version = '2.0.0';
    
    // Utility function weights
    this.utilityWeights = {
      cost: 0.25,        // Minimize cost
      speed: 0.25,       // Maximize speed
      reliability: 0.20, // Maximize reliability
      quality: 0.20,     // Maximize quality
      risk: 0.10         // Minimize risk
    };
    
    // Action registry with utility profiles
    this.actions = new Map();
    
    // Decision history for learning
    this.decisionHistory = [];
    
    // Initialize actions
    this.initializeActions();
  }

  /**
   * Initialize available actions with utility profiles
   */
  initializeActions() {
    // Royalty actions
    this.registerAction('calculate_royalties_standard', {
      description: 'Standard royalty calculation',
      category: 'royalty',
      utilityProfile: { cost: 0.9, speed: 0.8, reliability: 0.9, quality: 0.7, risk: 0.1 },
      estimatedTime: 2000,
      cost: 0
    });

    this.registerAction('calculate_royalties_comprehensive', {
      description: 'Comprehensive royalty calculation with all platforms',
      category: 'royalty',
      utilityProfile: { cost: 0.6, speed: 0.4, reliability: 0.95, quality: 0.95, risk: 0.05 },
      estimatedTime: 10000,
      cost: 0
    });

    // Distribution actions
    this.registerAction('distribute_standard', {
      description: 'Standard distribution to major platforms',
      category: 'distribution',
      utilityProfile: { cost: 0.7, speed: 0.8, reliability: 0.85, quality: 0.8, risk: 0.15 },
      estimatedTime: 30000,
      cost: 10
    });

    this.registerAction('distribute_premium', {
      description: 'Premium distribution with priority delivery',
      category: 'distribution',
      utilityProfile: { cost: 0.4, speed: 0.95, reliability: 0.95, quality: 0.95, risk: 0.05 },
      estimatedTime: 15000,
      cost: 50
    });

    // AI generation actions
    this.registerAction('generate_content_basic', {
      description: 'Basic AI content generation',
      category: 'ai',
      utilityProfile: { cost: 0.9, speed: 0.9, reliability: 0.7, quality: 0.6, risk: 0.2 },
      estimatedTime: 5000,
      cost: 0.01
    });

    this.registerAction('generate_content_premium', {
      description: 'Premium AI content with advanced models',
      category: 'ai',
      utilityProfile: { cost: 0.5, speed: 0.6, reliability: 0.9, quality: 0.95, risk: 0.1 },
      estimatedTime: 15000,
      cost: 0.10
    });

    // Analytics actions
    this.registerAction('analyze_basic', {
      description: 'Basic analytics report',
      category: 'analytics',
      utilityProfile: { cost: 0.95, speed: 0.95, reliability: 0.8, quality: 0.7, risk: 0.1 },
      estimatedTime: 3000,
      cost: 0
    });

    this.registerAction('analyze_comprehensive', {
      description: 'Comprehensive analytics with predictions',
      category: 'analytics',
      utilityProfile: { cost: 0.6, speed: 0.5, reliability: 0.9, quality: 0.95, risk: 0.05 },
      estimatedTime: 20000,
      cost: 5
    });

    // Security actions
    this.registerAction('security_scan_quick', {
      description: 'Quick security scan',
      category: 'security',
      utilityProfile: { cost: 0.9, speed: 0.95, reliability: 0.7, quality: 0.6, risk: 0.3 },
      estimatedTime: 1000,
      cost: 0
    });

    this.registerAction('security_scan_full', {
      description: 'Full security audit',
      category: 'security',
      utilityProfile: { cost: 0.4, speed: 0.3, reliability: 0.95, quality: 0.95, risk: 0.05 },
      estimatedTime: 60000,
      cost: 20
    });
  }

  /**
   * Register an action with its utility profile
   */
  registerAction(name, config) {
    this.actions.set(name, {
      name,
      ...config
    });
  }

  /**
   * Execute a task by selecting the optimal action
   */
  async execute(task) {
    console.log(`[UtilityAgent] Evaluating task: ${task.description}`);
    
    // Get applicable actions
    const applicableActions = this.getApplicableActions(task);
    
    // Calculate utility for each action
    const actionUtilities = await this.evaluateActions(applicableActions, task);
    
    // Select action with highest utility
    const optimalAction = this.selectOptimalAction(actionUtilities);
    
    // Execute the action
    const result = await this.executeAction(optimalAction.action, task);
    
    // Record decision
    this.recordDecision(task, optimalAction, result);
    
    return {
      task: task.description,
      selectedAction: optimalAction.action.name,
      utility: optimalAction.utility,
      utilityBreakdown: optimalAction.breakdown,
      result,
      executedAt: new Date().toISOString()
    };
  }

  /**
   * Get actions applicable to a task
   */
  getApplicableActions(task) {
    const taskCategory = this.categorizeTask(task);
    return Array.from(this.actions.values())
      .filter(action => action.category === taskCategory || taskCategory === 'general');
  }

  /**
   * Evaluate utility for each action
   */
  async evaluateActions(actions, task) {
    const evaluations = [];
    
    for (const action of actions) {
      const utility = this.calculateUtility(action, task);
      evaluations.push({
        action,
        utility: utility.total,
        breakdown: utility.breakdown
      });
    }
    
    // Sort by utility descending
    evaluations.sort((a, b) => b.utility - a.utility);
    
    return evaluations;
  }

  /**
   * Calculate utility for an action
   */
  calculateUtility(action, task) {
    const profile = action.utilityProfile;
    const weights = this.getAdjustedWeights(task);
    
    // Calculate individual utilities
    const costUtility = profile.cost * weights.cost;
    const speedUtility = profile.speed * weights.speed;
    const reliabilityUtility = profile.reliability * weights.reliability;
    const qualityUtility = profile.quality * weights.quality;
    const riskUtility = (1 - profile.risk) * weights.risk; // Invert risk (lower is better)
    
    const totalUtility = costUtility + speedUtility + reliabilityUtility + qualityUtility + riskUtility;
    
    return {
      total: totalUtility,
      breakdown: {
        cost: costUtility,
        speed: speedUtility,
        reliability: reliabilityUtility,
        quality: qualityUtility,
        risk: riskUtility
      }
    };
  }

  /**
   * Get weights adjusted for task priority
   */
  getAdjustedWeights(task) {
    const baseWeights = { ...this.utilityWeights };
    
    // Adjust based on task priority
    if (task.priority === 'urgent') {
      baseWeights.speed *= 2;
    }
    
    if (task.priority === 'critical') {
      baseWeights.reliability *= 1.5;
      baseWeights.risk *= 1.5;
    }
    
    if (task.budget === 'premium') {
      baseWeights.quality *= 1.5;
    }
    
    // Normalize weights
    const totalWeight = Object.values(baseWeights).reduce((a, b) => a + b, 0);
    Object.keys(baseWeights).forEach(key => {
      baseWeights[key] /= totalWeight;
    });
    
    return baseWeights;
  }

  /**
   * Select the optimal action
   */
  selectOptimalAction(evaluations) {
    if (evaluations.length === 0) {
      throw new Error('No applicable actions found');
    }
    
    return evaluations[0]; // Highest utility
  }

  /**
   * Execute the selected action
   */
  async executeAction(action, task) {
    // Simulate action execution
    return {
      action: action.name,
      status: 'completed',
      executionTime: action.estimatedTime,
      cost: action.cost,
      output: `${action.description} completed for: ${task.description}`
    };
  }

  /**
   * Record decision for learning
   */
  recordDecision(task, optimalAction, result) {
    this.decisionHistory.push({
      task: task.description,
      action: optimalAction.action.name,
      utility: optimalAction.utility,
      result: result.status,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Categorize a task
   */
  categorizeTask(task) {
    const desc = task.description.toLowerCase();
    
    if (desc.includes('royalt')) return 'royalty';
    if (desc.includes('distribut')) return 'distribution';
    if (desc.includes('generat') || desc.includes('ai')) return 'ai';
    if (desc.includes('analyt') || desc.includes('report')) return 'analytics';
    if (desc.includes('secur') || desc.includes('audit')) return 'security';
    
    return 'general';
  }

  /**
   * Get decision history
   */
  getDecisionHistory(limit = 10) {
    return this.decisionHistory.slice(-limit);
  }
}

// ============================================
// GOAL-BASED AGENT
// ============================================

class GoalBasedAgent {
  constructor(config = {}) {
    this.name = config.name || 'GOAT-Goal-Agent';
    this.version = '2.0.0';
    
    // Goal management
    this.goals = new Map();
    this.currentGoal = null;
    this.goalHistory = [];
    
    // Planning
    this.planner = new GoalPlanner();
    this.executor = new GoalExecutor();
    
    // State tracking
    this.currentState = {};
    this.stateHistory = [];
    
    // Available operations
    this.operations = new Map();
    
    // Initialize operations
    this.initializeOperations();
  }

  /**
   * Initialize available operations
   */
  initializeOperations() {
    // Royalty operations
    this.registerOperation('fetch_royalty_data', {
      description: 'Fetch royalty data from platforms',
      preconditions: ['has_api_access'],
      effects: ['royalty_data_loaded'],
      estimatedTime: 5000
    });

    this.registerOperation('calculate_royalties', {
      description: 'Calculate royalties for all tracks',
      preconditions: ['royalty_data_loaded'],
      effects: ['royalties_calculated'],
      estimatedTime: 3000
    });

    this.registerOperation('generate_royalty_report', {
      description: 'Generate royalty report',
      preconditions: ['royalties_calculated'],
      effects: ['report_generated'],
      estimatedTime: 2000
    });

    // Distribution operations
    this.registerOperation('prepare_content', {
      description: 'Prepare content for distribution',
      preconditions: ['content_available'],
      effects: ['content_prepared'],
      estimatedTime: 5000
    });

    this.registerOperation('upload_to_platform', {
      description: 'Upload content to platform',
      preconditions: ['content_prepared', 'platform_connected'],
      effects: ['content_uploaded'],
      estimatedTime: 30000
    });

    this.registerOperation('verify_distribution', {
      description: 'Verify distribution status',
      preconditions: ['content_uploaded'],
      effects: ['distribution_verified'],
      estimatedTime: 5000
    });

    // Catalog operations
    this.registerOperation('scan_catalog', {
      description: 'Scan and validate catalog',
      preconditions: [],
      effects: ['catalog_scanned'],
      estimatedTime: 10000
    });

    this.registerOperation('update_metadata', {
      description: 'Update track metadata',
      preconditions: ['catalog_scanned'],
      effects: ['metadata_updated'],
      estimatedTime: 5000
    });

    this.registerOperation('register_isrc', {
      description: 'Register ISRC codes',
      preconditions: ['metadata_updated'],
      effects: ['isrc_registered'],
      estimatedTime: 3000
    });

    // Payment operations
    this.registerOperation('process_payments', {
      description: 'Process royalty payments',
      preconditions: ['royalties_calculated', 'payment_accounts_configured'],
      effects: ['payments_processed'],
      estimatedTime: 10000
    });

    this.registerOperation('generate_statements', {
      description: 'Generate payment statements',
      preconditions: ['payments_processed'],
      effects: ['statements_generated'],
      estimatedTime: 5000
    });
  }

  /**
   * Register an operation
   */
  registerOperation(name, config) {
    this.operations.set(name, {
      name,
      ...config
    });
  }

  /**
   * Set a new goal
   */
  async setGoal(goalDescription, priority = 'medium', deadline = null) {
    const goal = {
      id: `goal-${Date.now()}`,
      description: goalDescription,
      priority,
      deadline,
      status: 'pending',
      createdAt: new Date().toISOString(),
      subgoals: [],
      plan: null
    };
    
    // Decompose goal into subgoals if complex
    const complexity = this.assessComplexity(goalDescription);
    if (complexity === 'high') {
      goal.subgoals = await this.decomposeGoal(goalDescription);
    }
    
    this.goals.set(goal.id, goal);
    return goal;
  }

  /**
   * Execute a goal
   */
  async executeGoal(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`);
    }
    
    console.log(`[GoalAgent] Executing goal: ${goal.description}`);
    
    this.currentGoal = goal;
    goal.status = 'in_progress';
    
    try {
      // Create plan
      goal.plan = await this.planner.createPlan(goal, this.operations, this.currentState);
      
      // Execute plan
      const result = await this.executor.executePlan(goal.plan, this.operations, this.currentState);
      
      // Update state
      this.updateState(result.effects);
      
      goal.status = 'completed';
      goal.completedAt = new Date().toISOString();
      goal.result = result;
      
    } catch (error) {
      goal.status = 'failed';
      goal.error = error.message;
      
      // Attempt recovery
      const recovery = await this.attemptRecovery(goal, error);
      if (recovery.success) {
        goal.status = 'completed';
        goal.result = recovery.result;
      }
    }
    
    this.goalHistory.push(goal);
    this.currentGoal = null;
    
    return goal;
  }

  /**
   * Assess goal complexity
   */
  assessComplexity(description) {
    const words = description.toLowerCase().split(' ');
    const complexityKeywords = ['and', 'then', 'after', 'before', 'while', 'comprehensive', 'all'];
    const matches = words.filter(w => complexityKeywords.includes(w)).length;
    
    return matches >= 3 ? 'high' : matches >= 1 ? 'medium' : 'low';
  }

  /**
   * Decompose a complex goal
   */
  async decomposeGoal(description) {
    const subgoals = [];
    const parts = description.split(/ and | then | after /i);
    
    parts.forEach((part, index) => {
      if (part.trim()) {
        subgoals.push({
          id: `subgoal-${index}-${Date.now()}`,
          description: part.trim(),
          status: 'pending',
          order: index
        });
      }
    });
    
    return subgoals;
  }

  /**
   * Update current state
   */
  updateState(effects) {
    effects.forEach(effect => {
      this.currentState[effect] = true;
    });
    
    this.stateHistory.push({
      state: { ...this.currentState },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Attempt recovery from failure
   */
  async attemptRecovery(goal, error) {
    // Try alternative plan
    const alternativePlan = await this.planner.createAlternativePlan(goal, this.operations, this.currentState);
    
    if (alternativePlan) {
      try {
        const result = await this.executor.executePlan(alternativePlan, this.operations, this.currentState);
        return { success: true, result };
      } catch (replanError) {
        return { success: false };
      }
    }
    
    return { success: false };
  }

  /**
   * Get goal status
   */
  getGoalStatus(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;
    
    return {
      id: goal.id,
      description: goal.description,
      status: goal.status,
      progress: goal.plan ? this.calculateProgress(goal.plan) : 0,
      subgoals: goal.subgoals.map(s => ({ id: s.id, status: s.status }))
    };
  }

  /**
   * Calculate plan progress
   */
  calculateProgress(plan) {
    if (!plan || !plan.steps) return 0;
    
    const completed = plan.steps.filter(s => s.status === 'completed').length;
    return completed / plan.steps.length;
  }

  /**
   * Get all active goals
   */
  getActiveGoals() {
    return Array.from(this.goals.values())
      .filter(g => g.status === 'pending' || g.status === 'in_progress');
  }
}

/**
 * Goal Planner
 */
class GoalPlanner {
  async createPlan(goal, operations, currentState) {
    const plan = {
      id: `plan-${Date.now()}`,
      goalId: goal.id,
      steps: [],
      createdAt: new Date().toISOString()
    };
    
    // Determine desired effects based on goal
    const desiredEffects = this.determineDesiredEffects(goal.description);
    
    // Find operations that achieve desired effects
    const relevantOps = this.findRelevantOperations(desiredEffects, operations);
    
    // Order operations by dependencies
    const orderedOps = this.orderByDependencies(relevantOps, currentState);
    
    // Create plan steps
    plan.steps = orderedOps.map((op, index) => ({
      id: `step-${index}`,
      operation: op.name,
      description: op.description,
      preconditions: op.preconditions,
      effects: op.effects,
      status: 'pending',
      estimatedTime: op.estimatedTime
    }));
    
    return plan;
  }

  async createAlternativePlan(goal, operations, currentState) {
    // Try different operation sequence
    return this.createPlan(goal, operations, currentState);
  }

  determineDesiredEffects(goalDescription) {
    const effects = [];
    const desc = goalDescription.toLowerCase();
    
    if (desc.includes('royalt')) effects.push('royalties_calculated', 'report_generated');
    if (desc.includes('distribut')) effects.push('content_uploaded', 'distribution_verified');
    if (desc.includes('catalog')) effects.push('catalog_scanned', 'metadata_updated');
    if (desc.includes('payment')) effects.push('payments_processed', 'statements_generated');
    
    return effects;
  }

  findRelevantOperations(desiredEffects, operations) {
    return Array.from(operations.values())
      .filter(op => op.effects.some(e => desiredEffects.includes(e)));
  }

  orderByDependencies(operations, currentState) {
    // Simple topological sort based on preconditions
    const ordered = [];
    const remaining = [...operations];
    const satisfied = new Set(Object.keys(currentState).filter(k => currentState[k]));
    
    while (remaining.length > 0) {
      const readyIndex = remaining.findIndex(op => 
        op.preconditions.every(p => satisfied.has(p))
      );
      
      if (readyIndex === -1) {
        // Cannot satisfy preconditions, add remaining anyway
        ordered.push(...remaining);
        break;
      }
      
      const ready = remaining.splice(readyIndex, 1)[0];
      ordered.push(ready);
      ready.effects.forEach(e => satisfied.add(e));
    }
    
    return ordered;
  }
}

/**
 * Goal Executor
 */
class GoalExecutor {
  async executePlan(plan, operations, currentState) {
    const results = [];
    const effects = [];
    
    for (const step of plan.steps) {
      step.status = 'executing';
      step.startedAt = new Date().toISOString();
      
      try {
        const result = await this.executeStep(step, operations, currentState);
        step.status = 'completed';
        step.completedAt = new Date().toISOString();
        step.result = result;
        
        results.push(result);
        effects.push(...step.effects);
        
      } catch (error) {
        step.status = 'failed';
        step.error = error.message;
        throw error;
      }
    }
    
    return { results, effects };
  }

  async executeStep(step, operations, currentState) {
    // Simulate operation execution
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      operation: step.operation,
      success: true,
      message: `${step.description} completed`
    };
  }
}

module.exports = {
  UtilityBasedAgent,
  GoalBasedAgent,
  GoalPlanner,
  GoalExecutor
};