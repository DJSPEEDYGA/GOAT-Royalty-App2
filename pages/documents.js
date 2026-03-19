/**
 * GOAT Royalty App - Documents Page
 */

import React from 'react';
import DocumentLibrary from '../components/DocumentLibrary';
import Head from 'next/head';

const DocumentsPage = () => {
  return (
    <>
      <Head>
        <title>Documents | GOAT Royalty</title>
        <meta name="description" content="Manage contracts, agreements, and publishing documents." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      <DocumentLibrary />
    </div>
    </>
  );
};

export default DocumentsPage;