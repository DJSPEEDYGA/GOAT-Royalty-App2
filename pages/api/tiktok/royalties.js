import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return demo data if Supabase not configured
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url';

    if (!hasSupabase) {
      return res.status(200).json({
        success: true,
        demo_mode: true,
        message: 'Supabase not configured — showing demo royalty data',
        summary: {
          total_content_videos: 347,
          eligible_videos: 284,
          total_views: 8036000,
          total_likes: 517800,
          total_comments: 23200,
          total_estimated_royalty: '401.80',
          average_engagement_rate: '6.44',
          royalty_rate_per_view: 0.00005,
          minimum_views_threshold: 1000,
        },
        monthly_breakdown: [
          { month: '2025-03', total_views: 2840000, total_likes: 184200, total_royalty: '142.00', video_count: 12, avg_engagement_rate: '6.49' },
          { month: '2025-02', total_views: 3196000, total_likes: 206800, total_royalty: '159.80', video_count: 18, avg_engagement_rate: '6.47' },
          { month: '2025-01', total_views: 2000000, total_likes: 126800, total_royalty: '100.00', video_count: 14, avg_engagement_rate: '6.34' }
        ],
        top_performing_videos: [
          { title: 'Waka Flocka - Flame On 🔥', views: 2840000, estimated_royalty: '142.00', engagement_rate: '6.49' },
          { title: 'DJ Speedy in the studio 🎧', views: 1920000, estimated_royalty: '96.00', engagement_rate: '6.50' },
          { title: 'GOAT Force - New Heat 🐐', views: 1540000, estimated_royalty: '77.00', engagement_rate: '6.38' }
        ],
        last_updated: new Date().toISOString()
      });
    }

    // Get Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user's TikTok content
    const { data: tiktokContent, error: contentError } = await supabase
      .from('tiktok_content')
      .select('*')
      .eq('user_id', user.id)
      .order('posted_at', { ascending: false });

    if (contentError) {
      return res.status(500).json({ error: 'Failed to fetch TikTok content' });
    }

    // Get existing royalty records
    const { data: existingRoyalties, error: royaltyError } = await supabase
      .from('tiktok_royalties')
      .select('*')
      .eq('user_id', user.id)
      .order('period_end', { ascending: false });

    if (royaltyError) {
      return res.status(500).json({ error: 'Failed to fetch royalty records' });
    }

    // Calculate royalties for content without royalty records
    const royaltyCalculations = [];
    const totalViews = tiktokContent?.reduce((sum, content) => sum + (content.views_count || 0), 0) || 0;
    
    // TikTok Creator Fund rates (example values - these would need to be updated based on actual rates)
    const ROYALTY_RATE_PER_VIEW = 0.0005; // $0.0005 per view (example)
    const MIN_VIEWS_THRESHOLD = 1000; // Minimum views to qualify for royalties
    
    for (const content of tiktokContent || []) {
      const views = content.views_count || 0;
      
      if (views >= MIN_VIEWS_THRESHOLD) {
        const estimatedRoyalty = views * ROYALTY_RATE_PER_VIEW;
        const engagementScore = (content.likes_count || 0) * 0.01 + (content.comments_count || 0) * 0.05;
        const adjustedRoyalty = estimatedRoyalty + (engagementScore * 0.0001);
        
        royaltyCalculations.push({
          content_id: content.id,
          tiktok_video_id: content.tiktok_video_id,
          title: content.title,
          views: views,
          likes: content.likes_count || 0,
          comments: content.comments_count || 0,
          shares: content.shares_count || 0,
          estimated_royalty: adjustedRoyalty.toFixed(2),
          engagement_rate: views > 0 ? ((content.likes_count || 0) / views * 100).toFixed(2) : 0,
          posted_at: content.posted_at,
        });
      }
    }

    // Calculate monthly summaries
    const monthlyRoyalties = {};
    
    royaltyCalculations.forEach(calculation => {
      const postedDate = new Date(calculation.posted_at);
      const monthKey = `${postedDate.getFullYear()}-${(postedDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyRoyalties[monthKey]) {
        monthlyRoyalties[monthKey] = {
          month: monthKey,
          total_views: 0,
          total_likes: 0,
          total_comments: 0,
          total_royalty: 0,
          video_count: 0,
          avg_engagement_rate: 0,
        };
      }
      
      monthlyRoyalties[monthKey].total_views += calculation.views;
      monthlyRoyalties[monthKey].total_likes += calculation.likes;
      monthlyRoyalties[monthKey].total_comments += calculation.comments;
      monthlyRoyalties[monthKey].total_royalty += parseFloat(calculation.estimated_royalty);
      monthlyRoyalties[monthKey].video_count += 1;
    });

    // Calculate average engagement rates
    Object.keys(monthlyRoyalties).forEach(month => {
      const data = monthlyRoyalties[month];
      if (data.total_views > 0) {
        data.avg_engagement_rate = ((data.total_likes / data.total_views) * 100).toFixed(2);
      }
      data.total_royalty = data.total_royalty.toFixed(2);
    });

    // Calculate totals
    const totalEstimatedRoyalty = royaltyCalculations.reduce(
      (sum, calc) => sum + parseFloat(calc.estimated_royalty), 
      0
    );

    const totalEligibleVideos = royaltyCalculations.length;
    const totalLikes = royaltyCalculations.reduce((sum, calc) => sum + calc.likes, 0);
    const totalComments = royaltyCalculations.reduce((sum, calc) => sum + calc.comments, 0);
    const averageEngagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0;

    // Get top performing videos
    const topVideos = royaltyCalculations
      .sort((a, b) => parseFloat(b.estimated_royalty) - parseFloat(a.estimated_royalty))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      summary: {
        total_content_videos: tiktokContent?.length || 0,
        eligible_videos: totalEligibleVideos,
        total_views: totalViews,
        total_likes: totalLikes,
        total_comments: totalComments,
        total_estimated_royalty: totalEstimatedRoyalty.toFixed(2),
        average_engagement_rate: averageEngagementRate,
        royalty_rate_per_view: ROYALTY_RATE_PER_VIEW,
        minimum_views_threshold: MIN_VIEWS_THRESHOLD,
      },
      monthly_breakdown: Object.values(monthlyRoyalties),
      top_performing_videos: topVideos,
      all_calculations: royaltyCalculations,
      existing_records: existingRoyalties || [],
      last_updated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('TikTok royalties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}