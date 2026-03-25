/**
 * Circuit Breaker Component
 * Prevents cascade failures by stopping requests to failing services
 */

const EventEmitter = require('events');

class CircuitBreaker extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.circuits = new Map();
    
    // Circuit states
    this.STATES = {
      CLOSED: 'CLOSED',     // Normal operation
      OPEN: 'OPEN',         // Failing, reject requests
      HALF_OPEN: 'HALF_OPEN' // Testing if recovered
    };
  }
  
  /**
   * Get or create a circuit for a service
   */
  getCircuit(name = 'default') {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, {
        state: this.STATES.CLOSED,
        failures: 0,
        successes: 0,
        lastFailure: null,
        lastSuccess: null,
        lastStateChange: Date.now(),
        nextAttempt: null
      });
    }
    return this.circuits.get(name);
  }
  
  /**
   * Execute a function with circuit breaker protection
   */
  async execute(fn, circuitName = 'default') {
    const circuit = this.getCircuit(circuitName);
    
    // Check if circuit is open
    if (circuit.state === this.STATES.OPEN) {
      if (Date.now() < circuit.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN for ${circuitName}. Next attempt at ${new Date(circuit.nextAttempt)}`);
      }
      
      // Transition to half-open
      this._transitionTo(circuitName, this.STATES.HALF_OPEN);
    }
    
    try {
      const result = await fn();
      this._recordSuccess(circuitName);
      return result;
    } catch (error) {
      this._recordFailure(circuitName);
      throw error;
    }
  }
  
  /**
   * Record a successful operation
   */
  _recordSuccess(circuitName) {
    const circuit = this.getCircuit(circuitName);
    circuit.successes++;
    circuit.lastSuccess = Date.now();
    
    if (circuit.state === this.STATES.HALF_OPEN) {
      // Service recovered, close circuit
      this._transitionTo(circuitName, this.STATES.CLOSED);
      circuit.failures = 0;
    }
  }
  
  /**
   * Record a failed operation
   */
  _recordFailure(circuitName) {
    const circuit = this.getCircuit(circuitName);
    circuit.failures++;
    circuit.lastFailure = Date.now();
    
    if (circuit.state === this.STATES.HALF_OPEN) {
      // Service still failing, re-open circuit
      this._transitionTo(circuitName, this.STATES.OPEN);
    } else if (circuit.failures >= this.config.circuitBreakerThreshold) {
      // Threshold reached, open circuit
      this._transitionTo(circuitName, this.STATES.OPEN);
    }
  }
  
  /**
   * Transition circuit to a new state
   */
  _transitionTo(circuitName, newState) {
    const circuit = this.getCircuit(circuitName);
    const oldState = circuit.state;
    
    circuit.state = newState;
    circuit.lastStateChange = Date.now();
    
    if (newState === this.STATES.OPEN) {
      // Set next attempt time (exponential backoff)
      const backoffMs = Math.min(
        60000, // Max 1 minute
        Math.pow(2, circuit.failures) * 1000
      );
      circuit.nextAttempt = Date.now() + backoffMs;
      
      this.emit('circuit-open', {
        circuit: circuitName,
        failures: circuit.failures,
        nextAttempt: new Date(circuit.nextAttempt)
      });
    } else if (newState === this.STATES.CLOSED && oldState === this.STATES.HALF_OPEN) {
      this.emit('circuit-closed', {
        circuit: circuitName,
        successes: circuit.successes
      });
    }
  }
  
  /**
   * Get circuit status
   */
  getStatus(circuitName = null) {
    if (circuitName) {
      const circuit = this.circuits.get(circuitName);
      if (!circuit) return null;
      
      return {
        name: circuitName,
        state: circuit.state,
        failures: circuit.failures,
        successes: circuit.successes,
        lastFailure: circuit.lastFailure ? new Date(circuit.lastFailure) : null,
        lastSuccess: circuit.lastSuccess ? new Date(circuit.lastSuccess) : null,
        lastStateChange: new Date(circuit.lastStateChange),
        nextAttempt: circuit.nextAttempt ? new Date(circuit.nextAttempt) : null
      };
    }
    
    // Return all circuits
    const allCircuits = {};
    for (const [name, circuit] of this.circuits) {
      allCircuits[name] = {
        state: circuit.state,
        failures: circuit.failures,
        successes: circuit.successes
      };
    }
    return allCircuits;
  }
  
  /**
   * Force open a circuit (for maintenance)
   */
  forceOpen(circuitName = 'default') {
    const circuit = this.getCircuit(circuitName);
    this._transitionTo(circuitName, this.STATES.OPEN);
    circuit.nextAttempt = Date.now() + 3600000; // 1 hour
  }
  
  /**
   * Force close a circuit (for testing/recovery)
   */
  forceClose(circuitName = 'default') {
    const circuit = this.getCircuit(circuitName);
    this._transitionTo(circuitName, this.STATES.CLOSED);
    circuit.failures = 0;
  }
  
  /**
   * Reset all circuits
   */
  reset() {
    for (const [name] of this.circuits) {
      this.forceClose(name);
    }
  }
}

module.exports = CircuitBreaker;