/**
 * TikTok Profile API - Direct TikAPI Access
 * ============================================
 * Fetches TikTok profiles and videos using TikAPI package.
 * Falls back to demo data when API key isn't configured.
 * 
 * GET /api/tiktok/profile?username=djspeedy
 * GET /api/tiktok/profile?username=djspeedy&videos=true
 * GET /api/tiktok/profile?hashtag=goatforce
 * GET /api/tiktok/profile?music=five+deuces
 * GET /api/tiktok/profile?username=djspeedy&royalties=true
 * 
 * © 2025 GOAT Royalty App / FASTASSMAN Publishing Inc
 */

import { 
  getUserProfile, 
  getUserVideos, 
  searchHashtag, 
  searchMusic,
  calculateTikTokRoyalties 
} from '../../../lib/tiktok/tikapi-service';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, videos, hashtag, music, royalties, count = '20' } = req.query;
    const numCount = Math.min(50, Math.max(1, parseInt(count) || 20));

    // Hashtag search
    if (hashtag) {
      const results = await searchHashtag(hashtag, numCount);
      return res.status(200).json({
        success: true,
        type: 'hashtag',
        data: results
      });
    }

    // Music/sound search
    if (music) {
      const results = await searchMusic(music, numCount);
      return res.status(200).json({
        success: true,
        type: 'music',
        data: results
      });
    }

    // Username required for profile/videos/royalties
    if (!username) {
      return res.status(200).json({
        success: true,
        message: 'TikTok API powered by TikAPI',
        endpoints: {
          profile: '/api/tiktok/profile?username=djspeedy',
          withVideos: '/api/tiktok/profile?username=djspeedy&videos=true',
          withRoyalties: '/api/tiktok/profile?username=djspeedy&royalties=true',
          hashtag: '/api/tiktok/profile?hashtag=goatforce',
          music: '/api/tiktok/profile?music=five+deuces'
        },
        apiConfigured: !!(process.env.TIKAPI_KEY || process.env.NEXT_PUBLIC_TIKAPI_KEY)
      });
    }

    // Fetch profile
    const profile = await getUserProfile(username);
    const response = {
      success: true,
      type: 'profile',
      data: { profile }
    };

    // Optionally include videos
    if (videos === 'true') {
      const userVideos = await getUserVideos(username, numCount);
      response.data.videos = userVideos;
      response.data.videoCount = userVideos.length;
    }

    // Optionally calculate royalties
    if (royalties === 'true') {
      const royaltyEstimate = calculateTikTokRoyalties(
        profile.videoCount || 347,
        profile.hearts ? Math.round(profile.hearts / (profile.videoCount || 1)) : 10000
      );
      response.data.royaltyEstimate = royaltyEstimate;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('[TikTok Profile API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch TikTok data',
      details: error.message
    });
  }
}