/**
 * 💰 Moneypenny AI — Home & Workshop
 * AI-Powered Royalty Search & Management Assistant
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { DollarSign, Home, Wrench } from 'lucide-react';

const MoneypennyAI = dynamic(() => import('../components/MoneypennyAI'), { ssr: false });

export default function MoneypennyPage() {
  return (
    <>
      <Head>
        <title>Moneypenny AI | GOAT Royalty</title>
        <meta name="description" content="Moneypenny AI — Intelligent royalty search assistant and management workshop for FASTASSMAN Publishing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 100%)' }}>
        {/* Header */}
        <nav className="goat-nav sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src="/images/branding/goat-icon-64.png"
                  alt="GOAT Force"
                  className="w-9 h-9 rounded-xl goat-logo-img"
                />
                <span className="text-xl font-black bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  GOAT FORCE
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Dashboard</span>
                </button>
              </Link>
              <Link href="/royalty-engine">
                <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-4 py-2 rounded-xl font-bold transition-all text-sm">
                  <DollarSign className="w-4 h-4" />
                  Royalty Engine
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Hero */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">
                Moneypenny <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-gray-400 mt-1">Your intelligent royalty search assistant &amp; management workshop</p>
            </div>
          </div>

          {/* Workshop Section Label */}
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-yellow-500 uppercase tracking-widest">Workshop</h2>
            <div className="flex-1 h-px bg-yellow-500/20" />
          </div>

          {/* Main MoneypennyAI Component */}
          <MoneypennyAI />
        </div>
      </div>
    </>
  );
}
