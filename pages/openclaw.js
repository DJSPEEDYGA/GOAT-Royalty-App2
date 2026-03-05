/**
 * 🦞 OpenClaw Local LLM Studio — GOAT Royalty App
 * Personal AI Assistant with Local Language Models
 * UPGRADED to OpenClaw v2026.3.2 (262K+ stars)
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';

const OpenClawStudio = dynamic(() => import('../components/OpenClawStudio'), { ssr: false });

export default function OpenClawPage() {
  return (
    <>
      <Head>
        <title>OpenClaw AI Studio v2026.3.2 | GOAT Royalty</title>
        <meta name="description" content="OpenClaw Local LLM Studio v2026.3.2 — PDF Analysis, SecretRef Vault, sendPayload adapters, MiniMax M2.5. Run AI models locally with full privacy. Powered by Ollama, integrated into GOAT Royalty." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <OpenClawStudio />
    </>
  );
}