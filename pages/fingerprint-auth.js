/**
 * GOAT Royalty App - Fingerprint Authentication Page
 */

import React from 'react';
import FingerprintAuth from '../components/FingerprintAuth';
import Head from 'next/head';

const FingerprintAuthPage = () => {
  return (
    <>
      <Head>
        <title>Fingerprint Auth | GOAT Royalty</title>
        <meta name="description" content="Secure biometric authentication for your GOAT Royalty account." />
      </Head>
      <FingerprintAuth />
    </>
  );
};

export default FingerprintAuthPage;