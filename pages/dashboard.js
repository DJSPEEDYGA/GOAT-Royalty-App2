/**
 * GOAT Force Dashboard - Main Entry Point
 * Displays real catalog data and royalty intelligence
 */

import React from 'react';
import RealDataDashboard from '../components/RealDataDashboard';
import Head from 'next/head';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | GOAT Royalty</title>
        <meta name="description" content="Your central command dashboard for royalties, catalog, and analytics." />
      </Head>
      <RealDataDashboard />
    </>
  );
}