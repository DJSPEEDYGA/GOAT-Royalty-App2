/**
 * GOAT Royalty App - Ms Vanessa AI Page
 */

import React from 'react';
import MsVanessaAI from '../components/MsVanessaAI';
import Head from 'next/head';

const MsVanessaPage = () => {
  return (
    <>
      <Head>
        <title>Ms. Vanessa AI | GOAT Royalty</title>
        <meta name="description" content="Meet Ms. Vanessa, your AI-powered music publishing assistant." />
      </Head>
      <MsVanessaAI />
    </>
  );
};

export default MsVanessaPage;