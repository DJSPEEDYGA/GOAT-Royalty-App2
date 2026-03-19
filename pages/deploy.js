/**
 * GOAT Royalty App - Production Deployment Page
 */

import React from 'react';
import ProductionDeploy from '../components/ProductionDeploy';
import Head from 'next/head';

const DeployPage = () => {
  return (
    <>
      <Head>
        <title>Deploy | GOAT Royalty</title>
        <meta name="description" content="Deploy and manage your GOAT Royalty applications and services." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <ProductionDeploy />
    </div>
    </>
  );
};

export default DeployPage;