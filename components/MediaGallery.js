/**
 * GOAT Royalty App - Media Gallery Component
 * Interactive gallery with custom videos and images
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const MediaGallery = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());
  const videoRef = useRef(null);

  // Custom media collection with superhero goat theme
  const mediaCollection = [
    {
      id: 1,
      type: 'video',
      title: "GOAT Hero - Origin Story",
      description: "The legendary tale of how the GOAT became music royalty",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "2:45",
      views: "125K",
      likes: "8.2K"
    },
    {
      id: 2,
      type: 'image',
      title: "GOAT Supreme - Official Artwork",
      description: "Limited edition superhero artwork",
      imageSrc: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop",
      views: "89K",
      likes: "6.1K"
    },
    {
      id: 3,
      type: 'video',
      title: "Royalty Records - Studio Session",
      description: "Behind the scenes at the GOAT studio",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      duration: "3:12",
      views: "203K",
      likes: "12.5K"
    },
    {
      id: 4,
      type: 'image',
      title: "The Gangsta Nerds - Team Photo",
      description: "Music superheroes assembled",
      imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      views: "156K",
      likes: "9.8K"
    },
    {
      id: 5,
      type: 'video',
      title: "Waka x GOAT - Epic Collab",
      description: "The collaboration that changed the game",
      thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=450&fit=crop",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      duration: "4:08",
      views: "342K",
      likes: "18.7K"
    }
  ];

  const currentMedia = mediaCollection[currentMediaIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = () => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(currentMedia.id)) {
      newLiked.delete(currentMedia.id);
    } else {
      newLiked.add(currentMedia.id);
    }
    setLikedItems(newLiked);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateMedia = (direction) => {
    if (direction === 'next') {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaCollection.length);
    } else {
      setCurrentMediaIndex((prev) => (prev - 1 + mediaCollection.length) % mediaCollection.length);
    }
    setIsPlaying(false);
  };

  const shareMedia = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMedia.title,
        text: currentMedia.description,
        url: window.location.href
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') navigateMedia('prev');
      if (e.key === 'ArrowRight') navigateMedia('next');
      if (e.key === ' ') togglePlay();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMediaIndex, isPlaying]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            GOAT Media Gallery
          </span>
        </h2>
        <p className="text-white/70">Exclusive videos and artwork from the GOAT universe</p>
      </div>

      {/* Main Media Display */}
      <div className="relative bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl">
        {currentMedia.type === 'video' ? (
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={currentMedia.thumbnail}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={currentMedia.videoSrc} type="video/mp4" />
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleLike}
                      className={`p-2 backdrop-blur-md rounded-full transition-all ${
                        likedItems.has(currentMedia.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedItems.has(currentMedia.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={shareMedia}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
                    >
                      <Maximize className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video">
            <img
              src={currentMedia.imageSrc}
              alt={currentMedia.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="text-white text-sm">HD Image</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <button
          onClick={() => navigateMedia('prev')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => navigateMedia('next')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Media Information */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentMedia.title}</h3>
            <p className="text-white/70 mb-4">{currentMedia.description}</p>
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>{currentMedia.views} views</span>
              <span>{currentMedia.likes} likes</span>
              {currentMedia.duration && <span>{currentMedia.duration}</span>}
            </div>
          </div>
          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-4">
        {mediaCollection.map((media, index) => (
          <button
            key={media.id}
            onClick={() => setCurrentMediaIndex(index)}
            className={`relative rounded-lg overflow-hidden transition-all ${
              index === currentMediaIndex
                ? 'ring-2 ring-purple-500 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <img
              src={media.type === 'video' ? media.thumbnail : media.imageSrc}
              alt={media.title}
              className="w-full h-24 object-cover"
            />
            {media.type === 'video' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}
            {index === currentMediaIndex && (
              <div className="absolute inset-0 ring-2 ring-purple-500 pointer-events-none"></div>
            )}
          </button>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-8 text-center text-white/60 text-sm">
        <p>Keyboard shortcuts: ← → Navigate | Space Play/Pause</p>
      </div>
    </div>
  );
};

export default MediaGallery;