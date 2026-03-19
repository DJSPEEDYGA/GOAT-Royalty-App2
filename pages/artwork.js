/**
 * GOAT Royalty App - Superhero Artwork Page
 */

import React from 'react';
import SuperheroArtwork from '../components/SuperheroArtwork';
import Head from 'next/head';

const ArtworkPage = () => {
  return (
    <>
      <Head>
        <title>Artwork Manager | GOAT Royalty</title>
        <meta name="description" content="Manage and generate artwork for your music releases and brand." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900">
      <SuperheroArtwork />
    </div>
    </>
  );
};

export default ArtworkPage;