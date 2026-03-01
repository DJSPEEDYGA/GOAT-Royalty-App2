/**
 * 🛡️ Security Middleware — GOAT Royalty App
 * Rate limiting, input sanitization, security headers
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

// ═══ INPUT SANITIZATION ═══
const sanitizeString = (str, maxLength = 500) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/<script[^>]*>/gi, '')
    .replace(/<\/script>/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .substring(0, maxLength);
};

const sanitizeNumber = (val, min = 0, max = 999999999) => {
  const num = parseFloat(val);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase().substring(0, 254);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
};

// ═══ RATE LIMITING ═══
const rateLimitStore = new Map();

const rateLimit = (ip, { windowMs = 60000, max = 60 } = {}) => {
  const now = Date.now();
  const key = ip || 'unknown';
  const record = rateLimitStore.get(key);

  if (!record || now - record.start > windowMs) {
    rateLimitStore.set(key, { start: now, count: 1 });
    return { allowed: true, remaining: max - 1, resetIn: windowMs };
  }

  record.count++;
  if (record.count > max) {
    return { allowed: false, remaining: 0, resetIn: windowMs - (now - record.start) };
  }
  return { allowed: true, remaining: max - record.count, resetIn: windowMs - (now - record.start) };
};

// Cleanup stale entries every 5 minutes
if (typeof global._securityCleanup === 'undefined') {
  global._securityCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.start > 120000) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

// ═══ SECURITY HEADERS ═══
const setSecurityHeaders = (res, options = {}) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', options.allowFrame ? 'SAMEORIGIN' : 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (!options.allowCache) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
};

// ═══ CORS HEADERS ═══
const setCorsHeaders = (res, origin = '*') => {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// ═══ GET CLIENT IP ═══
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';
};

// ═══ VALIDATE REQUEST METHOD ═══
const validateMethod = (req, res, allowedMethods = ['GET']) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({ error: `Method ${req.method} not allowed. Use: ${allowedMethods.join(', ')}` });
    return false;
  }
  return true;
};

module.exports = {
  sanitizeString,
  sanitizeNumber,
  sanitizeEmail,
  rateLimit,
  setSecurityHeaders,
  setCorsHeaders,
  getClientIP,
  validateMethod
};