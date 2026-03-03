/**
 * Enhanced Video Background Component
 * GOAT Force branded video background with red/black theme
 */

import React, { useState, useEffect, useRef } from 'react';

const EnhancedVideoBackground = ({ 
  showGoatLogo = true, 
  logoPosition = 'top-right',
  autoPlay = true,
  muted = true,
  loop = true,
  overlayOpacity = 0.4 
}) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    '/videos/goat-logo-animation.mp4',
    '/videos/grok-video-BLUE GOAT CANT FUCK WITH ME).mp4',
    '/videos/grok-video-BLUE GOAT 23).mp4',
    '/videos/grok-video- NERD BITCH3.mp4',
    '/videos/grok-video- (1).mp4',
    '/videos/grok-video- (2).mp4',
    '/videos/grok-video- (3).mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}
        style={{ filter: 'brightness(0.5) saturate(1.4)' }}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      {/* Animated gradient background (fallback & overlay) */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-black/90">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/5 animate-pulse"></div>
        </div>
      </div>
      
      {/* Dark overlay with red tint */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" 
        style={{ opacity: overlayOpacity }}
      ></div>

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
          style={{ animation: 'goat-scan-line 4s linear infinite' }}
        ></div>
      </div>
      
      {/* GOAT Logo Watermark */}
      {showGoatLogo && (
        <div className={`absolute ${logoPosition === 'top-right' ? 'top-6 right-6' : 'top-6 left-6'} z-10`}>
          <img 
            src="/images/branding/goat-icon-64.png" 
            alt="GOAT Force" 
            className="w-12 h-12 rounded-lg opacity-40 hover:opacity-80 transition-opacity duration-300"
            style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))' }}
          />
        </div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default EnhancedVideoBackground;