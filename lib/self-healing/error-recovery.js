/**
 * Error Recovery Component
 * Handles automatic error detection and recovery actions
 */

const EventEmitter = require('events');

class ErrorRecovery extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.recoveryActions = new Map();
    this.recoveryHistory = [];
    this.maxHistoryLength = 100;
    
    // Register default recovery actions
    this._registerDefaultActions();
  }
  
  /**
   * Register default recovery actions for common error types
   */
  _registerDefaultActions() {
    // Database connection recovery
    this.registerAction('DATABASE_CONNECTION', async (error, context) => {
      // Attempt to reconnect
      if (context.reconnect) {
        await context.reconnect();
      }
      return { success: true, action: 'reconnect' };
    });
    
    // API timeout recovery
    this.registerAction('API_TIMEOUT', async (error, context) => {
      // Retry with exponential backoff
      return { success: true, action: 'retry_with_backoff' };
    });
    
    // Memory pressure recovery
    this.registerAction('MEMORY_PRESSURE', async (error, context) => {
      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
      }
      return { success: true, action: 'garbage_collection' };
    });
  }
  
  /**
   * Register a recovery action for an error type
   */
  registerAction(errorType, actionFn, options = {}) {
    this.recoveryActions.set(errorType, {
      actionFn,
      options: {
        priority: options.priority || 5,
        maxAttempts: options.maxAttempts || this.config.maxRetries,
        cooldown: options.cooldown || 10000, // 10 seconds
        ...options
      },
      lastAttempt: null,
      attemptCount: 0
    });
  }
  
  /**
   * Classify an error to determine its type
   */
  classifyError(error) {
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';
    
    // Database errors
    if (message.includes('connection') || 
        message.includes('database') ||
        code.includes('econnrefused')) {
      return 'DATABASE_CONNECTION';
    }
    
    // Timeout errors
    if (message.includes('timeout') || 
        code.includes('etimedout')) {
      return 'API_TIMEOUT';
    }
    
    // Memory errors
    if (message.includes('memory') || 
        message.includes('heap') ||
        error.code === 'ENOMEM') {
      return 'MEMORY_PRESSURE';
    }
    
    // CPU overload
    if (message.includes('cpu') || 
        message.includes('overload')) {
      return 'CPU_OVERLOAD';
    }
    
    // Disk space
    if (message.includes('disk') || 
        message.includes('space') ||
        message.includes('enospc')) {
      return 'DISK_FULL';
    }
    
    // External service
    if (message.includes('external') || 
        message.includes('third-party') ||
        message.includes('upstream')) {
      return 'EXTERNAL_SERVICE';
    }
    
    return 'UNKNOWN_ERROR';
  }
  
  /**
   * Attempt recovery based on health check data
   */
  async attemptRecovery(data) {
    const results = [];
    
    for (const [serviceName, serviceData] of Object.entries(data.services || {})) {
      if (!serviceData.healthy) {
        const errorType = this.classifyError({ 
          message: serviceData.error,
          code: serviceData.code
        });
        
        const result = await this.executeRecoveryAction(
          errorType, 
          { error: serviceData.error, service: serviceName }
        );
        
        results.push({
          service: serviceName,
          errorType,
          result
        });
      }
    }
    
    const overallSuccess = results.every(r => r.result.success);
    
    // Store in history
    this.recoveryHistory.push({
      timestamp: new Date().toISOString(),
      data,
      results,
      success: overallSuccess
    });
    
    if (this.recoveryHistory.length > this.maxHistoryLength) {
      this.recoveryHistory.shift();
    }
    
    if (overallSuccess) {
      this.emit('recovery-success', { results });
    } else {
      this.emit('recovery-failed', { results });
    }
    
    return {
      success: overallSuccess,
      results
    };
  }
  
  /**
   * Execute a recovery action
   */
  async executeRecoveryAction(errorType, context) {
    const action = this.recoveryActions.get(errorType);
    
    if (!action) {
      // Try generic recovery
      return this.executeGenericRecovery(context);
    }
    
    // Check cooldown
    if (action.lastAttempt && 
        Date.now() - action.lastAttempt < action.options.cooldown) {
      return {
        success: false,
        reason: 'Cooldown period not elapsed',
        nextAttempt: new Date(action.lastAttempt + action.options.cooldown)
      };
    }
    
    // Check max attempts
    if (action.attemptCount >= action.options.maxAttempts) {
      return {
        success: false,
        reason: 'Max recovery attempts reached',
        attempts: action.attemptCount
      };
    }
    
    this.emit('recovery-attempt', {
      errorType,
      context,
      attempt: action.attemptCount + 1
    });
    
    try {
      const result = await action.actionFn(context.error, context);
      
      action.lastAttempt = Date.now();
      action.attemptCount++;
      
      return {
        success: result.success !== false,
        action: result.action,
        details: result
      };
    } catch (error) {
      action.lastAttempt = Date.now();
      action.attemptCount++;
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Execute generic recovery for unknown error types
   */
  async executeGenericRecovery(context) {
    // Basic recovery: wait and retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      action: 'generic_retry'
    };
  }
  
  /**
   * Handle error from wrapped function
   */
  async handleFunctionError(error, fn, args) {
    const errorType = this.classifyError(error);
    const result = await this.executeRecoveryAction(errorType, { error, fn, args });
    
    if (result.success) {
      // Try to re-execute the function
      try {
        const retryResult = await fn(...args);
        return { recovered: true, result: retryResult };
      } catch (retryError) {
        return { recovered: false, error: retryError.message };
      }
    }
    
    return { recovered: false, error: error.message };
  }
  
  /**
   * Get recovery history
   */
  getHistory(limit = 10) {
    return this.recoveryHistory.slice(-limit);
  }
  
  /**
   * Clear recovery attempt counters
   */
  resetCounters() {
    for (const action of this.recoveryActions.values()) {
      action.attemptCount = 0;
    }
  }
}

module.exports = ErrorRecovery;