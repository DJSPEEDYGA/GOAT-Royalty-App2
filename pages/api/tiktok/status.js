/**
 * TikTok API Status Check
 * GET /api/tiktok/status
 * 
 * Returns whether TikAPI is configured and available
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.TIKAPI_KEY || process.env.NEXT_PUBLIC_TIKAPI_KEY;
  return res.status(200).json({
    connected: !!key,
    provider: 'tikapi',
  });
}