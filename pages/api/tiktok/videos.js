/**
 * GOAT Royalty App - TikTok Videos API
 * Returns demo data when TikTok OAuth is not configured
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if TikTok OAuth is configured
    const hasTikTokConfig = process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET;
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!hasTikTokConfig || !hasSupabase) {
      // Return demo data when OAuth not configured
      return res.status(200).json({
        success: true,
        demo_mode: true,
        message: 'TikTok OAuth not configured — showing demo data',
        account: {
          username: '@goatforce_official',
          display_name: 'GOAT Force Entertainment',
          followers: 284500,
          following: 412,
          likes: 1820000,
          video_count: 347,
          verified: true
        },
        videos: [
          {
            id: 'tt_001',
            title: 'Waka Flocka - Flame On 🔥 #goatforce #trap',
            views: 2840000,
            likes: 184200,
            comments: 8420,
            shares: 42100,
            duration: 45,
            posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: null,
            url: 'https://tiktok.com/@goatforce_official',
            estimated_royalty: '142.00',
            engagement_rate: '6.49'
          },
          {
            id: 'tt_002',
            title: 'DJ Speedy in the studio 🎧 #djspeedy #goatforce',
            views: 1920000,
            likes: 124800,
            comments: 5640,
            shares: 28900,
            duration: 30,
            posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: null,
            url: 'https://tiktok.com/@goatforce_official',
            estimated_royalty: '96.00',
            engagement_rate: '6.50'
          },
          {
            id: 'tt_003',
            title: 'GOAT Force - New Heat 🐐 #bricksquad #atlanta',
            views: 1540000,
            likes: 98200,
            comments: 4120,
            shares: 21800,
            duration: 60,
            posted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: null,
            url: 'https://tiktok.com/@goatforce_official',
            estimated_royalty: '77.00',
            engagement_rate: '6.38'
          },
          {
            id: 'tt_004',
            title: 'Behind the scenes - Sono Studio session 🎹',
            views: 980000,
            likes: 62400,
            comments: 2840,
            shares: 14200,
            duration: 90,
            posted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: null,
            url: 'https://tiktok.com/@goatforce_official',
            estimated_royalty: '49.00',
            engagement_rate: '6.37'
          },
          {
            id: 'tt_005',
            title: 'FASTASSMAN Publishing - Royalty Check Day 💰',
            views: 756000,
            likes: 48200,
            comments: 2180,
            shares: 10800,
            duration: 28,
            posted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: null,
            url: 'https://tiktok.com/@goatforce_official',
            estimated_royalty: '37.80',
            engagement_rate: '6.38'
          }
        ],
        summary: {
          total_videos: 347,
          total_views: 8036000,
          total_likes: 517800,
          total_comments: 23200,
          total_shares: 117800,
          total_estimated_royalty: '401.80',
          avg_engagement_rate: '6.42',
          top_performing: 'Waka Flocka - Flame On 🔥'
        },
        setup_instructions: {
          step1: 'Register app at https://developers.tiktok.com',
          step2: 'Add TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET to .env.local',
          step3: 'Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
          step4: 'Users authenticate via /api/tiktok/auth endpoint'
        }
      });
    }

    // Full OAuth flow when configured
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { autoRefreshToken: false } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data: tiktokAccount, error: accountError } = await supabase
      .from('tiktok_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !tiktokAccount) {
      return res.status(404).json({ error: 'TikTok account not connected. Please connect your TikTok account first.' });
    }

    // Fetch videos from TikTok API
    const videosResponse = await fetch('https://open.tiktokapis.com/v2/video/list/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tiktokAccount.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        max_count: 20,
        fields: ['id', 'title', 'video_description', 'duration', 'cover_image_url', 'share_url', 'view_count', 'like_count', 'comment_count', 'share_count', 'create_time']
      })
    });

    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch TikTok videos', details: videosData });
    }

    const videos = (videosData.data?.videos || []).map(v => ({
      id: v.id,
      title: v.title || v.video_description,
      views: v.view_count || 0,
      likes: v.like_count || 0,
      comments: v.comment_count || 0,
      shares: v.share_count || 0,
      duration: v.duration,
      posted_at: new Date(v.create_time * 1000).toISOString(),
      thumbnail: v.cover_image_url,
      url: v.share_url,
      estimated_royalty: ((v.view_count || 0) * 0.00005).toFixed(2),
      engagement_rate: v.view_count > 0 ? ((v.like_count / v.view_count) * 100).toFixed(2) : '0'
    }));

    return res.status(200).json({
      success: true,
      demo_mode: false,
      videos,
      total: videos.length
    });

  } catch (error) {
    console.error('TikTok videos API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}