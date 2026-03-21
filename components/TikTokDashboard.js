/**
 * 🎵 TikTok Dashboard Component
 * Full-featured TikTok analytics dashboard for GOAT Royalty
 * Powered by TikAPI
 */

import React, { useState, useEffect } from 'react';
import {
  Search, TrendingUp, Heart, Eye, MessageCircle, Share2,
  Music, Play, Users, Video, Hash, ExternalLink, RefreshCw,
  CheckCircle, AlertCircle, Clock, Zap
} from 'lucide-react';
import { getUserProfile, getUserVideos, searchHashtag, checkConnection } from '../lib/tiktok';

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return date.toLocaleDateString();
};

const StatCard = ({ icon: Icon, label, value, color = 'text-pink-400', bgColor = 'bg-pink-500/10' }) => (
  <div className={`${bgColor} backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center transition-all hover:scale-105`}>
    <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-black ${color} mt-1`}>{value}</p>
  </div>
);

const VideoCard = ({ video }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all group">
    <div className="aspect-[9/16] bg-gradient-to-br from-pink-900/30 to-purple-900/30 relative flex items-center justify-center">
      {video.cover ? (
        <img src={video.cover} alt={video.desc} className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-4">
          <Play className="w-12 h-12 text-pink-400 mx-auto mb-2 opacity-50" />
          <Music className="w-6 h-6 text-pink-300 mx-auto" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Clock className="w-3 h-3" />
          <span>{video.duration}s</span>
          <span className="ml-auto">{formatDate(video.createTime)}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Play className="w-12 h-12 text-white" />
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{video.desc}</p>
      {video.music && (
        <div className="flex items-center gap-1.5 text-xs text-pink-300 mb-3">
          <Music className="w-3 h-3" />
          <span className="truncate">{video.music.title}</span>
          {video.music.original && (
            <span className="bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded text-[10px] ml-auto shrink-0">
              Original
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1 text-center">
        <div>
          <Eye className="w-3 h-3 text-gray-500 mx-auto" />
          <p className="text-[10px] text-gray-400 mt-0.5">{formatNumber(video.playCount)}</p>
        </div>
        <div>
          <Heart className="w-3 h-3 text-pink-500 mx-auto" />
          <p className="text-[10px] text-gray-400 mt-0.5">{formatNumber(video.diggCount)}</p>
        </div>
        <div>
          <MessageCircle className="w-3 h-3 text-blue-500 mx-auto" />
          <p className="text-[10px] text-gray-400 mt-0.5">{formatNumber(video.commentCount)}</p>
        </div>
        <div>
          <Share2 className="w-3 h-3 text-green-500 mx-auto" />
          <p className="text-[10px] text-gray-400 mt-0.5">{formatNumber(video.shareCount)}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function TikTokDashboard() {
  const [username, setUsername] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [hashtagData, setHashtagData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hashtagLoading, setHashtagLoading] = useState(false);
  const [error, setError] = useState('');
  const [hashtagError, setHashtagError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkConnection().then(status => setConnected(status));
  }, []);

  const fetchProfile = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);
    setVideos([]);
    try {
      const cleanUsername = username.replace('@', '').trim();
      const [profileData, videosData] = await Promise.all([
        getUserProfile(cleanUsername),
        getUserVideos(cleanUsername),
      ]);
      setProfile(profileData);
      setVideos(videosData);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchHashtag = async () => {
    if (!hashtag.trim()) return;
    setHashtagLoading(true);
    setHashtagError('');
    setHashtagData(null);
    try {
      const cleanHashtag = hashtag.replace('#', '').trim();
      const data = await searchHashtag(cleanHashtag);
      setHashtagData(data);
    } catch (err) {
      setHashtagError(err.message || 'Failed to search hashtag');
    } finally {
      setHashtagLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') action();
  };

  // Calculate engagement rate from profile data
  const engagementRate = profile && profile.followers > 0
    ? ((profile.hearts / Math.max(profile.videos, 1)) / profile.followers * 100).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-pink-950/20 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">
                  TikTok <span className="text-pink-400">Analytics</span>
                </h1>
                <p className="text-xs text-gray-500">GOAT Royalty × TikAPI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connected ? (
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> API Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'profile', label: 'Profile Lookup', icon: Users },
            { id: 'hashtag', label: 'Hashtag Search', icon: Hash },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            {/* Search Bar */}
            <div className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter TikTok username (e.g. djspeedy)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, fetchProfile)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/25 transition-all"
                />
              </div>
              <button
                onClick={fetchProfile}
                disabled={loading || !username.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-xl hover:from-pink-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-pink-600/25"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Profile Card */}
            {profile && (
              <div className="space-y-8">
                {profile.isDemo && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Demo mode — showing sample data. Add NEXT_PUBLIC_TIKAPI_KEY to .env.local for live data.
                  </div>
                )}

                {/* Profile Header */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden shrink-0">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black">{profile.nickname?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black">{profile.nickname}</h2>
                        {profile.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-gray-400">@{profile.username}</p>
                      {profile.bio && (
                        <p className="text-gray-300 mt-2 text-sm whitespace-pre-line">{profile.bio}</p>
                      )}
                    </div>
                    <a
                      href={`https://tiktok.com/@${profile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2 shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on TikTok
                    </a>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard icon={Users} label="Followers" value={formatNumber(profile.followers)} />
                  <StatCard icon={Users} label="Following" value={formatNumber(profile.following)} color="text-blue-400" bgColor="bg-blue-500/10" />
                  <StatCard icon={Heart} label="Total Hearts" value={formatNumber(profile.hearts)} color="text-red-400" bgColor="bg-red-500/10" />
                  <StatCard icon={Video} label="Videos" value={formatNumber(profile.videos)} color="text-purple-400" bgColor="bg-purple-500/10" />
                  <StatCard icon={TrendingUp} label="Eng. Rate" value={engagementRate + '%'} color="text-green-400" bgColor="bg-green-500/10" />
                </div>

                {/* Music Royalty Insight */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">GOAT Royalty Insight</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Est. TikTok Revenue</p>
                      <p className="text-xl font-black text-green-400">
                        ${((profile.hearts * 0.00002) + (profile.followers * 0.001)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Based on engagement metrics</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Sound Usage Potential</p>
                      <p className="text-xl font-black text-pink-400">
                        {profile.videos > 200 ? 'High' : profile.videos > 50 ? 'Medium' : 'Growing'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Original sound adoption rate</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Audience Value</p>
                      <p className="text-xl font-black text-purple-400">
                        {profile.followers > 1000000 ? '🔥 Premium' : profile.followers > 100000 ? '⭐ High' : '📈 Growing'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Monetization tier</p>
                    </div>
                  </div>
                </div>

                {/* Videos Grid */}
                {videos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-pink-400" />
                      Recent Videos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!profile && !loading && !error && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <Music className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Search TikTok Profiles</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter a TikTok username to view their profile, analytics, and video performance.
                  Get music royalty insights powered by GOAT Royalty AI.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hashtag Tab */}
        {activeTab === 'hashtag' && (
          <div>
            <div className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter hashtag (e.g. goatroyalty)"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, fetchHashtag)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/25 transition-all"
                />
              </div>
              <button
                onClick={fetchHashtag}
                disabled={hashtagLoading || !hashtag.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-xl hover:from-pink-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-pink-600/25"
              >
                {hashtagLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {hashtagLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {hashtagError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {hashtagError}
              </div>
            )}

            {hashtagData && (
              <div className="space-y-6">
                {hashtagData.isDemo && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Demo mode — showing sample data.
                  </div>
                )}

                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-1">#{hashtagData.title}</h2>
                  {hashtagData.desc && (
                    <p className="text-gray-400 mb-6">{hashtagData.desc}</p>
                  )}
                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                    <StatCard icon={Eye} label="Total Views" value={formatNumber(hashtagData.views)} />
                    <StatCard icon={Video} label="Videos" value={formatNumber(hashtagData.videos)} color="text-purple-400" bgColor="bg-purple-500/10" />
                  </div>
                </div>
              </div>
            )}

            {!hashtagData && !hashtagLoading && !hashtagError && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Search Hashtags</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Discover trending hashtags on TikTok. Track views and video counts
                  to identify the best hashtags for your music promotion.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}