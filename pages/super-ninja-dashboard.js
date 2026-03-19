// Super Ninja Dashboard — redirects to OpenClaw AI
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';

export default function SuperNinjaDashboard() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/openclaw')
  }, [router])

  return (
    <>
    <Head>
      <title>Super Ninja Dashboard | GOAT Royalty</title>
      <meta name="description" content="Advanced AI-powered command center with full platform controls." />
    </Head>
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🥷</div>
        <p style={{ color: '#888' }}>Loading Super Ninja Dashboard...</p>
      </div>
    </div>
    </>
  )
}