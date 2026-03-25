/**
 * Auto-Scaler Component
 * Automatically scales resources based on load
 */

const EventEmitter = require('events');

class AutoScaler extends EventEmitter {
  constructor(config) {
    super();
    this.config = {
      minInstances: config.minInstances || 1,
      maxInstances: config.maxInstances || 10,
      scaleUpThreshold: config.scaleUpThreshold || 80, // CPU/Memory %
      scaleDownThreshold: config.scaleDownThreshold || 30,
      cooldownPeriod: config.cooldownPeriod || 60000, // 1 minute
      ...config
    };
    
    this.status = {
      currentInstances: 1,
      pendingScale: null,
      lastScale: null,
      metrics: {
        cpu: 0,
        memory: 0,
        requests: 0,
        latency: 0
      }
    };
    
    this.scaleHistory = [];
  }
  
  /**
   * Update metrics and check for scaling needs
   */
  updateMetrics(metrics) {
    this.status.metrics = {
      ...this.status.metrics,
      ...metrics
    };
    
    return this._evaluateScaling();
  }
  
  /**
   * Evaluate if scaling is needed
   */
  _evaluateScaling() {
    const { cpu, memory, requests, latency } = this.status.metrics;
    const { scaleUpThreshold, scaleDownThreshold, cooldownPeriod } = this.config;
    
    // Check cooldown
    if (this.status.lastScale && 
        Date.now() - this.status.lastScale < cooldownPeriod) {
      return { action: 'cooldown', reason: 'Waiting for cooldown period' };
    }
    
    // Calculate combined load score
    const loadScore = Math.max(cpu, memory);
    
    // Check for scale up
    if (loadScore >= scaleUpThreshold && 
        this.status.currentInstances < this.config.maxInstances) {
      return this._scaleUp('High load detected');
    }
    
    // Check for scale down
    if (loadScore <= scaleDownThreshold && 
        this.status.currentInstances > this.config.minInstances) {
      return this._scaleDown('Low load detected');
    }
    
    // Check latency-based scaling
    if (latency > 1000 && this.status.currentInstances < this.config.maxInstances) {
      return this._scaleUp('High latency detected');
    }
    
    return { action: 'none', currentInstances: this.status.currentInstances };
  }
  
  /**
   * Scale up instances
   */
  _scaleUp(reason) {
    const newCount = Math.min(
      this.status.currentInstances + 1,
      this.config.maxInstances
    );
    
    const scaleEvent = {
      action: 'scale-up',
      reason,
      from: this.status.currentInstances,
      to: newCount,
      timestamp: new Date().toISOString(),
      metrics: { ...this.status.metrics }
    };
    
    this.status.currentInstances = newCount;
    this.status.lastScale = Date.now();
    this.scaleHistory.push(scaleEvent);
    
    this.emit('scale-up', scaleEvent);
    
    return scaleEvent;
  }
  
  /**
   * Scale down instances
   */
  _scaleDown(reason) {
    const newCount = Math.max(
      this.status.currentInstances - 1,
      this.config.minInstances
    );
    
    const scaleEvent = {
      action: 'scale-down',
      reason,
      from: this.status.currentInstances,
      to: newCount,
      timestamp: new Date().toISOString(),
      metrics: { ...this.status.metrics }
    };
    
    this.status.currentInstances = newCount;
    this.status.lastScale = Date.now();
    this.scaleHistory.push(scaleEvent);
    
    this.emit('scale-down', scaleEvent);
    
    return scaleEvent;
  }
  
  /**
   * Force scale to specific instance count
   */
  scaleTo(count, reason = 'Manual scaling') {
    const validCount = Math.max(
      this.config.minInstances,
      Math.min(count, this.config.maxInstances)
    );
    
    const scaleEvent = {
      action: validCount > this.status.currentInstances ? 'scale-up' : 'scale-down',
      reason,
      from: this.status.currentInstances,
      to: validCount,
      timestamp: new Date().toISOString(),
      metrics: { ...this.status.metrics }
    };
    
    this.status.currentInstances = validCount;
    this.status.lastScale = Date.now();
    this.scaleHistory.push(scaleEvent);
    
    this.emit(scaleEvent.action, scaleEvent);
    
    return scaleEvent;
  }
  
  /**
   * Get current status
   */
  getStatus() {
    return {
      ...this.status,
      config: {
        minInstances: this.config.minInstances,
        maxInstances: this.config.maxInstances,
        scaleUpThreshold: this.config.scaleUpThreshold,
        scaleDownThreshold: this.config.scaleDownThreshold
      },
      recentScaling: this.scaleHistory.slice(-5)
    };
  }
  
  /**
   * Get scaling history
   */
  getHistory(limit = 10) {
    return this.scaleHistory.slice(-limit);
  }
  
  /**
   * Set scaling limits
   */
  setLimits(min, max) {
    this.config.minInstances = min;
    this.config.maxInstances = max;
    
    // Ensure current is within new limits
    if (this.status.currentInstances < min) {
      this.scaleTo(min, 'Adjusted to new minimum');
    } else if (this.status.currentInstances > max) {
      this.scaleTo(max, 'Adjusted to new maximum');
    }
  }
}

module.exports = AutoScaler;