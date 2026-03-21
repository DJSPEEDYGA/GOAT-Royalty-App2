/**
 * TikTok Profile API Route
 * GET /api/tiktok/profile?username=<username>
 * 
 * Server-side proxy to TikAPI to avoid client-side Node.js module issues
 */

let TikAPI = null;
let api = null;

async function getApi() {
  const key = process.env.TIKAPI_KEY || process.env.NEXT_PUBLIC_TIKAPI_KEY;
  if (!key) return null;
  if (api) return api;
  try {
    const mod = await import('tikapi');
    TikAPI = mod.default || mod;
    api = TikAPI(key);
    return api;
  } catch (err) {
    console.error('Failed to init TikAPI:', err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const client = await getApi();
  if (!client) {
    return res.status(503).json({ error: 'TikAPI not configured. Add TIKAPI_KEY to .env.local' });
  }

  try {
    const response = await client.public.profile({ username: username.replace('@', '') });
    const userInfo = response.json.userInfo;
    return res.status(200).json({
      id: userInfo.user.id,
      username: userInfo.user.uniqueId,
      nickname: userInfo.user.nickname,
      followers: userInfo.stats.followerCount,
      following: userInfo.stats.followingCount,
      hearts: userInfo.stats.heartCount,
      videos: userInfo.stats.videoCount,
      bio: userInfo.user.signature,
      avatar: userInfo.user.avatarMedium,
      verified: userInfo.user.verified || false,
    });
  } catch (err) {
    console.error('TikAPI profile error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to fetch profile' });
  }
}