// Advanced Camera System with RED Cinema Integration and Sora 2 AI
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Video, Film, Aperture, Focus, Zap, Sparkles, 
  Settings, Download, Upload, Play, Pause, Square, 
  Maximize, Grid, Sun, Moon, Sliders, Wand2, Image as ImageIcon,
  Layers, Eye, Cpu, Brain, Palette, Music, Mic
} from 'lucide-react';

export default function AdvancedCameraSystem() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraMode, setCameraMode] = useState('cinema'); // cinema, photo, timelapse, slowmo
  const [resolution, setResolution] = useState('8K');
  const [fps, setFps] = useState(60);
  const [iso, setIso] = useState(800);
  const [aperture, setAperture] = useState(2.8);
  const [shutterSpeed, setShutterSpeed] = useState('1/120');
  const [whiteBalance, setWhiteBalance] = useState('auto');
  const [colorProfile, setColorProfile] = useState('RED Log3G10');
  const [aiEnhancement, setAiEnhancement] = useState(true);
  const [sora2Mode, setSora2Mode] = useState('enhance'); // enhance, generate, extend, interpolate
  const [gridOverlay, setGridOverlay] = useState('rule-of-thirds');
  const [focusMode, setFocusMode] = useState('auto');
  const [stabilization, setStabilization] = useState(true);
  const [hdr, setHdr] = useState(true);
  const [rawCapture, setRawCapture] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 7680 }, // 8K
          height: { ideal: 4320 },
          frameRate: { ideal: fps },
          facingMode: 'environment'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera initialization error:', error);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;

    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 100000000 // 100 Mbps for high quality
    };

    mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      // Process with Sora 2 AI if enabled
      if (aiEnhancement) {
        processSora2Enhancement(blob);
      }
      downloadVideo(url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Sora 2 AI Enhancement
  const processSora2Enhancement = async (videoBlob) => {
    // Simulate Sora 2 AI processing
    console.log('Processing with Sora 2 AI:', sora2Mode);
    
    const enhancements = {
      enhance: 'Upscaling to 8K, noise reduction, color grading',
      generate: 'AI-generated scene extension and enhancement',
      extend: 'Temporal extension and frame interpolation',
      interpolate: 'Smooth motion interpolation to higher FPS'
    };

    // In production, this would call actual Sora 2 API
    return {
      status: 'enhanced',
      mode: sora2Mode,
      description: enhancements[sora2Mode],
      originalSize: videoBlob.size,
      enhancedSize: videoBlob.size * 1.2
    };
  };

  // Download video
  const downloadVideo = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `GOAT-${resolution}-${fps}fps-${Date.now()}.webm`;
    a.click();
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Camera presets
  const cameraPresets = {
    cinema: { resolution: '8K', fps: 24, iso: 800, aperture: 2.8, profile: 'RED Log3G10' },
    documentary: { resolution: '6K', fps: 30, iso: 1600, aperture: 4, profile: 'Rec.709' },
    slowMotion: { resolution: '4K', fps: 120, iso: 3200, aperture: 2, profile: 'RED Log3G10' },
    timelapse: { resolution: '8K', fps: 1, iso: 400, aperture: 8, profile: 'Rec.709' },
    sports: { resolution: '4K', fps: 60, iso: 1600, aperture: 2.8, profile: 'Rec.709' },
    lowLight: { resolution: '6K', fps: 24, iso: 6400, aperture: 1.4, profile: 'RED Log3G10' }
  };

  const applyPreset = (preset) => {
    const settings = cameraPresets[preset];
    setResolution(settings.resolution);
    setFps(settings.fps);
    setIso(settings.iso);
    setAperture(settings.aperture);
    setColorProfile(settings.profile);
  };

  useEffect(() => {
    initializeCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                GOAT Cinema Camera System
              </h1>
              <p className="text-gray-400">RED-Level Professional Recording + Sora 2 AI Enhancement</p>
            </div>
          </div>
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Camera Viewport */}
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Grid Overlay */}
            {gridOverlay !== 'none' && (
              <div className="absolute inset-0 pointer-events-none">
                {gridOverlay === 'rule-of-thirds' && (
                  <svg className="w-full h-full">
                    <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  </svg>
                )}
              </div>
            )}

            {/* Camera Info Overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
                <span className="text-red-400 font-bold">{resolution}</span> @ {fps}fps
              </div>
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
                ISO {iso} • f/{aperture} • {shutterSpeed}
              </div>
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
                {colorProfile}
              </div>
            </div>

            {/* AI Enhancement Badge */}
            {aiEnhancement && (
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-lg text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Sora 2 AI Active</span>
                </div>
              </div>
            )}

            {/* Focus Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center space-x-2">
                <Focus className="w-4 h-4 text-green-400" />
                <span>{focusMode === 'auto' ? 'AF' : 'MF'}</span>
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-center space-x-4">
              {/* Record Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-6 rounded-full transition-all transform hover:scale-110 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700'
                }`}
              >
                {isRecording ? <Square className="w-8 h-8" /> : <Video className="w-8 h-8" />}
              </button>

              {/* Photo Capture */}
              <button className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-110">
                <Camera className="w-6 h-6" />
              </button>

              {/* Settings */}
              <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-110">
                <Settings className="w-6 h-6" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              {['cinema', 'photo', 'timelapse', 'slowmo'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCameraMode(mode)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    cameraMode === mode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Presets */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Film className="w-5 h-5 mr-2 text-purple-400" />
              Professional Presets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.keys(cameraPresets).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 border border-gray-600 hover:border-purple-400"
                >
                  <div className="text-sm font-semibold capitalize">{preset}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {cameraPresets[preset].resolution} @ {cameraPresets[preset].fps}fps
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Resolution & FPS */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Maximize className="w-5 h-5 mr-2 text-purple-400" />
              Resolution & Frame Rate
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="8K">8K (7680×4320)</option>
                  <option value="6K">6K (6144×3456)</option>
                  <option value="4K">4K (3840×2160)</option>
                  <option value="2K">2K (1920×1080)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Frame Rate</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="24">24 fps (Cinema)</option>
                  <option value="30">30 fps (Standard)</option>
                  <option value="60">60 fps (Smooth)</option>
                  <option value="120">120 fps (Slow Motion)</option>
                  <option value="240">240 fps (Ultra Slow)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exposure Settings */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Aperture className="w-5 h-5 mr-2 text-purple-400" />
              Exposure
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">ISO: {iso}</label>
                <input
                  type="range"
                  min="100"
                  max="12800"
                  step="100"
                  value={iso}
                  onChange={(e) => setIso(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Aperture: f/{aperture}</label>
                <input
                  type="range"
                  min="1.4"
                  max="22"
                  step="0.1"
                  value={aperture}
                  onChange={(e) => setAperture(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Shutter Speed</label>
                <select
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="1/24">1/24</option>
                  <option value="1/48">1/48</option>
                  <option value="1/60">1/60</option>
                  <option value="1/120">1/120</option>
                  <option value="1/240">1/240</option>
                  <option value="1/500">1/500</option>
                  <option value="1/1000">1/1000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color & Profile */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-400" />
              Color Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Color Profile</label>
                <select
                  value={colorProfile}
                  onChange={(e) => setColorProfile(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="RED Log3G10">RED Log3G10</option>
                  <option value="RED IPP2">RED IPP2</option>
                  <option value="Rec.709">Rec.709</option>
                  <option value="Rec.2020">Rec.2020</option>
                  <option value="DCI-P3">DCI-P3</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">White Balance</label>
                <select
                  value={whiteBalance}
                  onChange={(e) => setWhiteBalance(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="auto">Auto</option>
                  <option value="daylight">Daylight (5600K)</option>
                  <option value="cloudy">Cloudy (6500K)</option>
                  <option value="tungsten">Tungsten (3200K)</option>
                  <option value="fluorescent">Fluorescent (4000K)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sora 2 AI Enhancement */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 border border-purple-400">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Sora 2 AI Enhancement
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable AI Enhancement</span>
                <button
                  onClick={() => setAiEnhancement(!aiEnhancement)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    aiEnhancement ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    aiEnhancement ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {aiEnhancement && (
                <>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">AI Mode</label>
                    <select
                      value={sora2Mode}
                      onChange={(e) => setSora2Mode(e.target.value)}
                      className="w-full bg-purple-800 border border-purple-600 rounded-lg px-4 py-2 focus:border-yellow-400 focus:outline-none"
                    >
                      <option value="enhance">Enhance Quality</option>
                      <option value="generate">Generate Extensions</option>
                      <option value="extend">Temporal Extension</option>
                      <option value="interpolate">Frame Interpolation</option>
                    </select>
                  </div>

                  <div className="bg-purple-800/50 rounded-lg p-3 text-xs text-gray-300">
                    <Brain className="w-4 h-4 inline mr-2 text-yellow-400" />
                    {sora2Mode === 'enhance' && 'AI upscaling, noise reduction, and color enhancement'}
                    {sora2Mode === 'generate' && 'AI-generated scene extensions and enhancements'}
                    {sora2Mode === 'extend' && 'Extend video duration with AI-generated frames'}
                    {sora2Mode === 'interpolate' && 'Smooth motion with AI frame interpolation'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-purple-400" />
              Advanced Features
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Image Stabilization</span>
                <button
                  onClick={() => setStabilization(!stabilization)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    stabilization ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    stabilization ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">HDR Recording</span>
                <button
                  onClick={() => setHdr(!hdr)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    hdr ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    hdr ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">RAW Capture</span>
                <button
                  onClick={() => setRawCapture(!rawCapture)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    rawCapture ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    rawCapture ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Grid Overlay</label>
                <select
                  value={gridOverlay}
                  onChange={(e) => setGridOverlay(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="none">None</option>
                  <option value="rule-of-thirds">Rule of Thirds</option>
                  <option value="center">Center Cross</option>
                  <option value="golden-ratio">Golden Ratio</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Focus Mode</label>
                <select
                  value={focusMode}
                  onChange={(e) => setFocusMode(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="auto">Auto Focus</option>
                  <option value="manual">Manual Focus</option>
                  <option value="tracking">Face Tracking</option>
                  <option value="touch">Touch Focus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-purple-400" />
              Storage & Performance
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Bitrate:</span>
                <span className="font-mono text-green-400">100 Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Storage per Minute:</span>
                <span className="font-mono text-yellow-400">~750 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available Space:</span>
                <span className="font-mono text-blue-400">128 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recording Time:</span>
                <span className="font-mono text-purple-400">~2.8 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}