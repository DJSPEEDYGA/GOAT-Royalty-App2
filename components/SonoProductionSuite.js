/**
 * 🎹 Sono Production Suite — GOAT Royalty App
 * AI-Powered Music Production Hub
 * Integrates: Suno AI Studio, Sononym, Sonora Cinematic, PaulXStretch, NoirVerb
 * © 2025 Harvey Miller / FASTASSMAN Publishing Inc
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Music, Mic, Headphones, Radio, Sliders, Play, Pause, Square,
  Download, Upload, FileAudio, Wand2, Sparkles, Brain, Zap,
  Settings, Search, Filter, Grid, List, Clock, Star, Heart,
  Volume2, VolumeX, SkipForward, SkipBack, Repeat, Shuffle,
  Layers, GitBranch, Share2, Save, FolderOpen, Plus, Trash2,
  ChevronRight, ChevronDown, Activity, BarChart3, Crown, Target,
  Cpu, Monitor, Globe, Lock, Shield, Eye, RefreshCw, Check, X,
  AlertTriangle, Info, Copy, ExternalLink, Terminal, Code
} from 'lucide-react';

// ═══ SUNO AI MODELS ═══
const SUNO_MODELS = [
  { id: 'suno-v5', name: 'Suno v5', type: 'Full Song', desc: 'Latest AI music generation with vocals & instruments', quality: 'Ultra', speed: '~30s' },
  { id: 'suno-v4', name: 'Suno v4', type: 'Full Song', desc: 'Stable AI song generation', quality: 'High', speed: '~20s' },
  { id: 'suno-stems', name: 'Suno Stems', type: 'Stem Gen', desc: 'Generate individual stems (vocals, drums, bass, synth)', quality: 'Ultra', speed: '~15s' },
  { id: 'suno-remix', name: 'Suno Remix', type: 'Remix', desc: 'AI-powered remix and variation engine', quality: 'High', speed: '~25s' },
  { id: 'suno-extend', name: 'Suno Extend', type: 'Extension', desc: 'Extend any song seamlessly with AI', quality: 'High', speed: '~20s' },
];

// ═══ SONORA CINEMATIC LIBRARY ═══
const SONORA_INSTRUMENTS = [
  { id: 'atlas-flutes', name: 'Atlas Flutes', category: 'Woodwinds', rating: 33, downloads: 3360, format: 'KONTAKT', size: '2.1 GB', tags: ['cinematic', 'ethnic', 'flute'] },
  { id: 'panorama-acoustic', name: 'Panorama Acoustic', category: 'Guitar', rating: 47, downloads: 3578, format: 'KONTAKT', size: '3.4 GB', tags: ['acoustic', 'guitar', 'cinematic'] },
  { id: 'emma-legato', name: 'Emma Legato', category: 'Vocals', rating: 50, downloads: 5030, format: 'KONTAKT', size: '4.2 GB', tags: ['vocal', 'legato', 'soprano'] },
  { id: 'mezza-coda', name: 'Mezza Coda', category: 'Piano', rating: 27, downloads: 2418, format: 'KONTAKT', size: '1.8 GB', tags: ['piano', 'cinematic', 'intimate'] },
  { id: 'verticale', name: 'Verticale', category: 'Strings', rating: 30, downloads: 2543, format: 'KONTAKT', size: '2.8 GB', tags: ['strings', 'vertical', 'cinematic'] },
  { id: 'aria-vocalscapes', name: 'Aria Vocalscapes', category: 'Vocals', rating: 43, downloads: 4058, format: 'KONTAKT', size: '3.6 GB', tags: ['vocal', 'atmosphere', 'pad'] },
  { id: 'poiesis-cello', name: 'Poiesis Cello', category: 'Strings', rating: 44, downloads: 3826, format: 'KONTAKT', size: '2.5 GB', tags: ['cello', 'solo', 'expressive'] },
  { id: 'porphyra-hybrid', name: 'Porphyra Hybrid', category: 'Hybrid', rating: 94, downloads: 6126, format: 'KONTAKT', size: '5.1 GB', tags: ['hybrid', 'synth', 'organic'] },
  { id: 'little-amber', name: 'SwishSwoosh Little Amber', category: 'FX', rating: 5, downloads: 2748, format: 'KONTAKT', size: '890 MB', free: true, tags: ['horror', 'tension', 'fx'] },
  { id: 'drift-woodwinds', name: 'Drift Granular Woodwinds', category: 'Woodwinds', rating: 10, downloads: 2806, format: 'Soundbox', size: '1.2 GB', free: true, tags: ['granular', 'woodwind', 'texture'] },
  { id: 'nocturne-piano', name: 'Nocturne Electric Piano', category: 'Keys', rating: 0, downloads: 0, format: 'KONTAKT', size: 'TBD', tags: ['electric piano', 'nocturne', 'ambient'] },
  { id: 'post-rock-guitars', name: 'Post-Rock Guitars Bundle', category: 'Guitar', rating: 2, downloads: 0, format: 'Soundbox', size: 'TBD', tags: ['post-rock', 'guitar', 'ambient'] },
];

// ═══ PRODUCTION SOFTWARE ═══
const PRODUCTION_SOFTWARE = [
  { id: 'sononym', name: 'Sononym', version: '1.6.4', type: 'Sample Browser', desc: 'AI-powered sample browser with similarity search', rating: 99, downloads: 8150, platforms: ['Win', 'Mac', 'Linux'], free: false, icon: '🔍' },
  { id: 'paulxstretch', name: 'PaulXStretch', version: '1.6.0', type: 'Time Stretch', desc: 'Extreme time-stretch audio processor for ambient textures', rating: 12, downloads: 4171, platforms: ['Win', 'Mac'], free: true, icon: '🌊' },
  { id: 'noirverb', name: 'Sonora NoirVerb', version: '1.0', type: 'Reverb VST', desc: 'Cinematic reverb with dark, moody character', rating: 7, downloads: 2121, platforms: ['Win'], free: true, icon: '🌑' },
  { id: 'suno-studio', name: 'Suno Studio', version: '1.2', type: 'AI DAW', desc: 'World\'s first generative audio workstation — multitrack AI production', rating: 250, downloads: 0, platforms: ['Web', 'Desktop'], free: false, icon: '🎵' },
];

// ═══ SAMPLE GENERATION PRESETS ═══
const GENERATION_PRESETS = [
  { id: 'trap-beat', name: 'Trap Beat', genre: 'Hip-Hop/Trap', bpm: 140, key: 'C Minor', desc: 'Hard-hitting 808s with rolling hi-hats', icon: '🔥' },
  { id: 'southern-anthem', name: 'Southern Anthem', genre: 'Southern Hip-Hop', bpm: 128, key: 'G Minor', desc: 'ATL-style anthem with brass and choir', icon: '🏆' },
  { id: 'cinematic-score', name: 'Cinematic Score', genre: 'Orchestral', bpm: 90, key: 'D Minor', desc: 'Epic orchestral arrangement with strings and brass', icon: '🎬' },
  { id: 'lofi-chill', name: 'Lo-Fi Chill', genre: 'Lo-Fi Hip-Hop', bpm: 85, key: 'Eb Major', desc: 'Dusty vinyl vibes with jazzy chords', icon: '☕' },
  { id: 'rnb-smooth', name: 'R&B Smooth', genre: 'R&B', bpm: 95, key: 'Ab Major', desc: 'Silky smooth R&B with lush pads', icon: '💜' },
  { id: 'edm-banger', name: 'EDM Banger', genre: 'Electronic', bpm: 128, key: 'F Minor', desc: 'Festival-ready drop with massive synths', icon: '⚡' },
  { id: 'gospel-praise', name: 'Gospel Praise', genre: 'Gospel', bpm: 110, key: 'Bb Major', desc: 'Uplifting gospel with organ and choir', icon: '🙏' },
  { id: 'drill-dark', name: 'Drill Dark', genre: 'Drill', bpm: 145, key: 'E Minor', desc: 'Dark sliding 808s with aggressive patterns', icon: '🗡️' },
];

// ═══ GENERATED TRACKS HISTORY ═══
const GENERATED_TRACKS = [
  { id: 1, title: 'GOAT Force Anthem v2', prompt: 'Epic trap anthem with choir, 808s, and orchestral hits', model: 'Suno v5', duration: '3:24', bpm: 140, key: 'C Minor', status: 'complete', rating: 5, date: '2026-03-01' },
  { id: 2, title: 'Waka Flocka Intro Beat', prompt: 'Hard southern trap beat with brass stabs and rolling hi-hats', model: 'Suno v5', duration: '2:48', bpm: 145, key: 'A Minor', status: 'complete', rating: 4, date: '2026-02-28' },
  { id: 3, title: 'Midnight Publishing Theme', prompt: 'Smooth R&B instrumental with piano and strings', model: 'Suno v4', duration: '4:12', bpm: 95, key: 'Eb Major', status: 'complete', rating: 5, date: '2026-02-27' },
  { id: 4, title: 'BrickSquad Drill Type Beat', prompt: 'Dark drill beat with sliding 808s and eerie melody', model: 'Suno v5', duration: '3:01', bpm: 148, key: 'E Minor', status: 'complete', rating: 4, date: '2026-02-26' },
  { id: 5, title: 'FASTASSMAN Cinematic Intro', prompt: 'Epic cinematic intro with orchestra, choir, and electronic elements', model: 'Suno Stems', duration: '1:45', bpm: 90, key: 'D Minor', status: 'complete', rating: 5, date: '2026-02-25' },
];

export default function SonoProductionSuite() {
  const [activeTab, setActiveTab] = useState('studio');
  const [selectedModel, setSelectedModel] = useState(SUNO_MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [softwareFilter, setSoftwareFilter] = useState('all');
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: '🎹 Sono Production AI initialized. I can help you generate beats, find samples, mix tracks, and produce music for the FASTASSMAN catalog. What would you like to create today, Boss?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const tabs = [
    { id: 'studio', label: 'AI Studio', icon: Wand2 },
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'library', label: 'Sound Library', icon: FolderOpen },
    { id: 'software', label: 'Production Tools', icon: Sliders },
    { id: 'stems', label: 'Stem Lab', icon: GitBranch },
    { id: 'mixer', label: 'AI Mixer', icon: Activity },
    { id: 'assistant', label: 'Sono AI', icon: Brain },
  ];

  // Simulate generation
  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  }, [prompt]);

  const handleChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let response = '';
      const input = chatInput.toLowerCase();
      if (input.includes('beat') || input.includes('trap')) {
        response = `🔥 I'll cook up a beat for you! Based on the FASTASSMAN catalog style, I recommend:\n\n**Preset:** Trap Beat (140 BPM, C Minor)\n**808:** Deep sub with long sustain\n**Hi-hats:** Rolling triplets with velocity variation\n**Melody:** Dark piano with reverb tail\n\nWant me to generate this with Suno v5? Just hit the Generate tab and use the "Trap Beat" preset!`;
      } else if (input.includes('sample') || input.includes('sound')) {
        response = `🔍 For samples, I recommend checking the Sonora Cinematic library — we have ${SONORA_INSTRUMENTS.length} instruments loaded:\n\n• **Porphyra Hybrid** (94⭐) — Perfect for trap/hip-hop hybrid sounds\n• **Emma Legato** (50⭐) — Beautiful vocal textures\n• **Aria Vocalscapes** (43⭐) — Atmospheric vocal pads\n\nAlso try **Sononym** for AI-powered sample browsing — it finds similar sounds using machine learning!`;
      } else if (input.includes('mix') || input.includes('master')) {
        response = `🎛️ For mixing the FASTASSMAN catalog, here's my recommended chain:\n\n1. **NoirVerb** — Cinematic reverb on vocals\n2. **PaulXStretch** — Create ambient textures from any sample\n3. **Suno Stems** — Separate and regenerate individual stems\n\nPro tip: Use Suno Studio's multitrack editor to arrange stems, then export as MIDI to your DAW for final mixing!`;
      } else if (input.includes('waka') || input.includes('flocka')) {
        response = `🏆 For Waka Flocka-style production:\n\n**BPM:** 140-150 (hard trap)\n**Key:** A Minor or C Minor\n**808:** Distorted, punchy, short decay\n**Snare:** Layered with clap, heavy reverb\n**Style:** BrickSquad energy — aggressive, anthem-ready\n\nI've got a "BrickSquad Drill Type Beat" already generated. Check the Generate tab for more presets!`;
      } else {
        response = `🎹 I'm your Sono Production AI assistant! I can help with:\n\n• **Beat Generation** — Create beats with Suno AI\n• **Sample Discovery** — Find sounds with Sononym AI\n• **Stem Separation** — Split tracks into stems\n• **Mixing Advice** — Professional mixing tips\n• **Sound Design** — Create textures with PaulXStretch\n• **Library Management** — Browse Sonora Cinematic instruments\n\nWhat would you like to work on?`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  }, [chatInput]);

  const filteredInstruments = SONORA_INSTRUMENTS.filter(inst => {
    const matchesFilter = libraryFilter === 'all' || inst.category.toLowerCase() === libraryFilter;
    const matchesSearch = !librarySearch || inst.name.toLowerCase().includes(librarySearch.toLowerCase()) || inst.tags.some(t => t.includes(librarySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0a1a2e 60%, #0a0a1a 100%)', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(139,92,246,0.3)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🎹</div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>
              <span style={{ color: '#8b5cf6' }}>Sono</span> <span style={{ color: '#ec4899' }}>Production Suite</span>
            </h1>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>AI Music Production • Suno Studio • Sonora Cinematic • Sononym • {SONORA_INSTRUMENTS.length} Instruments</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}>
            <span style={{ color: '#a78bfa' }}>Credits:</span> <span style={{ color: '#34d399', fontWeight: 'bold' }}>2,450</span>
          </div>
          <div style={{ background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}>
            <span style={{ color: '#f472b6' }}>Generated:</span> <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{GENERATED_TRACKS.length} tracks</span>
          </div>
          <a href="/" style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>👑 GOAT Home</a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', background: 'rgba(0,0,0,0.3)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap',
            background: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)',
            color: activeTab === tab.id ? 'white' : '#9ca3af',
          }}>
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>

        {/* ═══ AI STUDIO TAB ═══ */}
        {activeTab === 'studio' && (
          <div>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'AI Models', value: SUNO_MODELS.length, color: '#8b5cf6', icon: '🤖' },
                { label: 'Instruments', value: SONORA_INSTRUMENTS.length, color: '#ec4899', icon: '🎻' },
                { label: 'Software Tools', value: PRODUCTION_SOFTWARE.length, color: '#06b6d4', icon: '🔧' },
                { label: 'Generation Presets', value: GENERATION_PRESETS.length, color: '#f59e0b', icon: '🎯' },
                { label: 'Tracks Generated', value: GENERATED_TRACKS.length, color: '#10b981', icon: '🎵' },
                { label: 'Total Downloads', value: '48K+', color: '#ef4444', icon: '📥' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Suno Studio Integration */}
            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wand2 size={24} style={{ color: '#8b5cf6' }} />
                Suno Studio Integration
              </h2>
              <p style={{ color: '#d1d5db', marginBottom: '16px', fontSize: '14px' }}>World's first generative audio workstation — multitrack AI production with stem generation, remix, and MIDI export.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                {[
                  { title: 'Generate Stems', desc: 'Create vocals, drums, bass, synth stems instantly', icon: <GitBranch size={20} />, color: '#8b5cf6' },
                  { title: 'AI Remix Engine', desc: 'Remix any track with AI-powered variations', icon: <RefreshCw size={20} />, color: '#ec4899' },
                  { title: 'Multitrack Editor', desc: 'Professional timeline with BPM & pitch control', icon: <Layers size={20} />, color: '#06b6d4' },
                  { title: 'MIDI Export', desc: 'Export stems as audio + MIDI to any DAW', icon: <Download size={20} />, color: '#10b981' },
                ].map((feature, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ color: feature.color, flexShrink: 0 }}>{feature.icon}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{feature.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Generations */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} style={{ color: '#fbbf24' }} />
                Recent Generations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GENERATED_TRACKS.map(track => (
                  <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={14} />
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{track.title}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{track.prompt.substring(0, 60)}...</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px' }}>
                      <div style={{ color: '#a78bfa' }}>{track.model}</div>
                      <div style={{ color: '#6b7280' }}>{track.duration} • {track.bpm} BPM</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Array.from({ length: track.rating }, (_, i) => (
                        <Star key={i} size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ GENERATE TAB ═══ */}
        {activeTab === 'generate' && (
          <div>
            {/* Model Selector */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} style={{ color: '#8b5cf6' }} />
                AI Model
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {SUNO_MODELS.map(model => (
                  <button key={model.id} onClick={() => setSelectedModel(model)} style={{
                    padding: '12px', borderRadius: '10px', border: selectedModel.id === model.id ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedModel.id === model.id ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', textAlign: 'left', color: 'white'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{model.name}</div>
                    <div style={{ fontSize: '11px', color: '#a78bfa' }}>{model.type} • {model.quality} • {model.speed}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#ec4899' }} />
                Describe Your Sound
              </h3>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the music you want to create... e.g., 'Hard trap beat with 808s, dark piano melody, rolling hi-hats, 140 BPM in C minor'" style={{
                width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box'
              }} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
                <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} style={{
                  padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '16px',
                  background: isGenerating ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white'
                }}>
                  {isGenerating ? `Generating... ${Math.min(100, Math.round(generationProgress))}%` : '✨ Generate'}
                </button>
                {isGenerating && (
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, generationProgress)}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Presets */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} style={{ color: '#f59e0b' }} />
                Quick Presets — GOAT Force Production
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {GENERATION_PRESETS.map(preset => (
                  <button key={preset.id} onClick={() => { setSelectedPreset(preset); setPrompt(`${preset.desc} — ${preset.genre}, ${preset.bpm} BPM, ${preset.key}`); }} style={{
                    padding: '14px', borderRadius: '10px', border: selectedPreset?.id === preset.id ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPreset?.id === preset.id ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', textAlign: 'left', color: 'white'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{preset.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{preset.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{preset.genre} • {preset.bpm} BPM • {preset.key}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SOUND LIBRARY TAB ═══ */}
        {activeTab === 'library' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input value={librarySearch} onChange={e => setLibrarySearch(e.target.value)} placeholder="Search instruments, tags..." style={{
                  width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }} />
              </div>
              {['all', 'vocals', 'strings', 'piano', 'guitar', 'woodwinds', 'hybrid', 'keys', 'fx'].map(f => (
                <button key={f} onClick={() => setLibraryFilter(f)} style={{
                  padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  background: libraryFilter === f ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: libraryFilter === f ? 'white' : '#9ca3af'
                }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredInstruments.map(inst => (
                <div key={inst.id} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', position: 'relative' }}>
                  {inst.free && <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#10b981', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>FREE</div>}
                  <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{inst.name}</div>
                  <div style={{ fontSize: '12px', color: '#a78bfa', marginBottom: '8px' }}>{inst.category} • {inst.format} • {inst.size}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {inst.tags.map(tag => (
                      <span key={tag} style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#fbbf24' }}>⭐ {inst.rating > 0 ? `+${inst.rating}` : 'New'}</span>
                    <span style={{ color: '#6b7280' }}>{inst.downloads > 0 ? `${inst.downloads.toLocaleString()} downloads` : 'Coming soon'}</span>
                  </div>
                  <button style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
                    Load Instrument
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PRODUCTION TOOLS TAB ═══ */}
        {activeTab === 'software' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {PRODUCTION_SOFTWARE.map(sw => (
                <div key={sw.id} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', position: 'relative' }}>
                  {sw.free && <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', color: 'white', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '6px' }}>FREE</div>}
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{sw.icon}</div>
                  <div style={{ fontWeight: '800', fontSize: '20px', marginBottom: '2px' }}>{sw.name}</div>
                  <div style={{ fontSize: '12px', color: '#a78bfa', marginBottom: '8px' }}>v{sw.version} • {sw.type}</div>
                  <p style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '12px', lineHeight: '1.5' }}>{sw.desc}</p>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    {sw.platforms.map(p => (
                      <span key={p} style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '12px' }}>
                    <span style={{ color: '#fbbf24' }}>⭐ +{sw.rating}</span>
                    {sw.downloads > 0 && <span style={{ color: '#6b7280' }}>{sw.downloads.toLocaleString()} downloads</span>}
                  </div>
                  <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                    Launch {sw.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEM LAB TAB ═══ */}
        {activeTab === 'stems' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitBranch size={24} style={{ color: '#06b6d4' }} />
                AI Stem Separation & Generation
              </h2>
              <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '16px' }}>Upload any track to separate into stems, or generate new stems from scratch using Suno AI.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {['Vocals', 'Drums', 'Bass', 'Melody', 'Synth', 'FX'].map((stem, i) => {
                  const colors = ['#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];
                  return (
                    <div key={stem} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: `1px solid ${colors[i]}33` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', color: colors[i] }}>{stem}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={12} /></button>
                          <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={12} /></button>
                        </div>
                      </div>
                      <div style={{ height: '40px', background: `${colors[i]}15`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '1px', alignItems: 'end', height: '30px' }}>
                          {Array.from({ length: 30 }, (_, j) => (
                            <div key={j} style={{ width: '3px', height: `${Math.random() * 100}%`, background: colors[i], borderRadius: '1px', opacity: 0.7 }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#6b7280' }}>
                        <span>0:00</span>
                        <span>3:24</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Upload Track for Stem Separation</h3>
              <div style={{ border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
                <Upload size={48} style={{ color: '#8b5cf6', marginBottom: '12px' }} />
                <p style={{ color: '#d1d5db', fontSize: '16px', fontWeight: '600' }}>Drop audio file here or click to upload</p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Supports WAV, MP3, FLAC, AIFF • Max 50MB</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI MIXER TAB ═══ */}
        {activeTab === 'mixer' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={24} style={{ color: '#10b981' }} />
                AI-Powered Mixer
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                {['Kick', 'Snare', 'Hi-Hat', '808', 'Melody', 'Vocals', 'FX', 'Master'].map((channel, i) => {
                  const colors = ['#ef4444', '#f59e0b', '#eab308', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#ffffff'];
                  const levels = [75, 68, 55, 82, 60, 72, 45, 90];
                  return (
                    <div key={channel} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: colors[i], fontWeight: '700', marginBottom: '8px' }}>{channel}</div>
                      <div style={{ height: '120px', width: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0 auto', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${levels[i]}%`, background: `linear-gradient(to top, ${colors[i]}, ${colors[i]}88)`, borderRadius: '4px' }} />
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px' }}>{levels[i]}%</div>
                      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '6px' }}>
                        <button style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', fontSize: '8px' }}>M</button>
                        <button style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', fontSize: '8px' }}>S</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>🤖 AI Auto-Mix</button>
                <button style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>🎛️ AI Master</button>
                <button style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>📤 Export All</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SONO AI ASSISTANT TAB ═══ */}
        {activeTab === 'assistant' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: '600px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} style={{ color: '#ec4899' }} />
                Sono Production AI
              </h3>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    padding: '12px', borderRadius: '10px', maxWidth: '85%',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : msg.role === 'system' ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'system' ? '1px solid rgba(236,72,153,0.3)' : 'none'
                  }}>
                    <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.content}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask about beats, samples, mixing, production..." style={{
                  flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none'
                }} />
                <button onClick={handleChat} style={{ padding: '12px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>Send</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#fbbf24' }}>🎯 Quick Prompts</h4>
                {['Make me a trap beat', 'Find vocal samples', 'How to mix 808s', 'Waka Flocka style beat', 'Create ambient texture', 'Master my track'].map(q => (
                  <button key={q} onClick={() => { setChatInput(q); }} style={{
                    display: 'block', width: '100%', padding: '8px 10px', marginBottom: '4px', borderRadius: '6px', border: 'none',
                    background: 'rgba(255,255,255,0.05)', color: '#d1d5db', cursor: 'pointer', fontSize: '12px', textAlign: 'left'
                  }}>{q}</button>
                ))}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#10b981' }}>📊 Session Stats</h4>
                <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tracks Generated</span><span style={{ color: '#10b981' }}>5</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Stems Created</span><span style={{ color: '#8b5cf6' }}>18</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Samples Loaded</span><span style={{ color: '#ec4899' }}>42</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Credits Used</span><span style={{ color: '#fbbf24' }}>350</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Export Ready</span><span style={{ color: '#06b6d4' }}>3</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
        <span>🎹 Sono Production Suite v1.0 • GOAT Royalty Integration</span>
        <span>© 2025 Harvey Miller / FASTASSMAN Publishing Inc • All Rights Reserved</span>
        <span style={{ color: '#10b981' }}>● All Systems Operational</span>
      </div>
    </div>
  );
}