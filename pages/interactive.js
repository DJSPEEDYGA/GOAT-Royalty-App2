/**
 * GOAT Royalty App - Interactive Features Page
 */

import React from 'react';
import InteractiveFeatures from '../components/InteractiveFeatures';
import Head from 'next/head';

const InteractivePage = () => {
  return (
    <>
      <Head>
        <title>Interactive Experience | GOAT Royalty</title>
        <meta name="description" content="Explore interactive features and immersive music experiences." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <InteractiveFeatures />
    </div>
    </>
  );
};

export default InteractivePage;