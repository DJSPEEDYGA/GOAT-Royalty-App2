/**
 * TikTok Hashtag Search API Route
 * GET /api/tiktok/hashtag?name=<hashtag>
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

  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Hashtag name is required' });
  }

  const client = await getApi();
  if (!client) {
    return res.status(503).json({ error: 'TikAPI not configured' });
  }

  try {
    const cleanName = name.replace('#', '');
    const response = await client.public.hashtag({ name: cleanName });
    const challenge = response.json.challengeInfo;
    return res.status(200).json({
      id: challenge.challenge.id,
      title: challenge.challenge.title,
      desc: challenge.challenge.desc,
      views: challenge.stats.viewCount,
      videos: challenge.stats.videoCount,
    });
  } catch (err) {
    console.error('TikAPI hashtag error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to search hashtag' });
  }
}