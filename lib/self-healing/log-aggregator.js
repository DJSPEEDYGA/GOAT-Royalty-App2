/**
 * Log Aggregator Component
 * Centralizes and manages application logs for monitoring and debugging
 */

const EventEmitter = require('events');

class LogAggregator extends EventEmitter {
  constructor(config) {
    super();
    this.config = {
      maxLogs: config.maxLogs || 10000,
      logLevel: config.logLevel || 'info',
      enableConsole: config.enableConsole !== false,
      enableFile: config.enableFile || false,
      ...config
    };
    
    this.logs = [];
    this.logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      critical: 4
    };
    
    this.counters = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      critical: 0
    };
  }
  
  /**
   * Log a message
   */
  log(level, message, meta = {}) {
    if (this.logLevels[level] < this.logLevels[this.config.logLevel]) {
      return;
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      id: this._generateId()
    };
    
    this.logs.push(logEntry);
    this.counters[level]++;
    
    // Trim if over limit
    if (this.logs.length > this.config.maxLogs) {
      this.logs.shift();
    }
    
    // Console output
    if (this.config.enableConsole) {
      this._consoleOutput(logEntry);
    }
    
    // Emit for external handlers
    this.emit('log', logEntry);
    
    // Emit critical alerts
    if (level === 'critical') {
      this.emit('critical', logEntry);
    }
    
    return logEntry;
  }
  
  /**
   * Convenience methods
   */
  debug(message, meta) { return this.log('debug', message, meta); }
  info(message, meta) { return this.log('info', message, meta); }
  warn(message, meta) { return this.log('warn', message, meta); }
  error(message, meta) { return this.log('error', message, meta); }
  critical(message, meta) { return this.log('critical', message, meta); }
  
  /**
   * Generate unique log ID
   */
  _generateId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Console output formatting
   */
  _consoleOutput(logEntry) {
    const { timestamp, level, message, meta } = logEntry;
    const formattedTimestamp = new Date(timestamp).toLocaleTimeString();
    const prefix = `[${formattedTimestamp}] [${level.toUpperCase()}]`;
    
    const styles = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      critical: '\x1b[35m\x1b[1m' // Magenta Bold
    };
    
    const reset = '\x1b[0m';
    const style = styles[level] || '';
    
    console.log(`${style}${prefix}${reset} ${message}`, 
      Object.keys(meta).length > 0 ? meta : '');
  }
  
  /**
   * Get recent logs
   */
  getRecentLogs(count = 10) {
    return this.logs.slice(-count);
  }
  
  /**
   * Get logs by level
   */
  getLogsByLevel(level, limit = 100) {
    return this.logs
      .filter(log => log.level === level)
      .slice(-limit);
  }
  
  /**
   * Get logs by time range
   */
  getLogsByTime(startTime, endTime = new Date()) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }
  
  /**
   * Search logs
   */
  searchLogs(query, options = {}) {
    const {
      level,
      startTime,
      endTime,
      limit = 100
    } = options;
    
    let results = this.logs;
    
    // Filter by level
    if (level) {
      results = results.filter(log => log.level === level);
    }
    
    // Filter by time range
    if (startTime || endTime) {
      results = this.getLogsByTime(startTime, endTime || new Date());
    }
    
    // Search in message and meta
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(log => 
        log.message.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(log.meta).toLowerCase().includes(lowerQuery)
      );
    }
    
    return results.slice(-limit);
  }
  
  /**
   * Get log statistics
   */
  getStats() {
    return {
      totalLogs: this.logs.length,
      counters: { ...this.counters },
      oldestLog: this.logs[0]?.timestamp || null,
      newestLog: this.logs[this.logs.length - 1]?.timestamp || null,
      errorRate: this._calculateErrorRate()
    };
  }
  
  /**
   * Calculate error rate
   */
  _calculateErrorRate() {
    const total = Object.values(this.counters).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    
    const errors = this.counters.error + this.counters.critical;
    return (errors / total) * 100;
  }
  
  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    this.counters = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      critical: 0
    };
    
    this.emit('cleared');
  }
  
  /**
   * Export logs as JSON
   */
  exportLogs(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }
    
    if (format === 'csv') {
      const header = 'timestamp,level,message,meta\n';
      const rows = this.logs.map(log => 
        `"${log.timestamp}","${log.level}","${log.message.replace(/"/g, '""')}","${JSON.stringify(log.meta).replace(/"/g, '""')}"`
      ).join('\n');
      
      return header + rows;
    }
    
    return this.logs;
  }
  
  /**
   * Shutdown log aggregator
   */
  async shutdown() {
    this.emit('shutdown', {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length
    });
  }
}

module.exports = LogAggregator;