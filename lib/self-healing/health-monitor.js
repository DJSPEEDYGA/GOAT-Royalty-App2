/**
 * Health Monitor Component
 * Monitors all registered services and reports health status
 */

const EventEmitter = require('events');

class HealthMonitor extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.services = new Map();
    this.healthHistory = [];
    this.maxHistoryLength = 100;
  }
  
  /**
   * Register a service for health monitoring
   */
  registerService(name, checkFn, options = {}) {
    this.services.set(name, {
      name,
      checkFn,
      options: {
        timeout: options.timeout || 5000,
        critical: options.critical !== false,
        retries: options.retries || 3,
        interval: options.interval || this.config.checkInterval
      },
      status: {
        healthy: true,
        lastCheck: null,
        lastError: null,
        consecutiveFailures: 0
      }
    });
  }
  
  /**
   * Check health of a single service
   */
  async checkService(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    
    const startTime = Date.now();
    
    try {
      // Execute health check with timeout
      const result = await Promise.race([
        service.checkFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), service.options.timeout)
        )
      ]);
      
      const responseTime = Date.now() - startTime;
      
      service.status = {
        healthy: true,
        lastCheck: new Date().toISOString(),
        lastError: null,
        consecutiveFailures: 0,
        responseTime,
        details: result
      };
      
      return {
        name,
        healthy: true,
        responseTime,
        details: result
      };
    } catch (error) {
      service.status.consecutiveFailures++;
      service.status.lastCheck = new Date().toISOString();
      service.status.lastError = error.message;
      service.status.healthy = service.status.consecutiveFailures < service.options.retries;
      
      return {
        name,
        healthy: false,
        error: error.message,
        consecutiveFailures: service.status.consecutiveFailures
      };
    }
  }
  
  /**
   * Check all registered services
   */
  async checkAll() {
    const results = {};
    const serviceNames = Array.from(this.services.keys());
    
    // Run all health checks in parallel
    const checks = await Promise.allSettled(
      serviceNames.map(name => this.checkService(name))
    );
    
    let healthyCount = 0;
    let criticalFailures = 0;
    
    checks.forEach((result, index) => {
      const name = serviceNames[index];
      
      if (result.status === 'fulfilled') {
        results[name] = result.value;
        if (result.value.healthy) {
          healthyCount++;
        } else if (this.services.get(name)?.options.critical) {
          criticalFailures++;
        }
      } else {
        results[name] = {
          name,
          healthy: false,
          error: result.reason?.message || 'Unknown error'
        };
        criticalFailures++;
      }
    });
    
    // Calculate overall health score
    const overall = serviceNames.length > 0 
      ? healthyCount / serviceNames.length 
      : 1;
    
    const report = {
      overall,
      healthy: healthyCount,
      total: serviceNames.length,
      criticalFailures,
      services: results,
      timestamp: new Date().toISOString()
    };
    
    // Store in history
    this.healthHistory.push(report);
    if (this.healthHistory.length > this.maxHistoryLength) {
      this.healthHistory.shift();
    }
    
    // Emit events for degraded health
    if (overall < this.config.alertThreshold) {
      this.emit('health-degraded', report);
    } else if (this._wasPreviouslyDegraded()) {
      this.emit('health-recovered', report);
    }
    
    return report;
  }
  
  /**
   * Check if system was previously degraded
   */
  _wasPreviouslyDegraded() {
    if (this.healthHistory.length < 2) return false;
    const previous = this.healthHistory[this.healthHistory.length - 2];
    return previous.overall < this.config.alertThreshold;
  }
  
  /**
   * Get status of all services
   */
  getServicesStatus() {
    const status = {};
    for (const [name, service] of this.services) {
      status[name] = service.status;
    }
    return status;
  }
  
  /**
   * Get health history
   */
  getHistory(limit = 10) {
    return this.healthHistory.slice(-limit);
  }
  
  /**
   * Shutdown health monitor
   */
  async shutdown() {
    this.services.clear();
    this.healthHistory = [];
  }
}

module.exports = HealthMonitor;