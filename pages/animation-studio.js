/**
 * 🎬 Animation Studio Page
 * GOAT Force Animation & 3D Character Studio
 */
import GOATAnimationStudio from '../components/GOATAnimationStudio';
import Head from 'next/head';

export default function AnimationStudioPage() {
  return (
    <>
      <Head>
        <title>Animation Studio | GOAT Royalty</title>
        <meta name="description" content="Create stunning animations and visual content for your music brand." />
      </Head>
      <GOATAnimationStudio />
    </>
  );
}