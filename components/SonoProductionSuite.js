/**
 * 🎹 SONO PRODUCTION LABORATORY — All-In-One DAW
 * GOAT Royalty App / GOAT Force Entertainment
 * FL Studio + Ableton + Logic Pro Inspired Music Production Suite
 * 
 * Features: AI Studio, Piano Roll, Step Sequencer, Channel Rack,
 * Playlist/Arrangement, Sound Library, Stem Lab, Mixer, AI Assistant
 * 
 * Integrates: Suno AI, Sononym, Sonora Cinematic, PaulXStretch, NoirVerb,
 * FL Studio, Logic Pro, Native Instruments, Ableton
 * 
 * © 2025 Harvey Miller / DJ Speedy / FASTASSMAN Publishing Inc
 * GOAT Force Entertainment — CEO: DJ Speedy, President: Waka Flocka Flame
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Music, Mic, Headphones, Radio, Sliders, Play, Pause, Square,
  Download, Upload, FileAudio, Wand2, Sparkles, Brain, Zap,
  Settings, Search, Filter, Grid, List, Clock, Star, Heart,
  Volume2, VolumeX, SkipForward, SkipBack, Repeat, Shuffle,
  Layers, GitBranch, Share2, Save, FolderOpen, Plus, Trash2,
  ChevronRight, ChevronDown, Activity, BarChart3, Crown, Target,
  Cpu, Monitor, Globe, Lock, Shield, Eye, RefreshCw, Check, X,
  AlertTriangle, Info, Copy, ExternalLink, Terminal, Code,
  ZoomIn, ZoomOut, Scissors, MousePointer, Pencil, Eraser,
  Magnet, Undo, Redo, Unlock, EyeOff
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ═══ DATA: SUNO AI MODELS ═══
// ═══════════════════════════════════════════════════════════════
const SUNO_MODELS = [
  { id: 'suno-v5', name: 'Suno v5', type: 'Full Song', desc: 'Latest AI music generation with vocals & instruments', quality: 'Ultra', speed: '~30s' },
  { id: 'suno-v4', name: 'Suno v4', type: 'Full Song', desc: 'Stable AI song generation', quality: 'High', speed: '~20s' },
  { id: 'suno-stems', name: 'Suno Stems', type: 'Stem Gen', desc: 'Generate individual stems (vocals, drums, bass, synth)', quality: 'Ultra', speed: '~15s' },
  { id: 'suno-remix', name: 'Suno Remix', type: 'Remix', desc: 'AI-powered remix and variation engine', quality: 'High', speed: '~25s' },
  { id: 'suno-extend', name: 'Suno Extend', type: 'Extension', desc: 'Extend any song seamlessly with AI', quality: 'High', speed: '~20s' },
];

// ═══ DATA: SONORA CINEMATIC LIBRARY ═══
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

// ═══ DATA: PRODUCTION SOFTWARE (DAWs & Tools) ═══
const PRODUCTION_SOFTWARE = [
  { id: 'fl-studio', name: 'FL Studio', version: '24.2', type: 'DAW', desc: 'Industry-standard beat-making DAW — Piano Roll, Step Sequencer, Mixer, Playlist', rating: 500, downloads: 125000, platforms: ['Win', 'Mac'], free: false, icon: '🎹', color: '#f97316' },
  { id: 'logic-pro', name: 'Logic Pro', version: '11.1', type: 'DAW', desc: 'Apple professional recording studio — Live Loops, Drummer, Alchemy Synth', rating: 490, downloads: 95000, platforms: ['Mac', 'iPad'], free: false, icon: '🎵', color: '#6366f1' },
  { id: 'ableton-live', name: 'Ableton Live', version: '12.1', type: 'DAW', desc: 'Session & arrangement view — Wavetable, Operator, Max for Live', rating: 480, downloads: 88000, platforms: ['Win', 'Mac'], free: false, icon: '⚡', color: '#eab308' },
  { id: 'pro-tools', name: 'Pro Tools', version: '2024.6', type: 'DAW', desc: 'Industry-standard recording & mixing — Avid Audio Engine', rating: 460, downloads: 72000, platforms: ['Win', 'Mac'], free: false, icon: '🎚️', color: '#3b82f6' },
  { id: 'komplete', name: 'KOMPLETE 15', version: '15 CE', type: 'Suite', desc: 'Native Instruments — 165+ products, 185K+ sounds, Kontakt 8, Massive X', rating: 470, downloads: 65000, platforms: ['Win', 'Mac'], free: false, icon: '💎', color: '#8b5cf6' },
  { id: 'sononym', name: 'Sononym', version: '1.6.4', type: 'Sample Browser', desc: 'AI-powered sample browser with similarity search', rating: 99, downloads: 8150, platforms: ['Win', 'Mac', 'Linux'], free: false, icon: '🔍', color: '#06b6d4' },
  { id: 'paulxstretch', name: 'PaulXStretch', version: '1.6.0', type: 'Time Stretch', desc: 'Extreme time-stretch audio processor for ambient textures', rating: 12, downloads: 4171, platforms: ['Win', 'Mac'], free: true, icon: '🌊', color: '#10b981' },
  { id: 'noirverb', name: 'Sonora NoirVerb', version: '1.0', type: 'Reverb VST', desc: 'Cinematic reverb with dark, moody character', rating: 7, downloads: 2121, platforms: ['Win'], free: true, icon: '🌑', color: '#6b7280' },
  { id: 'suno-studio', name: 'Suno Studio', version: '1.2', type: 'AI DAW', desc: 'World\'s first generative audio workstation — multitrack AI production', rating: 250, downloads: 0, platforms: ['Web', 'Desktop'], free: false, icon: '🤖', color: '#ec4899' },
  { id: 'serum', name: 'Serum', version: '2.0', type: 'Synth VST', desc: 'Xfer Records wavetable synthesizer — industry standard for sound design', rating: 495, downloads: 110000, platforms: ['Win', 'Mac'], free: false, icon: '🔊', color: '#a855f7' },
];

// ═══ DATA: GENERATION PRESETS ═══
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

// ═══ DATA: GENERATED TRACKS ═══
const GENERATED_TRACKS = [
  { id: 1, title: 'GOAT Force Anthem v2', prompt: 'Epic trap anthem with choir, 808s, and orchestral hits', model: 'Suno v5', duration: '3:24', bpm: 140, key: 'C Minor', status: 'complete', rating: 5, date: '2025-03-01' },
  { id: 2, title: 'Waka Flocka Intro Beat', prompt: 'Hard southern trap beat with brass stabs and rolling hi-hats', model: 'Suno v5', duration: '2:48', bpm: 145, key: 'A Minor', status: 'complete', rating: 4, date: '2025-02-28' },
  { id: 3, title: 'Midnight Publishing Theme', prompt: 'Smooth R&B instrumental with piano and strings', model: 'Suno v4', duration: '4:12', bpm: 95, key: 'Eb Major', status: 'complete', rating: 5, date: '2025-02-27' },
  { id: 4, title: 'BrickSquad Drill Type Beat', prompt: 'Dark drill beat with sliding 808s and eerie melody', model: 'Suno v5', duration: '3:01', bpm: 148, key: 'E Minor', status: 'complete', rating: 4, date: '2025-02-26' },
  { id: 5, title: 'FASTASSMAN Cinematic Intro', prompt: 'Epic cinematic intro with orchestra, choir, and electronic elements', model: 'Suno Stems', duration: '1:45', bpm: 90, key: 'D Minor', status: 'complete', rating: 5, date: '2025-02-25' },
];

// ═══ DATA: PIANO ROLL ═══
const NOTES_LIST = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [6, 5, 4, 3, 2, 1];
const ALL_NOTES = OCTAVES.flatMap(oct => NOTES_LIST.map(note => `${note}${oct}`).reverse());
const NOTE_COLORS = { 'C': '#ef4444', 'C#': '#f97316', 'D': '#f59e0b', 'D#': '#eab308', 'E': '#84cc16', 'F': '#22c55e', 'F#': '#10b981', 'G': '#06b6d4', 'G#': '#3b82f6', 'A': '#6366f1', 'A#': '#8b5cf6', 'B': '#a855f7' };

const DEMO_MIDI_NOTES = [
  { id: 1, note: 'C4', start: 0, duration: 2, velocity: 100, color: '#8b5cf6' },
  { id: 2, note: 'E4', start: 2, duration: 2, velocity: 90, color: '#8b5cf6' },
  { id: 3, note: 'G4', start: 4, duration: 2, velocity: 95, color: '#ec4899' },
  { id: 4, note: 'C5', start: 6, duration: 4, velocity: 100, color: '#ec4899' },
  { id: 5, note: 'B4', start: 10, duration: 2, velocity: 85, color: '#06b6d4' },
  { id: 6, note: 'A4', start: 12, duration: 2, velocity: 80, color: '#06b6d4' },
  { id: 7, note: 'G4', start: 14, duration: 4, velocity: 90, color: '#10b981' },
  { id: 8, note: 'E4', start: 18, duration: 2, velocity: 85, color: '#f59e0b' },
  { id: 9, note: 'D4', start: 20, duration: 2, velocity: 80, color: '#f59e0b' },
  { id: 10, note: 'C4', start: 22, duration: 4, velocity: 100, color: '#ef4444' },
  { id: 11, note: 'C2', start: 0, duration: 4, velocity: 110, color: '#8b5cf6' },
  { id: 12, note: 'A1', start: 8, duration: 4, velocity: 105, color: '#06b6d4' },
  { id: 13, note: 'G1', start: 12, duration: 4, velocity: 100, color: '#06b6d4' },
  { id: 14, note: 'F1', start: 16, duration: 4, velocity: 105, color: '#10b981' },
  { id: 15, note: 'C2', start: 24, duration: 8, velocity: 110, color: '#ef4444' },
];

// ═══ DATA: STEP SEQUENCER CHANNELS ═══
const DEFAULT_CHANNELS = [
  { id: 1, name: 'Kick 808', type: 'drum', color: '#ef4444', volume: 85, pan: 0, muted: false, solo: false, icon: '🥁', pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0, 1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0] },
  { id: 2, name: 'Snare', type: 'drum', color: '#f59e0b', volume: 78, pan: 0, muted: false, solo: false, icon: '🪘', pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0, 0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1] },
  { id: 3, name: 'Clap', type: 'drum', color: '#eab308', volume: 72, pan: 5, muted: false, solo: false, icon: '👏', pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0, 0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0] },
  { id: 4, name: 'Hi-Hat Closed', type: 'drum', color: '#84cc16', volume: 60, pan: -10, muted: false, solo: false, icon: '🔔', pattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  { id: 5, name: 'Hi-Hat Open', type: 'drum', color: '#22c55e', volume: 55, pan: -10, muted: false, solo: false, icon: '🔕', pattern: [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0] },
  { id: 6, name: '808 Sub Bass', type: 'synth', color: '#8b5cf6', volume: 90, pan: 0, muted: false, solo: false, icon: '🎸', pattern: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0, 1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0] },
  { id: 7, name: 'Melody Lead', type: 'synth', color: '#ec4899', volume: 65, pan: 0, muted: false, solo: false, icon: '🎹', pattern: [1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0, 1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0] },
  { id: 8, name: 'Pad Atmosphere', type: 'synth', color: '#a855f7', volume: 45, pan: 0, muted: false, solo: false, icon: '🌊', pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  { id: 9, name: 'Vocal Chop', type: 'vocal', color: '#f472b6', volume: 55, pan: 8, muted: false, solo: false, icon: '🎤', pattern: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0] },
  { id: 10, name: 'FX Riser', type: 'fx', color: '#10b981', volume: 50, pan: 0, muted: false, solo: false, icon: '⚡', pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
];

// ═══ DATA: PLAYLIST TRACKS ═══
const PLAYLIST_TRACKS = [
  { id: 1, name: 'Drums', color: '#ef4444', icon: '🥁', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c1', pattern: 'Kick Pattern', start: 0, duration: 8, color: '#ef4444' },
      { id: 'c2', pattern: 'Kick Pattern', start: 8, duration: 8, color: '#ef4444' },
      { id: 'c3', pattern: 'Kick Fill', start: 16, duration: 4, color: '#f97316' },
      { id: 'c4', pattern: 'Kick Pattern', start: 20, duration: 12, color: '#ef4444' },
    ]},
  { id: 2, name: 'Snare/Clap', color: '#f59e0b', icon: '🪘', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c5', pattern: 'Snare Loop', start: 0, duration: 16, color: '#f59e0b' },
      { id: 'c6', pattern: 'Snare Build', start: 16, duration: 4, color: '#eab308' },
      { id: 'c7', pattern: 'Snare Loop', start: 20, duration: 12, color: '#f59e0b' },
    ]},
  { id: 3, name: 'Hi-Hats', color: '#84cc16', icon: '🔔', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c8', pattern: 'HH Rolling', start: 0, duration: 8, color: '#84cc16' },
      { id: 'c9', pattern: 'HH Triplet', start: 8, duration: 8, color: '#22c55e' },
      { id: 'c10', pattern: 'HH Rolling', start: 16, duration: 16, color: '#84cc16' },
    ]},
  { id: 4, name: '808 Bass', color: '#8b5cf6', icon: '🎸', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c11', pattern: '808 Slide A', start: 0, duration: 8, color: '#8b5cf6' },
      { id: 'c12', pattern: '808 Slide B', start: 8, duration: 8, color: '#7c3aed' },
      { id: 'c13', pattern: '808 Drop', start: 16, duration: 4, color: '#6d28d9' },
      { id: 'c14', pattern: '808 Slide A', start: 20, duration: 12, color: '#8b5cf6' },
    ]},
  { id: 5, name: 'Melody', color: '#ec4899', icon: '🎹', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c15', pattern: 'Main Melody', start: 0, duration: 16, color: '#ec4899' },
      { id: 'c16', pattern: 'Melody Var', start: 16, duration: 8, color: '#f472b6' },
      { id: 'c17', pattern: 'Main Melody', start: 24, duration: 8, color: '#ec4899' },
    ]},
  { id: 6, name: 'Vocals', color: '#f472b6', icon: '🎤', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c19', pattern: 'Vocal Hook', start: 8, duration: 8, color: '#f472b6' },
      { id: 'c20', pattern: 'Vocal Chop', start: 20, duration: 4, color: '#ec4899' },
      { id: 'c21', pattern: 'Vocal Hook', start: 24, duration: 8, color: '#f472b6' },
    ]},
  { id: 7, name: 'FX/Risers', color: '#10b981', icon: '⚡', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c22', pattern: 'Riser', start: 14, duration: 2, color: '#10b981' },
      { id: 'c23', pattern: 'Impact', start: 16, duration: 1, color: '#059669' },
      { id: 'c24', pattern: 'Riser', start: 30, duration: 2, color: '#10b981' },
    ]},
];

const ARRANGEMENT_MARKERS = [
  { bar: 0, label: 'INTRO', color: '#8b5cf6' },
  { bar: 8, label: 'VERSE 1', color: '#06b6d4' },
  { bar: 16, label: 'DROP', color: '#ef4444' },
  { bar: 24, label: 'VERSE 2', color: '#10b981' },
];

// ═══════════════════════════════════════════════════════════════
// ═══ MAIN COMPONENT ═══
// ═══════════════════════════════════════════════════════════════
export default function SonoProductionSuite() {
  // ─── Global State ───
  const [activeTab, setActiveTab] = useState('studio');
  const [globalBpm, setGlobalBpm] = useState(140);
  const [globalKey, setGlobalKey] = useState('C Minor');
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const [globalPlayhead, setGlobalPlayhead] = useState(0);
  const globalPlayRef = useRef(null);

  // ─── AI Studio State ───
  const [selectedModel, setSelectedModel] = useState(SUNO_MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // ─── Piano Roll State ───
  const [midiNotes, setMidiNotes] = useState(DEMO_MIDI_NOTES);
  const [pianoTool, setPianoTool] = useState('draw');
  const [pianoSnap, setPianoSnap] = useState('1/4');
  const [pianoZoom, setPianoZoom] = useState(1);
  const [selectedMidiNotes, setSelectedMidiNotes] = useState(new Set());
  const [ghostNote, setGhostNote] = useState(null);
  const [midiNextId, setMidiNextId] = useState(20);
  const pianoGridRef = useRef(null);

  // ─── Step Sequencer State ───
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [seqStep, setSeqStep] = useState(-1);
  const [seqSwing, setSeqSwing] = useState('Off');
  const [patternName, setPatternName] = useState('Pattern 1 — GOAT Force');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelNextId, setChannelNextId] = useState(11);
  const seqRef = useRef(null);

  // ─── Playlist State ───
  const [playlistTracks, setPlaylistTracks] = useState(PLAYLIST_TRACKS);
  const [playlistZoom, setPlaylistZoom] = useState(1);
  const [selectedClip, setSelectedClip] = useState(null);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [loopStart] = useState(0);
  const [loopEnd] = useState(32);

  // ─── Library State ───
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [librarySearch, setLibrarySearch] = useState('');

  // ─── Mixer State ───
  const [mixerChannels, setMixerChannels] = useState([
    { name: 'Kick', color: '#ef4444', volume: 82, pan: 0, muted: false, solo: false, eq: { low: 3, mid: -1, high: -2 }, fx: ['Comp', 'Dist'] },
    { name: 'Snare', color: '#f59e0b', volume: 75, pan: 0, muted: false, solo: false, eq: { low: -2, mid: 2, high: 1 }, fx: ['Comp', 'Rev'] },
    { name: 'HH', color: '#84cc16', volume: 58, pan: -15, muted: false, solo: false, eq: { low: -6, mid: 0, high: 4 }, fx: ['EQ'] },
    { name: '808', color: '#8b5cf6', volume: 88, pan: 0, muted: false, solo: false, eq: { low: 6, mid: -3, high: -8 }, fx: ['Dist', 'Comp'] },
    { name: 'Melody', color: '#ec4899', volume: 65, pan: 5, muted: false, solo: false, eq: { low: -1, mid: 3, high: 2 }, fx: ['Rev', 'Delay'] },
    { name: 'Vox', color: '#f472b6', volume: 72, pan: 0, muted: false, solo: false, eq: { low: -4, mid: 2, high: 3 }, fx: ['Comp', 'Rev', 'DeEss'] },
    { name: 'Pad', color: '#06b6d4', volume: 42, pan: -8, muted: false, solo: false, eq: { low: 2, mid: 0, high: -1 }, fx: ['Rev'] },
    { name: 'FX', color: '#10b981', volume: 50, pan: 20, muted: false, solo: false, eq: { low: 0, mid: 0, high: 0 }, fx: ['Delay'] },
    { name: 'Bus A', color: '#fbbf24', volume: 78, pan: 0, muted: false, solo: false, eq: { low: 0, mid: 1, high: 0 }, fx: ['Comp'] },
    { name: 'Master', color: '#ffffff', volume: 92, pan: 0, muted: false, solo: false, eq: { low: 1, mid: 0, high: 1 }, fx: ['Limiter', 'Stereo'] },
  ]);

  // ─── AI Chat State ───
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: '🎹 Sono Production Lab initialized. I\'m your AI production assistant — I know the FASTASSMAN catalog, DJ Speedy\'s style, and Waka Flocka\'s energy. What are we cooking today, Boss?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // ═══ TABS ═══
  const tabs = [
    { id: 'studio', label: 'AI Studio', icon: Wand2 },
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'pianoroll', label: 'Piano Roll', icon: Music },
    { id: 'sequencer', label: 'Step Seq', icon: Grid },
    { id: 'playlist', label: 'Playlist', icon: Layers },
    { id: 'library', label: 'Sounds', icon: FolderOpen },
    { id: 'software', label: 'DAW Tools', icon: Sliders },
    { id: 'stems', label: 'Stem Lab', icon: GitBranch },
    { id: 'mixer', label: 'Mixer', icon: Activity },
    { id: 'assistant', label: 'Sono AI', icon: Brain },
  ];

  // ═══ GLOBAL PLAYBACK ═══
  useEffect(() => {
    if (isGlobalPlaying) {
      const stepTime = (60000 / globalBpm) / 4;
      globalPlayRef.current = setInterval(() => {
        setGlobalPlayhead(prev => (prev + 1) % 128);
        setSeqStep(prev => (prev + 1) % 32);
      }, stepTime);
    } else {
      clearInterval(globalPlayRef.current);
    }
    return () => clearInterval(globalPlayRef.current);
  }, [isGlobalPlaying, globalBpm]);

  // ═══ HANDLERS ═══
  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setIsGenerating(false); return 100; }
        return prev + Math.random() * 15;
      });
    }, 500);
  }, [prompt]);

  const handleChat = useCallback(() => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const input = chatInput.toLowerCase();
    setChatInput('');
    setTimeout(() => {
      let response = '';
      if (input.includes('beat') || input.includes('trap')) {
        response = `🔥 Let's cook! For a hard trap beat:\n\n**BPM:** 140 | **Key:** C Minor\n**808:** Deep sub, long sustain, slight distortion\n**Hi-hats:** Rolling triplets, velocity variation\n**Melody:** Dark piano with reverb tail\n\nHit the **Step Sequencer** tab — I've loaded a pattern. Or use **Generate** with the Trap Beat preset!`;
      } else if (input.includes('sample') || input.includes('sound')) {
        response = `🔍 Check the **Sounds** tab — ${SONORA_INSTRUMENTS.length} instruments loaded:\n\n• **Porphyra Hybrid** (94⭐) — Perfect for trap/hip-hop\n• **Emma Legato** (50⭐) — Beautiful vocal textures\n• **Aria Vocalscapes** (43⭐) — Atmospheric pads\n\nAlso try **Sononym** in DAW Tools for AI-powered sample browsing!`;
      } else if (input.includes('mix') || input.includes('master')) {
        response = `🎛️ Hit the **Mixer** tab — 10-channel strip loaded:\n\n1. Set your levels (808 at 88%, Kick at 82%)\n2. EQ each channel (cut lows on HH, boost on 808)\n3. Add FX chain (Comp → Rev → Delay)\n4. Bus compression on Bus A\n5. Limiter on Master at -0.3dB\n\nPro tip: Use **Stem Lab** to separate and regenerate stems!`;
      } else if (input.includes('waka') || input.includes('flocka') || input.includes('brick')) {
        response = `🏆 BrickSquad production style:\n\n**BPM:** 140-150 | **Key:** A Minor\n**808:** Distorted, punchy, short decay\n**Snare:** Layered with clap, heavy reverb\n**Energy:** Aggressive, anthem-ready, crowd movers\n\nCheck the **Step Sequencer** — I've got a BrickSquad pattern loaded. The **Playlist** has a full arrangement ready!`;
      } else if (input.includes('piano') || input.includes('melody') || input.includes('chord')) {
        response = `🎹 Open the **Piano Roll** tab! I've loaded a demo melody in C Minor.\n\n**Tools:** Draw (B), Select (V), Erase (D), Slice (C)\n**Snap:** 1/4 note grid for clean quantization\n**Tip:** Layer your melody with the Pad channel in Step Seq\n\nFor chord progressions try: Cm → Ab → Eb → Bb (classic trap)`;
      } else {
        response = `🎹 I'm your Sono Production AI! Here's what we can do:\n\n• **AI Studio** — Generate with Suno AI models\n• **Piano Roll** — Draw melodies & chords\n• **Step Sequencer** — Program drum patterns\n• **Playlist** — Arrange your full song\n• **Mixer** — Mix & master with EQ/FX\n• **Stem Lab** — Separate & regenerate stems\n• **DAW Tools** — FL Studio, Logic Pro, Ableton & more\n\nWhat are we building?`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 800);
  }, [chatInput]);

  const toggleStep = useCallback((channelId, step) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== channelId) return ch;
      const p = [...ch.pattern]; p[step] = p[step] ? 0 : 1;
      return { ...ch, pattern: p };
    }));
  }, []);

  const handlePianoClick = useCallback((e) => {
    if (!pianoGridRef.current) return;
    const rect = pianoGridRef.current.getBoundingClientRect();
    const CW = 24 * pianoZoom, CH = 16;
    const x = e.clientX - rect.left + pianoGridRef.current.scrollLeft;
    const y = e.clientY - rect.top + pianoGridRef.current.scrollTop;
    const beat = Math.floor(x / CW);
    const noteIdx = Math.floor(y / CH);
    const noteName = ALL_NOTES[noteIdx];
    if (pianoTool === 'draw' && noteName) {
      const existing = midiNotes.find(n => ALL_NOTES.indexOf(n.note) === noteIdx && beat >= n.start && beat < n.start + n.duration);
      if (!existing) {
        const base = noteName.replace(/[0-9]/g, '');
        setMidiNotes(prev => [...prev, { id: midiNextId, note: noteName, start: beat, duration: pianoSnap === '1/1' ? 4 : pianoSnap === '1/2' ? 2 : 1, velocity: 90 + Math.floor(Math.random() * 20), color: NOTE_COLORS[base] || '#8b5cf6' }]);
        setMidiNextId(prev => prev + 1);
      }
    } else if (pianoTool === 'erase') {
      const toRemove = midiNotes.find(n => ALL_NOTES.indexOf(n.note) === noteIdx && beat >= n.start && beat < n.start + n.duration);
      if (toRemove) setMidiNotes(prev => prev.filter(n => n.id !== toRemove.id));
    }
  }, [pianoTool, midiNotes, pianoZoom, pianoSnap, midiNextId]);

  const filteredInstruments = SONORA_INSTRUMENTS.filter(inst => {
    const matchesFilter = libraryFilter === 'all' || inst.category.toLowerCase() === libraryFilter;
    const matchesSearch = !librarySearch || inst.name.toLowerCase().includes(librarySearch.toLowerCase()) || inst.tags.some(t => t.includes(librarySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ═══ SHARED STYLES ═══
  const S = {
    panel: { background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px', marginBottom: '16px' },
    panelGlow: (c) => ({ background: `linear-gradient(135deg, ${c}15, ${c}08)`, border: `1px solid ${c}33`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }),
    btn: (active, c = '#8b5cf6') => ({ padding: '8px 16px', borderRadius: '8px', border: active ? `2px solid ${c}` : '1px solid rgba(255,255,255,0.1)', background: active ? `${c}22` : 'rgba(255,255,255,0.05)', color: active ? c : '#9ca3af', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }),
    transportBtn: (active) => ({ width: '34px', height: '34px', borderRadius: '8px', border: 'none', background: active ? '#ef4444' : '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    smallBtn: { width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.06)', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  };

  // ═══════════════════════════════════════════════════════════════
  // ═══ RENDER ═══
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0a1a2e 60%, #0a0a1a 100%)', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ═══ HEADER ═══ */}
      <div style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(139,92,246,0.3)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🎹</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>
              <span style={{ color: '#8b5cf6' }}>Sono</span> <span style={{ color: '#ec4899' }}>Production Lab</span>
            </h1>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>All-In-One DAW • FL Studio • Logic Pro • Ableton • Suno AI • {SONORA_INSTRUMENTS.length} Instruments • {PRODUCTION_SOFTWARE.length} Tools</p>
          </div>
        </div>

        {/* Global Transport */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => { setIsGlobalPlaying(false); setGlobalPlayhead(0); setSeqStep(-1); }} style={S.smallBtn}><SkipBack size={12} /></button>
          <button onClick={() => setIsGlobalPlaying(!isGlobalPlaying)} style={S.transportBtn(isGlobalPlaying)}>
            {isGlobalPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => { setIsGlobalPlaying(false); setGlobalPlayhead(0); setSeqStep(-1); }} style={S.smallBtn}><Square size={12} /></button>

          <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '4px 10px', fontFamily: 'monospace', fontSize: '14px', fontWeight: '900', color: '#ef4444' }}>
            {globalBpm}
          </div>
          <input type="range" min="60" max="200" value={globalBpm} onChange={e => setGlobalBpm(parseInt(e.target.value))} style={{ width: '80px', accentColor: '#ef4444' }} />
          <span style={{ fontSize: '11px', color: '#a78bfa' }}>BPM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '8px', padding: '5px 10px', fontSize: '11px' }}>
            <span style={{ color: '#a78bfa' }}>Credits:</span> <span style={{ color: '#34d399', fontWeight: 'bold' }}>2,450</span>
          </div>
          <div style={{ background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', borderRadius: '8px', padding: '5px 10px', fontSize: '11px' }}>
            <span style={{ color: '#f472b6' }}>Key:</span> <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{globalKey}</span>
          </div>
          <a href="/" style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>👑 GOAT Home</a>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div style={{ display: 'flex', gap: '3px', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap',
            background: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)',
            color: activeTab === tab.id ? 'white' : '#9ca3af',
          }}>
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ padding: '20px' }}>

        {/* ═══ AI STUDIO TAB ═══ */}
        {activeTab === 'studio' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'AI Models', value: SUNO_MODELS.length, color: '#8b5cf6', icon: '🤖' },
                { label: 'Instruments', value: SONORA_INSTRUMENTS.length, color: '#ec4899', icon: '🎻' },
                { label: 'DAW Tools', value: PRODUCTION_SOFTWARE.length, color: '#06b6d4', icon: '🔧' },
                { label: 'Presets', value: GENERATION_PRESETS.length, color: '#f59e0b', icon: '🎯' },
                { label: 'Generated', value: GENERATED_TRACKS.length, color: '#10b981', icon: '🎵' },
                { label: 'Downloads', value: '580K+', color: '#ef4444', icon: '📥' },
              ].map((stat, i) => (
                <div key={i} style={S.panel}>
                  <div style={{ fontSize: '22px', marginBottom: '2px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={S.panelGlow('#8b5cf6')}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wand2 size={22} style={{ color: '#8b5cf6' }} /> Suno Studio Integration
              </h2>
              <p style={{ color: '#d1d5db', marginBottom: '14px', fontSize: '13px' }}>World's first generative audio workstation — multitrack AI production with stem generation, remix, and MIDI export.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Generate Stems', desc: 'Create vocals, drums, bass, synth stems', icon: <GitBranch size={18} />, color: '#8b5cf6' },
                  { title: 'AI Remix Engine', desc: 'Remix any track with AI variations', icon: <RefreshCw size={18} />, color: '#ec4899' },
                  { title: 'Multitrack Editor', desc: 'Timeline with BPM & pitch control', icon: <Layers size={18} />, color: '#06b6d4' },
                  { title: 'MIDI Export', desc: 'Export stems as audio + MIDI to DAW', icon: <Download size={18} />, color: '#10b981' },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '10px' }}>
                    <div style={{ color: f.color, flexShrink: 0 }}>{f.icon}</div>
                    <div><div style={{ fontWeight: '700', fontSize: '13px' }}>{f.title}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{f.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.panel}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} style={{ color: '#fbbf24' }} /> Recent Generations</h3>
              {GENERATED_TRACKS.map(track => (
                <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '6px' }}>
                  <button style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Play size={13} /></button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{track.title}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.prompt}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', flexShrink: 0 }}>
                    <div style={{ color: '#a78bfa' }}>{track.model}</div>
                    <div style={{ color: '#6b7280' }}>{track.duration} • {track.bpm} BPM</div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                    {Array.from({ length: track.rating }, (_, i) => <Star key={i} size={11} style={{ color: '#fbbf24', fill: '#fbbf24' }} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ GENERATE TAB ═══ */}
        {activeTab === 'generate' && (
          <div>
            <div style={S.panel}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={16} style={{ color: '#8b5cf6' }} /> AI Model</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                {SUNO_MODELS.map(model => (
                  <button key={model.id} onClick={() => setSelectedModel(model)} style={{
                    padding: '10px', borderRadius: '10px', border: selectedModel.id === model.id ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedModel.id === model.id ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', textAlign: 'left', color: 'white'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{model.name}</div>
                    <div style={{ fontSize: '10px', color: '#a78bfa' }}>{model.type} • {model.quality} • {model.speed}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={S.panel}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} style={{ color: '#ec4899' }} /> Describe Your Sound</h3>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the music... e.g., 'Hard trap beat with 808s, dark piano, rolling hi-hats, 140 BPM C minor'" style={{
                width: '100%', minHeight: '90px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', resize: 'vertical', outline: 'none', boxSizing: 'border-box'
              }} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', alignItems: 'center' }}>
                <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} style={{
                  padding: '10px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px',
                  background: isGenerating ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white'
                }}>{isGenerating ? `Generating... ${Math.min(100, Math.round(generationProgress))}%` : '✨ Generate'}</button>
                {isGenerating && <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${Math.min(100, generationProgress)}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '4px', transition: 'width 0.3s' }} /></div>}
              </div>
            </div>
            <div style={S.panel}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} style={{ color: '#f59e0b' }} /> Quick Presets — GOAT Force</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {GENERATION_PRESETS.map(preset => (
                  <button key={preset.id} onClick={() => { setSelectedPreset(preset); setPrompt(`${preset.desc} — ${preset.genre}, ${preset.bpm} BPM, ${preset.key}`); }} style={{
                    padding: '12px', borderRadius: '10px', border: selectedPreset?.id === preset.id ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPreset?.id === preset.id ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', textAlign: 'left', color: 'white'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>{preset.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{preset.name}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>{preset.genre} • {preset.bpm} BPM • {preset.key}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PIANO ROLL TAB ═══ */}
        {activeTab === 'pianoroll' && (
          <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.3)', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
              <button onClick={() => setIsGlobalPlaying(!isGlobalPlaying)} style={S.transportBtn(isGlobalPlaying)}>{isGlobalPlaying ? <Pause size={13} /> : <Play size={13} />}</button>
              <button onClick={() => { setIsGlobalPlaying(false); setGlobalPlayhead(0); }} style={S.smallBtn}><Square size={12} /></button>
              <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
              {[{ id: 'select', icon: MousePointer }, { id: 'draw', icon: Pencil }, { id: 'erase', icon: Eraser }, { id: 'cut', icon: Scissors }].map(t => (
                <button key={t.id} onClick={() => setPianoTool(t.id)} style={{ ...S.smallBtn, border: pianoTool === t.id ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)', background: pianoTool === t.id ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)', color: pianoTool === t.id ? '#c4b5fd' : '#9ca3af' }}>
                  <t.icon size={12} />
                </button>
              ))}
              <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
              <Magnet size={11} style={{ color: '#f59e0b' }} />
              <select value={pianoSnap} onChange={e => setPianoSnap(e.target.value)} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'white', padding: '3px 6px', fontSize: '10px', outline: 'none' }}>
                {['1/1', '1/2', '1/4', '1/8', '1/16'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setPianoZoom(z => Math.max(0.5, z - 0.25))} style={S.smallBtn}><ZoomOut size={11} /></button>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>{Math.round(pianoZoom * 100)}%</span>
              <button onClick={() => setPianoZoom(z => Math.min(3, z + 0.25))} style={S.smallBtn}><ZoomIn size={11} /></button>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: '10px', color: '#a78bfa' }}>🎵 {globalBpm} BPM</span>
              <span style={{ fontSize: '10px', color: '#f472b6' }}>🎼 {globalKey}</span>
              <span style={{ fontSize: '10px', color: '#34d399' }}>📝 {midiNotes.length} notes</span>
            </div>

            {/* Grid */}
            <div style={{ display: 'flex', height: '380px' }}>
              {/* Piano Keys */}
              <div style={{ width: '52px', flexShrink: 0, overflowY: 'hidden', background: 'rgba(0,0,0,0.7)', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
                {ALL_NOTES.map((note) => {
                  const isBlack = note.includes('#');
                  const isC = note.startsWith('C') && !note.includes('#');
                  return (
                    <div key={note} style={{
                      height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
                      background: isBlack ? 'rgba(0,0,0,0.8)' : 'rgba(30,30,50,0.6)',
                      borderBottom: isC ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.03)',
                      fontSize: '8px', color: isC ? '#a78bfa' : '#4b5563', fontWeight: isC ? '700' : '400'
                    }}>{note}</div>
                  );
                })}
              </div>
              {/* Note Grid */}
              <div ref={pianoGridRef} onClick={handlePianoClick} style={{ flex: 1, overflow: 'auto', position: 'relative', cursor: pianoTool === 'draw' ? 'crosshair' : pianoTool === 'erase' ? 'not-allowed' : 'default' }}>
                <div style={{ width: `${128 * 24 * pianoZoom}px`, height: `${ALL_NOTES.length * 16}px`, position: 'relative' }}>
                  {ALL_NOTES.map((note, i) => {
                    const isBlack = note.includes('#');
                    const isC = note.startsWith('C') && !note.includes('#');
                    return <div key={`r-${i}`} style={{ position: 'absolute', top: `${i * 16}px`, left: 0, right: 0, height: '16px', background: isBlack ? 'rgba(0,0,0,0.3)' : 'rgba(20,20,40,0.2)', borderBottom: isC ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(255,255,255,0.02)' }} />;
                  })}
                  {Array.from({ length: 128 }, (_, i) => (
                    <div key={`b-${i}`} style={{ position: 'absolute', left: `${i * 24 * pianoZoom}px`, top: 0, bottom: 0, width: '1px', background: i % 4 === 0 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)' }} />
                  ))}
                  {midiNotes.map(note => {
                    const idx = ALL_NOTES.indexOf(note.note);
                    if (idx === -1) return null;
                    return (
                      <div key={note.id} style={{
                        position: 'absolute', left: `${note.start * 24 * pianoZoom}px`, top: `${idx * 16 + 1}px`,
                        width: `${note.duration * 24 * pianoZoom - 1}px`, height: '14px',
                        background: `linear-gradient(135deg, ${note.color}, ${note.color}cc)`, borderRadius: '3px',
                        border: selectedMidiNotes.has(note.id) ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', paddingLeft: '3px',
                        fontSize: '7px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', overflow: 'hidden'
                      }}>{note.duration * 24 * pianoZoom > 28 && note.note}</div>
                    );
                  })}
                  <div style={{ position: 'absolute', left: `${globalPlayhead * 24 * pianoZoom / 4}px`, top: 0, bottom: 0, width: '2px', background: '#ef4444', zIndex: 20, boxShadow: '0 0 8px rgba(239,68,68,0.5)' }} />
                </div>
              </div>
            </div>
            {/* Velocity */}
            <div style={{ height: '60px', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', padding: '4px 56px', gap: '2px' }}>
              {midiNotes.slice(0, 50).map(n => (
                <div key={n.id} style={{ width: `${Math.max(3, n.duration * 6)}px`, height: `${(n.velocity / 127) * 48}px`, background: `linear-gradient(to top, ${n.color}, ${n.color}88)`, borderRadius: '2px 2px 0 0', flexShrink: 0 }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP SEQUENCER TAB ═══ */}
        {activeTab === 'sequencer' && (
          <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.3)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
              <button onClick={() => { setIsGlobalPlaying(false); setSeqStep(-1); }} style={S.smallBtn}><SkipBack size={12} /></button>
              <button onClick={() => setIsGlobalPlaying(!isGlobalPlaying)} style={S.transportBtn(isGlobalPlaying)}>{isGlobalPlaying ? <Pause size={13} /> : <Play size={13} />}</button>
              <button onClick={() => { setIsGlobalPlaying(false); setSeqStep(-1); }} style={S.smallBtn}><Square size={12} /></button>
              <input value={patternName} onChange={e => setPatternName(e.target.value)} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#c4b5fd', padding: '5px 10px', fontSize: '12px', fontWeight: '700', outline: 'none', width: '200px' }} />
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '4px 10px', fontSize: '12px' }}>
                <span style={{ color: '#fca5a5' }}>BPM:</span> <span style={{ color: '#ef4444', fontWeight: '900' }}>{globalBpm}</span>
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: '10px', color: '#fbbf24' }}>Step: {seqStep + 1}/32</span>
              <button onClick={() => { setChannels(prev => [...prev, { id: channelNextId, name: `Ch ${channelNextId}`, type: 'drum', color: ['#ef4444','#f59e0b','#84cc16','#06b6d4','#8b5cf6','#ec4899'][channelNextId % 6], volume: 75, pan: 0, muted: false, solo: false, icon: '🔊', pattern: new Array(32).fill(0) }]); setChannelNextId(p => p + 1); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>
                <Plus size={12} /> Add
              </button>
            </div>

            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '460px' }}>
              <div style={{ minWidth: '850px' }}>
                {/* Beat header */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '180px', flexShrink: 0, padding: '3px 8px', fontSize: '9px', color: '#6b7280' }}>Channel</div>
                  <div style={{ display: 'flex', flex: 1 }}>
                    {Array.from({ length: 32 }, (_, i) => (
                      <div key={i} style={{ width: '22px', height: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: i % 4 === 0 ? '700' : '400', color: i % 4 === 0 ? '#a78bfa' : '#4b5563', borderLeft: i % 4 === 0 ? '1px solid rgba(139,92,246,0.3)' : 'none' }}>
                        {i % 4 === 0 ? Math.floor(i / 4) + 1 : ''}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel rows */}
                {channels.map(ch => {
                  const hasSolo = channels.some(c => c.solo);
                  const isActive = !ch.muted && (!hasSolo || ch.solo);
                  return (
                    <div key={ch.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: isActive ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                      <div onClick={() => setSelectedChannel(ch.id === selectedChannel ? null : ch.id)} style={{ width: '180px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px', cursor: 'pointer' }}>
                        <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: ch.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '14px' }}>{ch.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</div>
                          <div style={{ fontSize: '8px', color: '#6b7280' }}>{ch.type} • {ch.volume}%</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setChannels(p => p.map(c => c.id === ch.id ? { ...c, muted: !c.muted } : c)); }} style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', fontSize: '7px', fontWeight: '700', background: ch.muted ? '#ef4444' : 'rgba(255,255,255,0.1)', color: ch.muted ? 'white' : '#6b7280', cursor: 'pointer' }}>M</button>
                        <button onClick={e => { e.stopPropagation(); setChannels(p => p.map(c => c.id === ch.id ? { ...c, solo: !c.solo } : c)); }} style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', fontSize: '7px', fontWeight: '700', background: ch.solo ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: ch.solo ? 'black' : '#6b7280', cursor: 'pointer' }}>S</button>
                      </div>
                      <div style={{ display: 'flex', flex: 1 }}>
                        {ch.pattern.map((step, i) => (
                          <div key={i} onClick={() => toggleStep(ch.id, i)} style={{ width: '22px', height: '26px', flexShrink: 0, cursor: 'pointer', padding: '2px', borderLeft: i % 4 === 0 ? '1px solid rgba(139,92,246,0.2)' : 'none', background: seqStep === i ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                            <div style={{
                              width: '100%', height: '100%', borderRadius: '3px', transition: 'all 0.1s',
                              background: step ? `linear-gradient(135deg, ${ch.color}, ${ch.color}aa)` : i % 8 < 4 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                              border: step ? `1px solid ${ch.color}` : '1px solid rgba(255,255,255,0.05)',
                              boxShadow: step && seqStep === i ? `0 0 8px ${ch.color}66` : 'none',
                              transform: step && seqStep === i ? 'scale(1.15)' : 'scale(1)'
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedChannel && (() => {
              const ch = channels.find(c => c.id === selectedChannel);
              if (!ch) return null;
              return (
                <div style={{ borderTop: '1px solid rgba(139,92,246,0.3)', background: 'rgba(0,0,0,0.4)', padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div><div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Name</div><input value={ch.name} onChange={e => setChannels(p => p.map(c => c.id === ch.id ? { ...c, name: e.target.value } : c))} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'white', padding: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} /></div>
                  <div><div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Volume: {ch.volume}%</div><input type="range" min="0" max="100" value={ch.volume} onChange={e => setChannels(p => p.map(c => c.id === ch.id ? { ...c, volume: parseInt(e.target.value) } : c))} style={{ width: '100%', accentColor: ch.color }} /></div>
                  <div><div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Pan: {ch.pan > 0 ? `R${ch.pan}` : ch.pan < 0 ? `L${Math.abs(ch.pan)}` : 'C'}</div><input type="range" min="-100" max="100" value={ch.pan} onChange={e => setChannels(p => p.map(c => c.id === ch.id ? { ...c, pan: parseInt(e.target.value) } : c))} style={{ width: '100%', accentColor: ch.color }} /></div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                    <button onClick={() => setChannels(p => p.map(c => c.id === ch.id ? { ...c, pattern: Array.from({ length: 32 }, () => Math.random() < 0.25 ? 1 : 0) } : c))} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', fontSize: '10px' }}>🎲 Random</button>
                    <button onClick={() => setChannels(p => p.map(c => c.id === ch.id ? { ...c, pattern: new Array(32).fill(0) } : c))} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', fontSize: '10px' }}>🗑️ Clear</button>
                    <button onClick={() => setChannels(p => p.filter(c => c.id !== ch.id))} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', cursor: 'pointer', fontSize: '10px' }}>❌ Delete</button>
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', color: '#6b7280' }}>
              <span>🥁 Channel Rack — FL Studio Style</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ padding: '3px 8px', borderRadius: '5px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#9ca3af', cursor: 'pointer', fontSize: '10px' }}>📥 Export MIDI</button>
                <button style={{ padding: '3px 8px', borderRadius: '5px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: '700' }}>💾 Save</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PLAYLIST TAB ═══ */}
        {activeTab === 'playlist' && (
          <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.3)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
              <button onClick={() => { setIsGlobalPlaying(false); setGlobalPlayhead(0); }} style={S.smallBtn}><SkipBack size={12} /></button>
              <button onClick={() => setIsGlobalPlaying(!isGlobalPlaying)} style={S.transportBtn(isGlobalPlaying)}>{isGlobalPlaying ? <Pause size={13} /> : <Play size={13} />}</button>
              <button onClick={() => { setIsGlobalPlaying(false); setGlobalPlayhead(0); }} style={S.smallBtn}><Square size={12} /></button>
              <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '3px 10px', fontFamily: 'monospace', fontSize: '14px', fontWeight: '900', color: '#10b981' }}>
                {formatTime((globalPlayhead / 4) * (60 / globalBpm) * 4)}
              </div>
              <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '3px 10px', fontSize: '11px' }}>
                <span style={{ color: '#a78bfa' }}>Bar:</span> <span style={{ color: '#c4b5fd', fontWeight: '900', fontFamily: 'monospace' }}>{Math.floor(globalPlayhead / 4) + 1}</span>
              </div>
              <button onClick={() => setLoopEnabled(!loopEnabled)} style={{ padding: '3px 10px', borderRadius: '8px', border: loopEnabled ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.1)', background: loopEnabled ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', color: loopEnabled ? '#fbbf24' : '#6b7280', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                🔁 Loop {loopEnabled ? 'On' : 'Off'}
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setPlaylistZoom(z => Math.max(0.5, z - 0.25))} style={S.smallBtn}><ZoomOut size={11} /></button>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>{Math.round(playlistZoom * 100)}%</span>
              <button onClick={() => setPlaylistZoom(z => Math.min(3, z + 0.25))} style={S.smallBtn}><ZoomIn size={11} /></button>
            </div>

            <div style={{ display: 'flex', maxHeight: '420px' }}>
              {/* Track Headers */}
              <div style={{ width: '160px', flexShrink: 0, overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ height: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '9px', color: '#6b7280' }}>🏷️ Markers</div>
                {playlistTracks.map(track => (
                  <div key={track.id} style={{ height: `${track.height}px`, display: 'flex', alignItems: 'center', gap: '5px', padding: '0 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '3px', height: '60%', borderRadius: '2px', background: track.color }} />
                    <span style={{ fontSize: '12px' }}>{track.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: track.muted ? '#6b7280' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.name}</div>
                    </div>
                    <button onClick={() => setPlaylistTracks(p => p.map(t => t.id === track.id ? { ...t, muted: !t.muted } : t))} style={{ width: '16px', height: '16px', borderRadius: '3px', border: 'none', fontSize: '6px', fontWeight: '700', background: track.muted ? '#ef4444' : 'rgba(255,255,255,0.1)', color: track.muted ? 'white' : '#6b7280', cursor: 'pointer' }}>M</button>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
                <div style={{ width: `${48 * 48 * playlistZoom}px`, position: 'relative' }}>
                  {/* Marker row */}
                  <div style={{ height: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
                    {Array.from({ length: 48 }, (_, i) => (
                      <div key={i} style={{ position: 'absolute', left: `${i * 48 * playlistZoom}px`, top: 0, bottom: 0, width: `${48 * playlistZoom}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: i % 4 === 0 ? '#a78bfa' : '#4b5563', borderLeft: i % 4 === 0 ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>{i + 1}</div>
                    ))}
                    {ARRANGEMENT_MARKERS.map((m, i) => (
                      <div key={i} style={{ position: 'absolute', left: `${m.bar * 48 * playlistZoom}px`, top: '2px', background: `${m.color}33`, border: `1px solid ${m.color}`, borderRadius: '3px', padding: '0px 5px', fontSize: '7px', fontWeight: '700', color: m.color, zIndex: 5 }}>{m.label}</div>
                    ))}
                  </div>

                  {/* Track rows with clips */}
                  {playlistTracks.map(track => (
                    <div key={track.id} style={{ height: `${track.height}px`, position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: track.muted ? 0.3 : 1 }}>
                      {Array.from({ length: 48 }, (_, i) => (
                        <div key={i} style={{ position: 'absolute', left: `${i * 48 * playlistZoom}px`, top: 0, bottom: 0, width: '1px', background: i % 4 === 0 ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)' }} />
                      ))}
                      {track.clips.map(clip => (
                        <div key={clip.id} onClick={() => setSelectedClip(selectedClip === clip.id ? null : clip.id)} style={{
                          position: 'absolute', left: `${clip.start * 48 * playlistZoom + 2}px`, top: '3px',
                          width: `${clip.duration * 48 * playlistZoom - 4}px`, height: `${track.height - 6}px`,
                          background: `linear-gradient(135deg, ${clip.color}cc, ${clip.color}88)`, borderRadius: '5px',
                          border: selectedClip === clip.id ? '2px solid #fbbf24' : `1px solid ${clip.color}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 6px', overflow: 'hidden', zIndex: 5
                        }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1px', opacity: 0.25, padding: '3px' }}>
                            {Array.from({ length: Math.max(8, Math.floor(clip.duration * 48 * playlistZoom / 5)) }, (_, j) => (
                              <div key={j} style={{ width: '2px', flexShrink: 0, height: `${20 + Math.random() * 60}%`, background: 'white', borderRadius: '1px' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: 'white', position: 'relative', zIndex: 2, textShadow: '0 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>{clip.pattern}</span>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Playhead */}
                  <div style={{ position: 'absolute', left: `${(globalPlayhead / 4) * 48 * playlistZoom}px`, top: 0, bottom: 0, width: '2px', background: '#ef4444', zIndex: 20, boxShadow: '0 0 10px rgba(239,68,68,0.5)', pointerEvents: 'none' }}>
                    <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', position: 'absolute', top: '-2px', left: '-4px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', color: '#6b7280' }}>
              <span>🎬 Playlist — Arrangement View</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: '#a78bfa' }}>{playlistTracks.length} tracks</span>
                <span style={{ color: '#f472b6' }}>{playlistTracks.reduce((s, t) => s + t.clips.length, 0)} clips</span>
              </div>
              <button style={{ padding: '3px 8px', borderRadius: '5px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: '700' }}>💾 Save Project</button>
            </div>
          </div>
        )}

        {/* ═══ SOUND LIBRARY TAB ═══ */}
        {activeTab === 'library' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input value={librarySearch} onChange={e => setLibrarySearch(e.target.value)} placeholder="Search instruments, tags..." style={{ width: '100%', padding: '9px 9px 9px 32px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {['all', 'vocals', 'strings', 'piano', 'guitar', 'woodwinds', 'hybrid', 'keys', 'fx'].map(f => (
                <button key={f} onClick={() => setLibraryFilter(f)} style={S.btn(libraryFilter === f, '#8b5cf6')}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {filteredInstruments.map(inst => (
                <div key={inst.id} style={{ ...S.panel, position: 'relative', marginBottom: 0 }}>
                  {inst.free && <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#10b981', color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px' }}>FREE</div>}
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '3px' }}>{inst.name}</div>
                  <div style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '6px' }}>{inst.category} • {inst.format} • {inst.size}</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {inst.tags.map(tag => <span key={tag} style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>{tag}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '8px' }}>
                    <span style={{ color: '#fbbf24' }}>⭐ {inst.rating > 0 ? `+${inst.rating}` : 'New'}</span>
                    <span style={{ color: '#6b7280' }}>{inst.downloads > 0 ? `${inst.downloads.toLocaleString()} dl` : 'Coming soon'}</span>
                  </div>
                  <button style={{ width: '100%', padding: '7px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}>Load Instrument</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ DAW TOOLS TAB ═══ */}
        {activeTab === 'software' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {PRODUCTION_SOFTWARE.map(sw => (
              <div key={sw.id} style={{ ...S.panel, position: 'relative', marginBottom: 0, borderColor: `${sw.color}33` }}>
                {sw.free && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px' }}>FREE</div>}
                <div style={{ fontSize: '32px', marginBottom: '6px' }}>{sw.icon}</div>
                <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '2px', color: sw.color }}>{sw.name}</div>
                <div style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '6px' }}>v{sw.version} • {sw.type}</div>
                <p style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '10px', lineHeight: '1.5' }}>{sw.desc}</p>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                  {sw.platforms.map(p => <span key={p} style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', fontSize: '9px', padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>{p}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '10px' }}>
                  <span style={{ color: '#fbbf24' }}>⭐ +{sw.rating}</span>
                  {sw.downloads > 0 && <span style={{ color: '#6b7280' }}>{sw.downloads.toLocaleString()} downloads</span>}
                </div>
                <button style={{ width: '100%', padding: '9px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${sw.color}, ${sw.color}aa)`, color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Launch {sw.name}</button>
              </div>
            ))}
          </div>
        )}

        {/* ═══ STEM LAB TAB ═══ */}
        {activeTab === 'stems' && (
          <div>
            <div style={S.panelGlow('#06b6d4')}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><GitBranch size={22} style={{ color: '#06b6d4' }} /> AI Stem Separation & Generation</h2>
              <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '14px' }}>Upload any track to separate into stems, or generate new stems from scratch using Suno AI.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {['Vocals', 'Drums', 'Bass', 'Melody', 'Synth', 'FX'].map((stem, i) => {
                  const colors = ['#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];
                  return (
                    <div key={stem} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '14px', border: `1px solid ${colors[i]}33` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', color: colors[i], fontSize: '13px' }}>{stem}</span>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          <button style={S.smallBtn}><Play size={10} /></button>
                          <button style={S.smallBtn}><Download size={10} /></button>
                        </div>
                      </div>
                      <div style={{ height: '36px', background: `${colors[i]}15`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '1px', alignItems: 'end', height: '28px' }}>
                          {Array.from({ length: 30 }, (_, j) => <div key={j} style={{ width: '3px', height: `${Math.random() * 100}%`, background: colors[i], borderRadius: '1px', opacity: 0.7 }} />)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '9px', color: '#6b7280' }}><span>0:00</span><span>3:24</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={S.panel}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Upload Track for Stem Separation</h3>
              <div style={{ border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '12px', padding: '36px', textAlign: 'center', cursor: 'pointer' }}>
                <Upload size={42} style={{ color: '#8b5cf6', marginBottom: '10px' }} />
                <p style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600' }}>Drop audio file here or click to upload</p>
                <p style={{ color: '#6b7280', fontSize: '11px' }}>Supports WAV, MP3, FLAC, AIFF • Max 50MB</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MIXER TAB ═══ */}
        {activeTab === 'mixer' && (
          <div style={S.panel}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={22} style={{ color: '#10b981' }} /> Professional Mixer — {mixerChannels.length} Channels</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mixerChannels.length}, 1fr)`, gap: '6px', marginBottom: '16px' }}>
              {mixerChannels.map((ch, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: ch.color, fontWeight: '700', marginBottom: '4px' }}>{ch.name}</div>
                  {/* EQ Mini */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '6px' }}>
                    {['L', 'M', 'H'].map((band, bi) => {
                      const val = [ch.eq.low, ch.eq.mid, ch.eq.high][bi];
                      return <div key={band} style={{ width: '8px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: val > 0 ? '50%' : `${50 + val * 4}%`, height: `${Math.abs(val) * 4}%`, width: '100%', background: val > 0 ? '#10b981' : '#ef4444', borderRadius: '1px' }} />
                      </div>;
                    })}
                  </div>
                  {/* Fader */}
                  <div style={{ height: '100px', width: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0 auto', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${ch.volume}%`, background: `linear-gradient(to top, ${ch.color}, ${ch.color}88)`, borderRadius: '4px' }} />
                    <div style={{ position: 'absolute', bottom: `${ch.volume}%`, left: '-4px', width: '16px', height: '4px', background: 'white', borderRadius: '2px', transform: 'translateY(50%)' }} />
                  </div>
                  <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>{ch.volume}%</div>
                  {/* Pan */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '4px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: `${50 + ch.pan / 2}%`, top: '-2px', width: '6px', height: '8px', background: ch.color, borderRadius: '2px', transform: 'translateX(-50%)' }} />
                  </div>
                  {/* M/S */}
                  <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                    <button onClick={() => setMixerChannels(p => p.map((c, ci) => ci === i ? { ...c, muted: !c.muted } : c))} style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', background: ch.muted ? '#ef4444' : 'rgba(255,255,255,0.1)', color: ch.muted ? 'white' : '#6b7280', cursor: 'pointer', fontSize: '7px', fontWeight: '700' }}>M</button>
                    <button onClick={() => setMixerChannels(p => p.map((c, ci) => ci === i ? { ...c, solo: !c.solo } : c))} style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', background: ch.solo ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: ch.solo ? 'black' : '#6b7280', cursor: 'pointer', fontSize: '7px', fontWeight: '700' }}>S</button>
                  </div>
                  {/* FX Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', marginTop: '6px' }}>
                    {ch.fx.map(f => <span key={f} style={{ background: `${ch.color}22`, color: ch.color, fontSize: '7px', padding: '1px 4px', borderRadius: '3px' }}>{f}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🤖 AI Auto-Mix</button>
              <button style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🎛️ AI Master</button>
              <button style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📤 Export All</button>
            </div>
          </div>
        )}

        {/* ═══ SONO AI ASSISTANT TAB ═══ */}
        {activeTab === 'assistant' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '16px' }}>
            <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', height: '550px', marginBottom: 0 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Brain size={16} style={{ color: '#ec4899' }} /> Sono Production AI</h3>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    padding: '10px', borderRadius: '10px', maxWidth: '85%',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : msg.role === 'system' ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'system' ? '1px solid rgba(236,72,153,0.3)' : 'none'
                  }}>
                    <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.content}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask about beats, samples, mixing..." style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', color: 'white', fontSize: '13px', outline: 'none' }} />
                <button onClick={handleChat} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>Send</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={S.panel}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#fbbf24' }}>🎯 Quick Prompts</h4>
                {['Make me a trap beat', 'Find vocal samples', 'How to mix 808s', 'Waka Flocka style beat', 'Show me the piano roll', 'Master my track'].map(q => (
                  <button key={q} onClick={() => setChatInput(q)} style={{ display: 'block', width: '100%', padding: '6px 8px', marginBottom: '3px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#d1d5db', cursor: 'pointer', fontSize: '11px', textAlign: 'left' }}>{q}</button>
                ))}
              </div>
              <div style={S.panel}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#10b981' }}>📊 Session Stats</h4>
                <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {[['Tracks Generated', '5', '#10b981'], ['MIDI Notes', `${midiNotes.length}`, '#8b5cf6'], ['Seq Channels', `${channels.length}`, '#ec4899'], ['Mixer Channels', `${mixerChannels.length}`, '#06b6d4'], ['Credits Used', '350', '#fbbf24']].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{l}</span><span style={{ color: c }}>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#6b7280', flexWrap: 'wrap', gap: '8px' }}>
        <span>🎹 Sono Production Lab v2.0 — All-In-One DAW • GOAT Royalty</span>
        <span>© 2025 Harvey Miller / DJ Speedy / FASTASSMAN Publishing Inc • GOAT Force Entertainment</span>
        <span style={{ color: '#10b981' }}>● All Systems Operational</span>
      </div>
    </div>
  );
}