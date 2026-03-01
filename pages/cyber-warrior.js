/**
 * 🛡️ CyberWarrior Agent — GOAT Royalty Cyber Defense System
 * Advanced Cybersecurity AI with Offensive & Defensive Capabilities
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';

const CyberWarriorAgent = dynamic(() => import('../components/CyberWarriorAgent'), { ssr: false });

export default function CyberWarriorPage() {
  return (
    <>
      <Head>
        <title>CyberWarrior Agent | GOAT Royalty Cyber Defense</title>
        <meta name="description" content="CyberWarrior Agent — Advanced cybersecurity AI with deadly force authorization. Protects GOAT Royalty with offensive and defensive cyber capabilities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CyberWarriorAgent />
    </>
  );
}