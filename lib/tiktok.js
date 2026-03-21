/**
 * 🎵 TikTok Integration - Client-Side Service
 * 
 * Calls our own API routes which proxy to TikAPI server-side.
 * Falls back to demo data when API is not configured.
 */

/**
 * Get a TikTok user profile by username
 * @param {string} username - TikTok username (without @)
 */
export const getUserProfile = async (username) => {
  try {
    const res = await fetch(`/api/tiktok/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  } catch (err) {
    console.warn('TikTok API unavailable, using demo data:', err.message);
    return getDemoProfile(username);
  }
};

/**
 * Get a user's recent videos
 * @param {string} username - TikTok username
 */
export const getUserVideos = async (username) => {
  try {
    const res = await fetch(`/api/tiktok/videos?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch videos');
    return data;
  } catch (err) {
    console.warn('TikTok videos API unavailable, using demo data:', err.message);
    return getDemoVideos(username);
  }
};

/**
 * Search TikTok by hashtag
 * @param {string} hashtag - Hashtag to search (without #)
 */
export const searchHashtag = async (hashtag) => {
  try {
    const res = await fetch(`/api/tiktok/hashtag?name=${encodeURIComponent(hashtag)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to search hashtag');
    return data;
  } catch (err) {
    console.warn('TikTok hashtag API unavailable, using demo data:', err.message);
    return getDemoHashtag(hashtag);
  }
};

/**
 * Check connection status
 */
export const checkConnection = async () => {
  try {
    const res = await fetch('/api/tiktok/status');
    const data = await res.json();
    return data.connected || false;
  } catch {
    return false;
  }
};

// ═══════════ DEMO DATA (when API is not available) ═══════════

const getDemoProfile = (username) => ({
  id: 'demo-' + username,
  username: username,
  nickname: username.charAt(0).toUpperCase() + username.slice(1),
  followers: 1250000,
  following: 342,
  hearts: 45600000,
  videos: 287,
  bio: '🎵 Music Producer | 🐐 GOAT Royalty Artist\n📀 New single dropping soon!\n🔗 linktr.ee/' + username,
  avatar: '',
  verified: true,
  isDemo: true,
});

const getDemoVideos = (username) => [
  {
    id: 'demo-1',
    desc: '🔥 New beat drop! Check out this fire track #music #producer #goatroyalty',
    createTime: Math.floor(Date.now() / 1000) - 86400,
    duration: 15,
    cover: '',
    playCount: 2500000,
    diggCount: 450000,
    commentCount: 12000,
    shareCount: 35000,
    music: { title: 'Original Sound', author: username, original: true },
  },
  {
    id: 'demo-2',
    desc: 'Studio session vibes 🎶 #studiolife #recording #hiphop',
    createTime: Math.floor(Date.now() / 1000) - 172800,
    duration: 30,
    cover: '',
    playCount: 1800000,
    diggCount: 320000,
    commentCount: 8500,
    shareCount: 22000,
    music: { title: 'Beat Tape Vol. 3', author: username, original: true },
  },
  {
    id: 'demo-3',
    desc: 'When the royalty check hits different 💰 #royalties #musicbusiness',
    createTime: Math.floor(Date.now() / 1000) - 259200,
    duration: 12,
    cover: '',
    playCount: 3200000,
    diggCount: 680000,
    commentCount: 25000,
    shareCount: 45000,
    music: { title: 'Money Moves', author: username, original: true },
  },
  {
    id: 'demo-4',
    desc: 'Behind the scenes of the music video 🎬 #bts #musicvideo',
    createTime: Math.floor(Date.now() / 1000) - 345600,
    duration: 45,
    cover: '',
    playCount: 950000,
    diggCount: 180000,
    commentCount: 5200,
    shareCount: 12000,
    music: { title: 'Cinematic Beat', author: username, original: true },
  },
];

const getDemoHashtag = (hashtag) => ({
  id: 'demo-hashtag',
  title: hashtag,
  desc: 'Trending music hashtag',
  views: 15700000000,
  videos: 4200000,
  isDemo: true,
});