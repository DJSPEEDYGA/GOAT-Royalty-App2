/**
 * GOAT Royalty App - Self-Healing Infrastructure System
 * 
 * This module provides automated error detection, recovery, and system resilience
 * for enterprise-grade reliability (99.99% uptime target).
 */

const EventEmitter = require('events');

// Core Components
const HealthMonitor = require('./health-monitor');
const ErrorRecovery = require('./error-recovery');
const CircuitBreaker = require('./circuit-breaker');
const AutoScaler = require('./auto-scaler');
const LogAggregator = require('./log-aggregator');

class SelfHealingSystem extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      checkInterval: config.checkInterval || 30000, // 30 seconds
      maxRetries: config.maxRetries || 3,
      circuitBreakerThreshold: config.circuitBreakerThreshold || 5,
      recoveryTimeout: config.recoveryTimeout || 60000, // 1 minute
      alertThreshold: config.alertThreshold || 0.95, // 95% health
      ...config
    };
    
    this.status = {
      isHealthy: true,
      lastCheck: null,
      errorCount: 0,
      recoveryCount: 0,
      uptime: 100
    };
    
    // Initialize components
    this.healthMonitor = new HealthMonitor(this.config);
    this.errorRecovery = new ErrorRecovery(this.config);
    this.circuitBreaker = new CircuitBreaker(this.config);
    this.autoScaler = new AutoScaler(this.config);
    this.logAggregator = new LogAggregator(this.config);
    
    this._setupEventHandlers();
    this._startMonitoring();
  }
  
  /**
   * Set up event handlers for all components
   */
  _setupEventHandlers() {
    // Health monitoring events
    this.healthMonitor.on('health-degraded', (data) => {
      this._handleHealthDegraded(data);
    });
    
    this.healthMonitor.on('health-recovered', (data) => {
      this._handleHealthRecovered(data);
    });
    
    // Error recovery events
    this.errorRecovery.on('recovery-attempt', (data) => {
      this.emit('recovery-attempt', data);
    });
    
    this.errorRecovery.on('recovery-success', (data) => {
      this.status.recoveryCount++;
      this.emit('recovery-success', data);
    });
    
    this.errorRecovery.on('recovery-failed', (data) => {
      this._handleRecoveryFailed(data);
    });
    
    // Circuit breaker events
    this.circuitBreaker.on('circuit-open', (data) => {
      this.emit('circuit-open', data);
    });
    
    this.circuitBreaker.on('circuit-closed', (data) => {
      this.emit('circuit-closed', data);
    });
    
    // Auto-scaler events
    this.autoScaler.on('scale-up', (data) => {
      this.emit('scale-up', data);
    });
    
    this.autoScaler.on('scale-down', (data) => {
      this.emit('scale-down', data);
    });
  }
  
  /**
   * Start the monitoring loop
   */
  _startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);
    
    // Initial check
    this.performHealthCheck();
  }
  
  /**
   * Perform a comprehensive health check
   */
  async performHealthCheck() {
    try {
      const healthReport = await this.healthMonitor.checkAll();
      
      this.status.lastCheck = new Date().toISOString();
      this.status.isHealthy = healthReport.overall >= this.config.alertThreshold;
      this.status.uptime = this._calculateUptime();
      
      if (!this.status.isHealthy) {
        this._handleHealthDegraded(healthReport);
      }
      
      this.emit('health-check', {
        status: this.status,
        report: healthReport
      });
      
      return healthReport;
    } catch (error) {
      this._handleMonitoringError(error);
      throw error;
    }
  }
  
  /**
   * Handle health degradation
   */
  async _handleHealthDegraded(data) {
    this.status.errorCount++;
    
    this.emit('health-degraded', {
      timestamp: new Date().toISOString(),
      data,
      errorCount: this.status.errorCount
    });
    
    // Attempt automatic recovery
    const recoveryResult = await this.errorRecovery.attemptRecovery(data);
    
    if (!recoveryResult.success) {
      this._handleRecoveryFailed({
        originalData: data,
        recoveryResult
      });
    }
  }
  
  /**
   * Handle health recovery
   */
  _handleHealthRecovered(data) {
    this.emit('health-recovered', {
      timestamp: new Date().toISOString(),
      data
    });
  }
  
  /**
   * Handle recovery failure
   */
  _handleRecoveryFailed(data) {
    // Escalate to alerting system
    this.emit('alert-critical', {
      timestamp: new Date().toISOString(),
      type: 'RECOVERY_FAILED',
      data,
      recommendation: this._generateRecommendation(data)
    });
  }
  
  /**
   * Handle monitoring errors
   */
  _handleMonitoringError(error) {
    this.emit('monitoring-error', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
  }
  
  /**
   * Calculate uptime percentage
   */
  _calculateUptime() {
    // Simplified uptime calculation
    // In production, this would use historical data
    const totalChecks = this.status.errorCount + this.status.recoveryCount;
    if (totalChecks === 0) return 100;
    
    const successRate = (this.status.recoveryCount / totalChecks) * 100;
    return Math.max(95, Math.min(100, successRate + 95));
  }
  
  /**
   * Generate recommendations based on failure patterns
   */
  _generateRecommendation(data) {
    const recommendations = {
      'DATABASE_CONNECTION': 'Check database credentials and network connectivity. Consider scaling read replicas.',
      'API_TIMEOUT': 'Increase timeout thresholds or implement request caching. Check downstream services.',
      'MEMORY_PRESSURE': 'Scale up instance size or implement memory optimization. Check for memory leaks.',
      'CPU_OVERLOAD': 'Enable auto-scaling or optimize CPU-intensive operations.',
      'DISK_FULL': 'Clean up old logs and temporary files. Expand storage capacity.',
      'EXTERNAL_SERVICE': 'Check third-party service status. Implement fallback mechanisms.'
    };
    
    return recommendations[data.type] || 'Investigate the issue manually and check logs for details.';
  }
  
  /**
   * Wrap a function with self-healing capabilities
   */
  wrapFunction(fn, options = {}) {
    return async (...args) => {
      return this.circuitBreaker.execute(async () => {
        try {
          return await fn(...args);
        } catch (error) {
          const recoveryResult = await this.errorRecovery.handleFunctionError(error, fn, args);
          
          if (recoveryResult.recovered) {
            return recoveryResult.result;
          }
          
          throw error;
        }
      });
    };
  }
  
  /**
   * Register a service for monitoring
   */
  registerService(name, checkFn, options = {}) {
    this.healthMonitor.registerService(name, checkFn, options);
    this.emit('service-registered', { name, options });
  }
  
  /**
   * Register an automatic recovery action
   */
  registerRecoveryAction(errorType, recoveryFn, options = {}) {
    this.errorRecovery.registerAction(errorType, recoveryFn, options);
    this.emit('recovery-action-registered', { errorType, options });
  }
  
  /**
   * Get current system status
   */
  getStatus() {
    return {
      ...this.status,
      circuitBreaker: this.circuitBreaker.getStatus(),
      services: this.healthMonitor.getServicesStatus(),
      recentLogs: this.logAggregator.getRecentLogs(10)
    };
  }
  
  /**
   * Get detailed health report
   */
  async getHealthReport() {
    return {
      timestamp: new Date().toISOString(),
      status: this.status,
      services: await this.healthMonitor.checkAll(),
      recoveryHistory: this.errorRecovery.getHistory(),
      circuitBreaker: this.circuitBreaker.getStatus(),
      scaling: this.autoScaler.getStatus()
    };
  }
  
  /**
   * Gracefully shutdown the self-healing system
   */
  async shutdown() {
    clearInterval(this.monitoringInterval);
    
    await this.healthMonitor.shutdown();
    await this.logAggregator.shutdown();
    
    this.emit('shutdown', {
      timestamp: new Date().toISOString(),
      finalStatus: this.status
    });
  }
}

// Export main class and components
module.exports = SelfHealingSystem;
module.exports.HealthMonitor = HealthMonitor;
module.exports.ErrorRecovery = ErrorRecovery;
module.exports.CircuitBreaker = CircuitBreaker;
module.exports.AutoScaler = AutoScaler;
module.exports.LogAggregator = LogAggregator;