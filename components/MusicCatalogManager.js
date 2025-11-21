import { useState, useEffect } from 'react'
import {
  Music, Search, Filter, Upload, Edit, Trash2, Download, Play, Pause,
  MoreVertical, Grid, List, Calendar, DollarSign, TrendingUp, Eye,
  Share2, Heart, MessageCircle, BarChart3, Globe, Award, Star, Zap
} from 'lucide-react'

export default function MusicCatalogManager() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTracks, setSelectedTracks] = useState([])
  const [playingTrack, setPlayingTrack] = useState(null)

  // Mock catalog data
  const tracks = [
    {
      id: 1,
      title: 'Summer Nights',
      artist: 'HARVEY LEE MILLER',
      album: 'Sunset Dreams',
      genre: 'Pop',
      duration: '3:45',
      releaseDate: '2025-06-15',
      streams: 450000,
      revenue: 3200.50,
      platforms: ['Spotify', 'Apple Music', 'YouTube'],
      status: 'published',
      trend: 'up',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345678',
      bpm: 128,
      key: 'C Major'
    },
    {
      id: 2,
      title: 'City Lights',
      artist: 'HARVEY LEE MILLER',
      album: 'Urban Stories',
      genre: 'R&B',
      duration: '4:12',
      releaseDate: '2025-05-20',
      streams: 380000,
      revenue: 2850.75,
      platforms: ['Spotify', 'Apple Music', 'Tidal'],
      status: 'published',
      trend: 'up',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345679',
      bpm: 95,
      key: 'A Minor'
    },
    {
      id: 3,
      title: 'Midnight Drive',
      artist: 'HARVEY LEE MILLER',
      album: 'Night Sessions',
      genre: 'Electronic',
      duration: '5:30',
      releaseDate: '2025-04-10',
      streams: 320000,
      revenue: 2400.25,
      platforms: ['Spotify', 'YouTube', 'SoundCloud'],
      status: 'published',
      trend: 'stable',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345680',
      bpm: 120,
      key: 'D Minor'
    },
    {
      id: 4,
      title: 'Ocean Waves',
      artist: 'HARVEY LEE MILLER',
      album: 'Coastal Vibes',
      genre: 'Ambient',
      duration: '6:15',
      releaseDate: '2025-03-05',
      streams: 280000,
      revenue: 2100.00,
      platforms: ['Spotify', 'Apple Music'],
      status: 'published',
      trend: 'down',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345681',
      bpm: 80,
      key: 'E Major'
    },
    {
      id: 5,
      title: 'Desert Storm',
      artist: 'HARVEY LEE MILLER',
      album: 'Wild West',
      genre: 'Rock',
      duration: '4:45',
      releaseDate: '2025-02-14',
      streams: 250000,
      revenue: 1950.50,
      platforms: ['Spotify', 'YouTube', 'Amazon Music'],
      status: 'published',
      trend: 'up',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345682',
      bpm: 140,
      key: 'G Major'
    },
    {
      id: 6,
      title: 'Neon Dreams',
      artist: 'HARVEY LEE MILLER',
      album: 'Future Sounds',
      genre: 'Synthwave',
      duration: '3:58',
      releaseDate: '2025-01-20',
      streams: 195000,
      revenue: 1650.25,
      platforms: ['Spotify', 'Bandcamp'],
      status: 'published',
      trend: 'up',
      artwork: '/api/placeholder/300/300',
      isrc: 'USRC12345683',
      bpm: 110,
      key: 'F# Minor'
    }
  ]

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.genre.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'trending') return matchesSearch && track.trend === 'up'
    if (filterBy === 'recent') return matchesSearch
    return matchesSearch
  })

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const togglePlayTrack = (trackId) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Music Catalog</h1>
            <p className="text-gray-400">Manage your complete music library</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Track</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tracks</p>
                <p className="text-2xl font-bold text-white">{tracks.length}</p>
              </div>
              <Music className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Streams</p>
                <p className="text-2xl font-bold text-white">
                  {(tracks.reduce((sum, t) => sum + t.streams, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${tracks.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Trending Up</p>
                <p className="text-2xl font-bold text-white">
                  {tracks.filter(t => t.trend === 'up').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, albums, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all">All Tracks</option>
              <option value="trending">Trending</option>
              <option value="recent">Recent</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="revenue">Highest Revenue</option>
            </select>
            <div className="flex bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTracks.length > 0 && (
        <div className="mb-6 bg-purple-600/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-medium">
              {selectedTracks.length} track{selectedTracks.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="bg-black/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all overflow-hidden group"
            >
              {/* Artwork */}
              <div className="relative aspect-square bg-gradient-to-br from-purple-900 to-blue-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-24 h-24 text-white/20" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => togglePlayTrack(track.id)}
                    className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    {playingTrack === track.id ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedTracks.includes(track.id)}
                    onChange={() => toggleTrackSelection(track.id)}
                    className="w-5 h-5 rounded border-2 border-white/50 bg-black/50 checked:bg-purple-600"
                  />
                </div>
                {track.trend === 'up' && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Trending</span>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{track.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{track.album}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {track.genre}
                  </span>
                  <span className="text-gray-400 text-sm">{track.duration}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Streams</p>
                    <p className="text-sm font-bold text-white">{(track.streams / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Revenue</p>
                    <p className="text-sm font-bold text-white">${track.revenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {track.platforms.slice(0, 3).map((platform, idx) => (
                      <div key={idx} className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Globe className="w-3 h-3 text-purple-400" />
                      </div>
                    ))}
                  </div>
                  <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="bg-black/50 backdrop-blur-lg rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all p-4"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedTracks.includes(track.id)}
                  onChange={() => toggleTrackSelection(track.id)}
                  className="w-5 h-5 rounded border-2 border-purple-500/50 bg-black/50 checked:bg-purple-600"
                />
                <button
                  onClick={() => togglePlayTrack(track.id)}
                  className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  {playingTrack === track.id ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <h3 className="font-bold text-white">{track.title}</h3>
                    <p className="text-sm text-gray-400">{track.album}</p>
                  </div>
                  <div>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {track.genre}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Streams</p>
                    <p className="font-bold text-white">{(track.streams / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="font-bold text-green-400">${track.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {track.trend === 'up' && (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    )}
                    <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}