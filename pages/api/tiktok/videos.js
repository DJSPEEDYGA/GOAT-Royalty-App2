/**
 * TikTok Videos API Route
 * GET /api/tiktok/videos?username=<username>
 * 
 * Server-side proxy to TikAPI
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
    return res.status(503).json({ error: 'TikAPI not configured' });
  }

  try {
    const cleanUsername = username.replace('@', '');
    const profile = await client.public.profile({ username: cleanUsername });
    const secUid = profile.json.userInfo.user.secUid;
    const response = await client.public.posts({ secUid, count: 12 });
    
    const videos = (response.json.itemList || []).map(video => ({
      id: video.id,
      desc: video.desc,
      createTime: video.createTime,
      duration: video.video?.duration || 0,
      cover: video.video?.cover || '',
      playCount: video.stats?.playCount || 0,
      diggCount: video.stats?.diggCount || 0,
      commentCount: video.stats?.commentCount || 0,
      shareCount: video.stats?.shareCount || 0,
      music: video.music ? {
        title: video.music.title,
        author: video.music.authorName,
        original: video.music.original,
      } : null,
    }));

    return res.status(200).json(videos);
  } catch (err) {
    console.error('TikAPI videos error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to fetch videos' });
  }
}