/**
 * GOAT Force — Full ASCAP Catalog Browser
 * Real data: Harvey Miller + FASTASSMAN — 438 works, 344 unique titles
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music, Search, Filter, Crown, Shield, CheckCircle,
  DollarSign, Eye, FileText, BarChart3, Download,
  ChevronLeft, ChevronRight, Star, Zap, Globe
} from 'lucide-react';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({});
  const PER_PAGE = 20;

  useEffect(() => {
    fetch('/data/catalog-data.json')
      .then(r => r.json())
      .then(data => {
        setCatalog(data);
        setFiltered(data);
        const accepted = data.filter(w => w.status === 'Accepted').length;
        const surveyed = data.filter(w => w.surveyed === 'Y').length;
        const licensed = data.filter(w => w.licenced === 'Y').length;
        const uniqueTitles = new Set(data.map(w => w.title)).size;
        const totalCollect = data.reduce((s, w) => s + parseFloat(w.collectPercent?.replace('%', '') || 0), 0);
        setStats({ total: data.length, accepted, surveyed, licensed, uniqueTitles, avgCollect: (totalCollect / data.length).toFixed(1) });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = catalog;
    if (search) result = result.filter(w =>
      w.title?.toLowerCase().includes(search.toLowerCase()) ||
      w.interestedParties?.toLowerCase().includes(search.toLowerCase()) ||
      w.workId?.includes(search) ||
      w.iswc?.includes(search)
    );
    if (filterStatus !== 'ALL') result = result.filter(w => w.status === filterStatus);
    if (filterRole !== 'ALL') result = result.filter(w => w.role === filterRole);
    setFiltered(result);
    setPage(1);
  }, [search, filterStatus, filterRole, catalog]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const roleLabel = { CA: 'Co-Author', C: 'Composer', E: 'Publisher', AM: 'Admin' };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="text-center">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
        <p className="text-white text-xl" style={{ fontFamily: 'Orbitron, monospace' }}>LOADING VAULT CATALOG...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #0D0D0D 60%, #0A0505 100%)', fontFamily: 'Rajdhani, sans-serif' }}>

      {/* HEADER */}
      <div className="border-b border-red-900/40" style={{ background: 'rgba(220,38,38,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-black tracking-widest text-white" style={{ fontFamily: 'Avengeance, Orbitron, Impact, sans-serif' }}>
                ASCAP CATALOG
              </h1>
              <p className="text-red-400 text-xs tracking-widest">HARVEY MILLER • FASTASSMAN PUBLISHING INC</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/vault" className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-800 text-red-400 text-xs hover:bg-red-900/20 transition-all">
              <Shield className="w-3 h-3" /> VAULT
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-700 text-gray-400 text-xs hover:bg-gray-800 transition-all">
              <BarChart3 className="w-3 h-3" /> DASHBOARD
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS ROW */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'TOTAL WORKS', value: stats.total, color: 'text-yellow-400', bg: 'border-yellow-900/40' },
            { label: 'UNIQUE TITLES', value: stats.uniqueTitles, color: 'text-blue-400', bg: 'border-blue-900/40' },
            { label: 'ACCEPTED', value: stats.accepted, color: 'text-green-400', bg: 'border-green-900/40' },
            { label: 'SURVEYED', value: stats.surveyed, color: 'text-purple-400', bg: 'border-purple-900/40' },
            { label: 'LICENSED', value: stats.licensed, color: 'text-red-400', bg: 'border-red-900/40' },
            { label: 'AVG COLLECT', value: `${stats.avgCollect}%`, color: 'text-yellow-400', bg: 'border-yellow-900/40' },
          ].map((s, i) => (
            <div key={i} className={`rounded-lg border ${s.bg} p-3 text-center`} style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-600 text-xs tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search title, party, ASCAP ID, ISWC..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 bg-gray-900/50 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-700"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-300 text-sm focus:outline-none focus:border-red-700"
          >
            <option value="ALL">All Status</option>
            <option value="Accepted">Accepted</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-300 text-sm focus:outline-none focus:border-red-700"
          >
            <option value="ALL">All Roles</option>
            <option value="CA">Co-Author (CA)</option>
            <option value="C">Composer (C)</option>
          </select>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 bg-gray-900/50">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">{filtered.length} results</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border border-gray-800 overflow-hidden mb-6" style={{ background: '#050505' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800" style={{ background: '#0A0A0A' }}>
                  {['WORK TITLE', 'ASCAP ID', 'INTERESTED PARTY', 'ROLE', 'OWN %', 'COLLECT %', 'STATUS', 'ISWC', 'LICENSED'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((work, i) => (
                  <tr key={i} className="border-b border-gray-900 hover:bg-red-900/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Music className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span className="text-white text-sm font-semibold truncate max-w-48">{work.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{work.workId}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm truncate max-w-36">{work.interestedParties}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        work.role === 'CA' ? 'bg-blue-900/40 text-blue-400' :
                        work.role === 'C' ? 'bg-purple-900/40 text-purple-400' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {work.role} — {roleLabel[work.role] || work.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-yellow-400 font-bold text-sm">{work.ownPercent}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400 font-bold text-sm">{work.collectPercent}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold ${work.status === 'Accepted' ? 'text-green-400' : 'text-yellow-400'}`}>
                        <CheckCircle className="w-3 h-3" /> {work.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{work.iswc || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${work.licenced === 'Y' ? 'text-green-400' : 'text-gray-600'}`}>
                        {work.licenced === 'Y' ? '✅ YES' : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Showing {((page-1)*PER_PAGE)+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} works
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="p-2 rounded border border-gray-800 text-gray-400 hover:border-red-700 hover:text-red-400 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i+1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded border text-xs font-bold transition-all ${pg === page ? 'border-red-600 bg-red-900/30 text-red-400' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="p-2 rounded border border-gray-800 text-gray-400 hover:border-red-700 hover:text-red-400 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}