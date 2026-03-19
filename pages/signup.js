// Signup Page — redirects to login with signup mode active
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // The login page handles both login and signup
    router.replace('/login?mode=signup')
  }, [router])

  return (
    <>
    <Head>
      <title>Sign Up | GOAT Royalty</title>
      <meta name="description" content="Create your GOAT Royalty account and start managing your royalties." />
    </Head>
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🐐</div>
        <p style={{ color: '#888' }}>Redirecting to signup...</p>
      </div>
    </div>
    </>
  )
}