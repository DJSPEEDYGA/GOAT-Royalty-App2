/**
 * GOAT Royalty App - Streaming Integration Page
 */

import React from 'react';
import StreamingIntegration from '../components/StreamingIntegration';
import Head from 'next/head';

const StreamingPage = () => {
  return (
    <>
      <Head>
        <title>Streaming | GOAT Royalty</title>
        <meta name="description" content="Monitor streaming performance across all major platforms." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <StreamingIntegration />
    </div>
    </>
  );
};

export default StreamingPage;