import VoiceStudio from '../components/VoiceStudio';
import Head from 'next/head';

export default function VoiceStudioPage() {
  return (
    <>
      <Head>
        <title>Voice Studio | GOAT Royalty</title>
        <meta name="description" content="AI voice synthesis, cloning, and audio production tools." />
      </Head>
      <VoiceStudio />
    </>
  );
}