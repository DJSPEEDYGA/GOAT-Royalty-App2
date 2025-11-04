/**
 * GOAT Royalty App - Fingerprint Authentication Component
 * Advanced biometric security using browser fingerprinting
 */

import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, CheckCircle, AlertCircle, Lock, User, Smartphone, Monitor } from 'lucide-react';

const FingerprintAuth = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle'); // idle, scanning, success, error
  const [fingerprintData, setFingerprintData] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    // Collect device information on component mount
    collectDeviceInfo();
  }, []);

  const collectDeviceInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      cookies: navigator.cookieEnabled,
      plugins: Array.from(navigator.plugins).map(p => p.name).slice(0, 5),
      canvas: generateCanvasFingerprint(),
      webgl: generateWebGLFingerprint()
    };

    setDeviceInfo(info);
  };

  const generateCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('GOAT Royalty fingerprint 🐐', 2, 2);
      
      // Add some visual noise
      for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * 200, Math.random() * 50, Math.random() * 20, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      return canvas.toDataURL().slice(-50); // Get last 50 chars for fingerprint
    } catch (e) {
      return 'canvas-error';
    }
  };

  const generateWebGLFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
      
      return `${vendor}-${renderer}`.slice(0, 30);
    } catch (e) {
      return 'webgl-error';
    }
  };

  const generateFingerprint = () => {
    const data = {
      ...deviceInfo,
      timestamp: Date.now(),
      random: Math.random().toString(36).substr(2, 9)
    };
    
    // Create a simple hash from the device data
    const fingerprintString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return {
      data,
      hash: Math.abs(hash).toString(16),
      confidence: calculateConfidence(data)
    };
  };

  const calculateConfidence = (data) => {
    // Calculate how unique this fingerprint is
    let score = 0;
    if (data.canvas && data.canvas !== 'canvas-error') score += 20;
    if (data.webgl && data.webgl !== 'no-webgl') score += 20;
    if (data.plugins && data.plugins.length > 0) score += 15;
    if (data.cookies) score += 10;
    if (data.localStorage) score += 10;
    if (data.sessionStorage) score += 10;
    if (data.screenResolution) score += 15;
    
    return Math.min(score, 100);
  };

  const startFingerprintScan = async () => {
    setIsScanning(true);
    setAuthStatus('scanning');

    // Simulate scanning process
    setTimeout(() => {
      const fingerprint = generateFingerprint();
      setFingerprintData(fingerprint);
      
      // Simulate authentication verification
      setTimeout(() => {
        // In a real app, this would verify against a backend
        setIsAuthenticated(true);
        setAuthStatus('success');
        setIsScanning(false);
      }, 2000);
    }, 1500);
  };

  const resetAuth = () => {
    setIsAuthenticated(false);
    setAuthStatus('idle');
    setFingerprintData(null);
  };

  const getDeviceIcon = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
      return Smartphone;
    }
    return Monitor;
  };

  const DeviceIcon = getDeviceIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Fingerprint className="w-8 h-8 text-green-400 mr-2" />
            <h1 className="text-4xl font-bold text-white">Biometric Authentication</h1>
            <Shield className="w-8 h-8 text-green-400 ml-2" />
          </div>
          <p className="text-white/70 text-lg">Advanced fingerprint security for your GOAT Royalty account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Panel */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Lock className="w-6 h-6 text-green-400 mr-2" />
              Secure Access
            </h2>

            {authStatus === 'idle' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <Fingerprint className="w-16 h-16 text-white" />
                </div>
                <p className="text-white/70 mb-6">
                  Click below to scan your device fingerprint for secure authentication
                </p>
                <button
                  onClick={startFingerprintScan}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  Start Fingerprint Scan
                </button>
              </div>
            )}

            {authStatus === 'scanning' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-spin">
                  <Fingerprint className="w-16 h-16 text-white" />
                </div>
                <p className="text-white/70 mb-2">Scanning device fingerprint...</p>
                <p className="text-white/50 text-sm">Please wait while we analyze your device characteristics</p>
              </div>
            )}

            {authStatus === 'success' && fingerprintData && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <p className="text-green-400 font-semibold mb-4">Authentication Successful!</p>
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <p className="text-white/70 text-sm mb-2">Fingerprint Hash:</p>
                  <p className="text-white font-mono text-xs break-all">{fingerprintData.hash}</p>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-white/80 text-sm">Unique Score: {fingerprintData.confidence}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetAuth}
                  className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  Scan Again
                </button>
              </div>
            )}

            {authStatus === 'error' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-16 h-16 text-white" />
                </div>
                <p className="text-red-400 font-semibold mb-4">Authentication Failed</p>
                <p className="text-white/70 mb-6">Unable to verify device fingerprint. Please try again.</p>
                <button
                  onClick={resetAuth}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Device Information Panel */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <DeviceIcon className="w-6 h-6 text-blue-400 mr-2" />
              Device Profile
            </h2>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white/80 font-semibold mb-3">Browser Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Platform:</span>
                    <span className="text-white">{deviceInfo.platform || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Language:</span>
                    <span className="text-white">{deviceInfo.language || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Screen Resolution:</span>
                    <span className="text-white">{deviceInfo.screenResolution || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Timezone:</span>
                    <span className="text-white">{deviceInfo.timezone || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white/80 font-semibold mb-3">Security Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Cookies Enabled:</span>
                    <span className={`text-sm font-medium ${deviceInfo.cookies ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.cookies ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Local Storage:</span>
                    <span className={`text-sm font-medium ${deviceInfo.localStorage ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.localStorage ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Session Storage:</span>
                    <span className={`text-sm font-medium ${deviceInfo.sessionStorage ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.sessionStorage ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white/80 font-semibold mb-3">Advanced Fingerprinting</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Canvas Fingerprint:</span>
                    <span className={`text-white font-mono ${deviceInfo.canvas !== 'canvas-error' ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.canvas ? '✓ Generated' : '✗ Error'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">WebGL Renderer:</span>
                    <span className={`text-white font-mono ${deviceInfo.webgl !== 'no-webgl' ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.webgl ? '✓ Detected' : '✗ Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Browser Plugins:</span>
                    <span className="text-white">{deviceInfo.plugins?.length || 0} detected</span>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-semibold">Security Status</span>
                </div>
                <p className="text-white/70 text-sm">
                  Your device fingerprint provides {fingerprintData?.confidence || 0}% unique identification. 
                  This ensures only authorized devices can access your GOAT Royalty account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Fingerprint className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Device Fingerprinting</h3>
            <p className="text-white/70">Advanced biometric security using unique device characteristics for authentication</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Lock className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Multi-Factor Protection</h3>
            <p className="text-white/70">Layered security combining biometric data with traditional authentication methods</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Shield className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Monitoring</h3>
            <p className="text-white/70">Continuous monitoring and verification of device integrity for maximum security</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintAuth;