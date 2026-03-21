/**
 * TikAPI Service - Direct TikTok Data Access
 * =============================================
 * Uses the TikAPI package for direct TikTok data access
 * without requiring OAuth. Supports profile lookups,
 * video fetching, hashtag search, and analytics.
 * 
 * Requires: TIKAPI_KEY environment variable
 * Package: tikapi (npm install tikapi)
 * 
 * © 2025 GOAT Royalty App / FASTASSMAN Publishing Inc
 */

let TikAPI = null;
let apiInstance = null;

/**
 * Initialize TikAPI with the API key
 */
export async function initTikAPI(apiKey) {
  try {
    if (!apiKey) {
      console.warn('[TikAPI] No API key provided');
      return null;
    }
    
    // Dynamic import to avoid build issues if package isn't installed
    const tikApiModule = await import('tikapi');
    TikAPI = tikApiModule.default || tikApiModule;
    apiInstance = TikAPI(apiKey);
    console.log('[TikAPI] Initialized successfully');
    return apiInstance;
  } catch (err) {
    console.error('[TikAPI] Init error:', err.message);
    return null;
  }
}

/**
 * Get or create the TikAPI instance
 */
async function getAPI() {
  if (apiInstance) return apiInstance;
  
  const key = process.env.TIKAPI_KEY || process.env.NEXT_PUBLIC_TIKAPI_KEY || process.env.REACT_APP_TIKAPI_KEY;
  if (!key) return null;
  
  return await initTikAPI(key);
}

/**
 * Get a TikTok user's profile by username
 */
export async function getUserProfile(username) {
  const api = await getAPI();
  if (!api) {
    return getDemoProfile(username);
  }
  
  try {
    const response = await api.public.profile({ username });
    const userInfo = response.json?.userInfo;
    
    if (!userInfo) {
      throw new Error('No user info returned');
    }
    
    return {
      id: userInfo.user?.id,
      username: userInfo.user?.uniqueId,
      nickname: userInfo.user?.nickname,
      followers: userInfo.stats?.followerCount || 0,
      following: userInfo.stats?.followingCount || 0,
      hearts: userInfo.stats?.heartCount || 0,
      videoCount: userInfo.stats?.videoCount || 0,
      bio: userInfo.user?.signature || '',
      avatar: userInfo.user?.avatarMedium || userInfo.user?.avatarLarger || '',
      verified: userInfo.user?.verified || false,
      privateAccount: userInfo.user?.privateAccount || false,
      source: 'tikapi'
    };
  } catch (err) {
    console.error('[TikAPI] Profile error:', err.message);
    return getDemoProfile(username);
  }
}

/**
 * Get a user's recent videos
 */
export async function getUserVideos(username, count = 20) {
  const api = await getAPI();
  if (!api) {
    return getDemoVideos(username);
  }
  
  try {
    const response = await api.public.posts({ username, count });
    const items = response.json?.itemList || [];
    
    return items.map(item => ({
      id: item.id,
      title: item.desc || 'Untitled',
      views: item.stats?.playCount || 0,
      likes: item.stats?.diggCount || 0,
      comments: item.stats?.commentCount || 0,
      shares: item.stats?.shareCount || 0,
      duration: item.video?.duration || 0,
      createTime: item.createTime,
      cover: item.video?.cover || '',
      music: {
        title: item.music?.title || '',
        author: item.music?.authorName || '',
        album: item.music?.album || '',
        isOriginal: item.music?.original || false
      },
      source: 'tikapi'
    }));
  } catch (err) {
    console.error('[TikAPI] Videos error:', err.message);
    return getDemoVideos(username);
  }
}

/**
 * Search by hashtag
 */
export async function searchHashtag(hashtag, count = 20) {
  const api = await getAPI();
  if (!api) {
    return { hashtag, videos: [], source: 'demo' };
  }
  
  try {
    const response = await api.public.hashtag({ name: hashtag, count });
    const items = response.json?.itemList || [];
    
    return {
      hashtag,
      videos: items.map(item => ({
        id: item.id,
        title: item.desc || '',
        views: item.stats?.playCount || 0,
        likes: item.stats?.diggCount || 0,
        author: item.author?.uniqueId || '',
        music: item.music?.title || '',
        source: 'tikapi'
      })),
      source: 'tikapi'
    };
  } catch (err) {
    console.error('[TikAPI] Hashtag search error:', err.message);
    return { hashtag, videos: [], source: 'demo', error: err.message };
  }
}

/**
 * Search for music/sounds
 */
