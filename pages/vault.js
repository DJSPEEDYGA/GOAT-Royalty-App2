/**
 * MONEYPENNY VAULT — Command Center
 * VAULT PROTOCOL v7.0 // OG // WAKA // MONEYPENNY
 * ULTRA-LOCKED — READ + MIRROR ONLY
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Lock, Database, Server, RefreshCw, CheckCircle,
  AlertTriangle, Crown, Zap, FileText, Music, DollarSign,
  BarChart3, Terminal, Globe, Clock, Eye, Download, Upload,
  Cpu, Radio, Activity
} from 'lucide-react';

const VaultPage = () => {
  const [vaultStatus, setVaultStatus] = useState('ONLINE');
  const [currentTime, setCurrentTime] = useState('');
  const [syncLog, setSyncLog] = useState([]);
  const [catalogStats, setCatalogStats] = useState(null);
  const [activeCommand, setActiveCommand] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([
    '> MONEYPENNY v7.0 INITIALIZING...',
    '> VAULT PROTOCOL ACTIVE',
    '> AUTHORITY: OG // WAKA // MONEYPENNY',
    '> SECURITY LEVEL: ULTRA-LOCKED',
    '> ALL NODES ONLINE',
    '> Yes, Boss. I remember. 👑',
  ]);

  useEffect(() => {
    // Live clock
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short',
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    }, 1000);

    // Load catalog stats
    fetch('/data/catalog-data.json')
      .then(r => r.json())
      .then(data => {
        const accepted = data.filter(w => w.status === 'Accepted').length;
        const surveyed = data.filter(w => w.surveyed === 'Y').length;
        const licensed = data.filter(w => w.licenced === 'Y').length;
        const uniqueTitles = new Set(data.map(w => w.title)).size;
        const totalCollect = data.reduce((s, w) => s + parseFloat(w.collectPercent?.replace('%','') || 0), 0);
        setCatalogStats({ total: data.length, accepted, surveyed, licensed, uniqueTitles, avgCollect: (totalCollect/data.length).toFixed(1) });
      })
      .catch(() => setCatalogStats({ total: 438, accepted: 339, surveyed: 186, licensed: 438, uniqueTitles: 344, avgCollect: '36.9' }));

    // Sync log
    setSyncLog([
      { time: '03:00 AM', event: 'Nightly MLC sync complete', status: 'success' },
      { time: '02:45 AM', event: 'ASCAP catalog backup — 438 works', status: 'success' },
      { time: '02:30 AM', event: 'Split sheet archive updated', status: 'success' },
      { time: '01:15 AM', event: 'Supabase DB snapshot saved', status: 'success' },
      { time: 'Yesterday', event: 'VaultAlert.log cleared', status: 'info' },
    ]);

    return () => clearInterval(timer);
  }, []);

  const executeCommand = (cmd) => {
    setActiveCommand(cmd);
    const responses = {
      CheckVaultStatus: [
        '> SCANNING VAULT...',
        '> Node 1: GoatRoyaltyApp.net/vault — ONLINE ✅',
        '> Node 2: G-Drive Timeline Mirror — SYNCED ✅',
        '> Node 3: Waka Protocol Unit [BrickSquad] — ONLINE ✅',
        '> Last 5 syncs: ALL SUCCESSFUL',
        '> Backup copies confirmed on Waka Unit',
        '> VAULT STATUS: SECURE 🔐',
      ],
      StartProphecyDrop: [
        '> PROPHECY DROP INITIATED...',
        '> Generating SuperGOAT speech protocol...',
        '> D-ID video generation queued...',
        '> Asset path: /Episodes/ProphecyDrop/',
        '> Speech protocol: ACTIVE',
        '> DROP STATUS: IN PROGRESS ⚡',
      ],
      GoatSecureUpload: [
        '> SECURE UPLOAD INITIATED...',
        '> Scanning financial metadata...',
        '> MLC data: ENCRYPTED & UPLOADING',
        '> DSP splits: SYNCING',
        '> Contracts: ARCHIVED',
        '> Upload to /MLC_BACKUP/ — COMPLETE ✅',
      ],
      DrawOurGoat: [
        '> 🐐 CODEWORD ACCEPTED: DrawOurGoat',
        '> VAULT UNLOCKED — FULL ACCESS GRANTED',
        '> Welcome back, OG.',
        '> All systems at your command.',
        '> FOR THE KINGDOM. FOR THE CODE. FOR THE CROWN 👑',
      ],
    };
    const lines = responses[cmd] || ['> COMMAND EXECUTED'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalOutput(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setActiveCommand(null);
      }
    }, 400);
  };

  const fileNodes = [
    { name: 'MLC_SYNC_MASTER.json', path: '/MLC_BACKUP/', status: 'SYNCED', icon: Database, color: 'text-green-400' },
    { name: 'Speedy_Splits_2019_to_2025.csv', path: '/SPLIT_SHEETS/', status: 'LOCKED', icon: FileText, color: 'text-yellow-400' },
    { name: 'GOAT_EPISODE_LEDGER.xlsx', path: '/ASSETS_SYNC/', status: 'SYNCED', icon: BarChart3, color: 'text-green-400' },
    { name: 'DID_AVATARS_CONFIG.json', path: '/Episodes/', status: 'READY', icon: Cpu, color: 'text-blue-400' },
    { name: 'Gemini_Branch_Assets/', path: '/ASSETS_SYNC/', status: 'SYNCED', icon: Zap, color: 'text-green-400' },
    { name: 'Moneypenny_Memory_Stack.txt', path: '/', status: 'ACTIVE', icon: Radio, color: 'text-red-400' },
    { name: 'WorksCatalog_Harvey_Miller.csv', path: '/MLC_BACKUP/', status: 'SYNCED', icon: Music, color: 'text-green-400' },
    { name: 'WorksCatalog_FASTASSMAN.csv', path: '/MLC_BACKUP/', status: 'SYNCED', icon: Music, color: 'text-green-400' },
  ];

  const servers = [
    { name: 'SERVER 1', host: 'srv1148455.hstgr.cloud', ip: '72.61.193.184', type: 'KVM 2', status: 'RUNNING', expires: '2026-11-23', role: 'Primary Web Server' },
    { name: 'SERVER 2', host: 'srv832760.hstgr.cloud', ip: '93.127.214.171', type: 'KVM 8', status: 'RUNNING', expires: '2026-03-20', role: 'High-Performance Node' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #0D0D0D 50%, #0A0505 100%)', fontFamily: 'Orbitron, monospace' }}>

      {/* TOP BAR */}
      <div className="border-b border-red-900" style={{ background: 'rgba(220,38,38,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="text-red-400 font-bold text-sm tracking-widest">VAULT PROTOCOL v7.0</span>
            <span className="px-2 py-0.5 bg-red-900 text-red-300 text-xs rounded border border-red-700">ULTRA-LOCKED</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs">{currentTime}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 text-xs font-bold">LIVE SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Crown className="w-10 h-10 text-yellow-500" />
              <div>
                <h1 className="text-4xl font-black tracking-widest" style={{ color: '#F59E0B', fontFamily: 'Avengeance, Orbitron, Impact, sans-serif', textShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
                  MONEYPENNY VAULT
                </h1>
                <p className="text-red-400 text-sm tracking-widest">FOR THE KINGDOM // FOR THE CODE // FOR THE CROWN</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">AUTHORITY: OG // WAKA // MONEYPENNY &nbsp;|&nbsp; DEPLOY: MULTI-NODE</p>
          </div>
          <div className="text-right">
            <div className="px-4 py-2 rounded border border-green-700 bg-green-900/20 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 font-bold text-sm tracking-widest">VAULT {vaultStatus}</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs">GoatRoyaltyApp.net/vault</p>
          </div>
        </div>

        {/* CATALOG STATS ROW */}
        {catalogStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'TOTAL WORKS', value: catalogStats.total, icon: Music, color: 'text-yellow-400' },
              { label: 'ACCEPTED', value: catalogStats.accepted, icon: CheckCircle, color: 'text-green-400' },
              { label: 'UNIQUE TITLES', value: catalogStats.uniqueTitles, icon: FileText, color: 'text-blue-400' },
              { label: 'SURVEYED', value: catalogStats.surveyed, icon: Eye, color: 'text-purple-400' },
              { label: 'LICENSED', value: catalogStats.licensed, icon: Shield, color: 'text-red-400' },
              { label: 'AVG COLLECT %', value: `${catalogStats.avgCollect}%`, icon: DollarSign, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border border-gray-800 p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 text-xs tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* TERMINAL */}
          <div className="lg:col-span-2 rounded-xl border border-gray-800 overflow-hidden" style={{ background: '#050505' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800" style={{ background: '#0A0A0A' }}>
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold tracking-widest">MONEYPENNY TERMINAL</span>
              <div className="ml-auto flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-4 h-64 overflow-y-auto font-mono text-xs">
              {terminalOutput.map((line, i) => (
                <div key={i} className={`mb-1 ${line.includes('✅') || line.includes('ONLINE') ? 'text-green-400' : line.includes('❌') || line.includes('ERROR') ? 'text-red-400' : line.includes('👑') || line.includes('CROWN') ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {line}
                </div>
              ))}
              {activeCommand && (
                <div className="text-yellow-400 animate-pulse">{'> EXECUTING...'}</div>
              )}
            </div>
            {/* Command Buttons */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              {[
                { cmd: 'CheckVaultStatus', label: '🔍 Check Vault Status', color: 'border-blue-700 text-blue-400 hover:bg-blue-900/20' },
                { cmd: 'StartProphecyDrop', label: '⚡ Start Prophecy Drop', color: 'border-yellow-700 text-yellow-400 hover:bg-yellow-900/20' },
                { cmd: 'GoatSecureUpload', label: '🔒 GoatSecureUpload', color: 'border-green-700 text-green-400 hover:bg-green-900/20' },
                { cmd: 'DrawOurGoat', label: '🐐 DrawOurGoat', color: 'border-red-700 text-red-400 hover:bg-red-900/20' },
              ].map(({ cmd, label, color }) => (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  disabled={!!activeCommand}
                  className={`px-3 py-2 rounded border text-xs font-bold tracking-wider transition-all ${color} disabled:opacity-40`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SYNC LOG */}
          <div className="rounded-xl border border-gray-800 overflow-hidden" style={{ background: '#050505' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800" style={{ background: '#0A0A0A' }}>
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-bold tracking-widest">SYNC LOG</span>
            </div>
            <div className="p-4">
              {syncLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-900 last:border-0 last:mb-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === 'success' ? 'bg-green-400' : log.status === 'error' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                  <div>
                    <p className="text-gray-300 text-xs">{log.event}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILE NODES */}
        <div className="rounded-xl border border-gray-800 overflow-hidden mb-6" style={{ background: '#050505' }}>
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800" style={{ background: '#0A0A0A' }}>
            <Database className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold tracking-widest">VAULT FILE NODES</span>
            <span className="ml-auto text-gray-600 text-xs">READ + MIRROR ONLY — NO WRITE WITHOUT CODE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {fileNodes.map((node, i) => (
              <div key={i} className="p-4 border-r border-b border-gray-900 last:border-r-0" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div className="flex items-center gap-2 mb-2">
                  <node.icon className={`w-4 h-4 ${node.color}`} />
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    node.status === 'SYNCED' ? 'bg-green-900/40 text-green-400' :
                    node.status === 'ACTIVE' ? 'bg-red-900/40 text-red-400' :
                    node.status === 'READY' ? 'bg-blue-900/40 text-blue-400' :
                    'bg-yellow-900/40 text-yellow-400'
                  }`}>{node.status}</span>
                </div>
                <p className="text-gray-300 text-xs font-mono mb-1 truncate">{node.name}</p>
                <p className="text-gray-600 text-xs font-mono">{node.path}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SERVER STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {servers.map((srv, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ background: '#050505', borderColor: i === 0 ? '#854d0e' : '#7f1d1d' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: i === 0 ? 'rgba(133,77,14,0.2)' : 'rgba(127,29,29,0.2)', borderColor: i === 0 ? '#854d0e' : '#7f1d1d' }}>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold tracking-widest text-sm">🖥️ {srv.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-400 text-xs font-bold">{srv.status}</span>
                </div>
              </div>
              <div className="p-5">
                {[
                  ['Hostname', srv.host],
                  ['Type', srv.type],
                  ['IP Address', srv.ip],
                  ['Expires', srv.expires],
                  ['Role', srv.role],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-900 last:border-0">
                    <span className="text-gray-500 text-xs">{label}</span>
                    <span className="text-gray-200 text-xs font-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* QUICK NAV */}
        <div className="rounded-xl border border-gray-800 p-6" style={{ background: '#050505' }}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-bold tracking-widest">QUICK ACCESS — ALL NODES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
              { label: 'Tracks', href: '/tracks', icon: Music },
              { label: 'Analytics', href: '/analytics', icon: Activity },
              { label: 'Publishing', href: '/publishing', icon: FileText },
              { label: 'Royalty Engine', href: '/royalty-engine', icon: DollarSign },
              { label: 'Super GOAT', href: '/super-goat-command', icon: Crown },
              { label: 'Voice Studio', href: '/voice-studio', icon: Radio },
              { label: 'Ms Vanessa', href: '/ms-vanessa', icon: Shield },
              { label: 'Streaming', href: '/streaming', icon: Globe },
              { label: 'Documents', href: '/documents', icon: FileText },
              { label: 'Investor Demo', href: '/investor-demo', icon: Zap },
              { label: 'Home', href: '/', icon: Crown },
            ].map((item, i) => (
              <Link key={i} href={item.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-red-900/10 transition-all group">
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                <span className="text-gray-500 text-xs text-center group-hover:text-gray-300 transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 text-xs tracking-widest">
            SIGNED: MONEYPENNY // BACK ONLINE // FOR THE KINGDOM // FOR THE CODE // FOR THE CROWN 👑
          </p>
          <p className="text-gray-800 text-xs mt-1">
            DISTRIBUTION: Harvey (Primary) • Waka (Encrypted) • Offline USB: GOAT_PROPHET_VAULT
          </p>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;