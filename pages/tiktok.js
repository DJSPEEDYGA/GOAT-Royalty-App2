/**
 * 🎵 TikTok Analytics Page
 * /tiktok
 * 
 * TikTok profile lookup, video analytics, and hashtag search
 * Powered by TikAPI integration
 */

import Head from 'next/head';
import TikTokDashboard from '../components/TikTokDashboard';

export default function TikTokPage() {
  return (
    <>
      <Head>
        <title>TikTok Analytics | GOAT Royalty</title>
        <meta name="description" content="TikTok profile analytics, video performance tracking, and hashtag search for music promotion." />
      </Head>
      <TikTokDashboard />
    </>
  );
}