export async function searchMusic(query, count = 20) {
  const api = await getAPI();
  if (!api) {
    return { query, results: [], source: 'demo' };
  }
  
  try {
    const response = await api.public.musicSearch({ query, count });
    const items = response.json?.data || [];
    
    return {
      query,
      results: items.map(item => ({
        id: item.id,
        title: item.title || '',
        author: item.authorName || '',
        duration: item.duration || 0,
        videoCount: item.userCount || 0,
        source: 'tikapi'
      })),
      source: 'tikapi'
    };
  } catch (err) {
    console.error('[TikAPI] Music search error:', err.message);
    return { query, results: [], source: 'demo', error: err.message };
  }
}

/**
 * Calculate estimated TikTok royalties for a track
 */
export function calculateTikTokRoyalties(videoCount, avgViews = 10000) {
  const TIKTOK_RATE = 0.00015; // per stream/use
  const CREATOR_FUND_RATE = 0.03; // per 1000 views
  
  const estimatedUses = videoCount;
  const estimatedTotalViews = videoCount * avgViews;
  
  return {
    estimatedUses,
    estimatedTotalViews,
    soundRoyalties: +(estimatedUses * TIKTOK_RATE).toFixed(2),
    creatorFundEstimate: +(estimatedTotalViews / 1000 * CREATOR_FUND_RATE).toFixed(2),
    totalEstimate: +((estimatedUses * TIKTOK_RATE) + (estimatedTotalViews / 1000 * CREATOR_FUND_RATE)).toFixed(2),
    rates: {
      perUse: TIKTOK_RATE,
      creatorFundPer1K: CREATOR_FUND_RATE
    }
  };
}

// ============================================================
// DEMO DATA FALLBACKS
// ============================================================

function getDemoProfile(username) {
  return {
    id: 'demo_' + (username || 'goatforce'),
    username: username || 'goatforce_official',
    nickname: username ? `@${username}` : 'GOAT Force Entertainment',
    followers: 284500,
    following: 412,
    hearts: 1820000,
    videoCount: 347,
    bio: '🐐 Official GOAT Force Entertainment | Music • Culture • Innovation | CEO: DJ Speedy | President: Waka Flocka Flame',
    avatar: '',
    verified: true,
    privateAccount: false,
    source: 'demo'
  };
}

function getDemoVideos(username) {
  return [
    {
      id: 'demo_v1',
      title: '🔥 New track dropping soon! #goatforce #newmusic #trap',
      views: 2840000,
      likes: 184200,
      comments: 8420,
      shares: 42100,
      duration: 45,
      createTime: Date.now() / 1000 - 86400,
      cover: '',
      music: { title: 'CANT FUCK WITH ME', author: 'DJ Speedy', album: 'FIVE DEUCES', isOriginal: true },
      source: 'demo'
    },
    {
      id: 'demo_v2',
      title: 'Studio session with @wakaflocka 🐐 #goatforce #studio',
      views: 1950000,
      likes: 142000,
      comments: 6200,
      shares: 31000,
      duration: 60,
      createTime: Date.now() / 1000 - 172800,
      cover: '',
      music: { title: 'ROYALTY FLOW', author: 'DJ Speedy ft. Waka Flocka', album: 'FIVE DEUCES II', isOriginal: true },
      source: 'demo'
    },
    {
      id: 'demo_v3',
      title: 'When the beat hits different 🎵 #producer #beatmaking',
      views: 1200000,
      likes: 98000,
      comments: 4100,
      shares: 18500,
      duration: 30,
      createTime: Date.now() / 1000 - 259200,
      cover: '',
      music: { title: 'BLUE GOAT', author: 'DJ Speedy', album: 'FIVE DEUCES III', isOriginal: true },
      source: 'demo'
    },
    {
      id: 'demo_v4',
      title: 'GOAT Force AI is changing the music game 🤖 #ai #musictech',
      views: 890000,
      likes: 72000,
      comments: 3200,
      shares: 15000,
      duration: 55,
      createTime: Date.now() / 1000 - 345600,
      cover: '',
      music: { title: 'NERD BITCH', author: 'DJ Speedy ft. Gucci Mane', album: 'FIVE DEUCES IV', isOriginal: true },
      source: 'demo'
    },
    {
      id: 'demo_v5',
      title: 'Behind the scenes at FASTASSMAN HQ 🏢 #bts #musicbusiness',
      views: 650000,
      likes: 54000,
      comments: 2800,
      shares: 11000,
      duration: 90,
      createTime: Date.now() / 1000 - 432000,
      cover: '',
      music: { title: 'AFTER DARK', author: 'DJ Speedy', album: 'FIVE DEUCES', isOriginal: true },
      source: 'demo'
    }
  ];
}