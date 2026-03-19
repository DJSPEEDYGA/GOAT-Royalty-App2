/**
 * GOAT Royalty App - Media Gallery Page
 */

import React from 'react';
import MediaGallery from '../components/MediaGallery';
import Head from 'next/head';

const MediaGalleryPage = () => {
  return (
    <>
      <Head>
        <title>Media Gallery | GOAT Royalty</title>
        <meta name="description" content="Browse and manage your media assets, photos, and videos." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <MediaGallery />
    </div>
    </>
  );
};

export default MediaGalleryPage;