import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Music, DollarSign, TrendingUp, FileText, Users, Play, Plus, Eye, Download,
  LogOut, User, Settings, Home, BarChart3, Mic2, Globe, Sparkles, Menu, X,
  ChevronRight, Calendar, Clock, Award, Target, Zap, Activity, PieChart
} from 'lucide-react'

export default function EnhancedDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Mock data for demonstration
  const stats = {
    totalRoyalties: 125840.50,
    activeTracks: 347,
    monthlyStreams: 2400000,
    growthRate: 89,
    pendingPayments: 15420.75,
    thisMonth: 18650.25,
    lastMonth: 12340.50,
    platforms: [
      { name: 'Spotify', revenue: 45230.20, streams: 1200000, growth: 12 },
      { name: 'Apple Music', revenue: 32150.75, streams: 850000, growth: 8 },
      { name: 'YouTube', revenue: 28460.30, streams: 350000, growth: 15 },
      { name: 'Amazon Music', revenue: 12000.00, streams: 180000, growth: 5 },
      { name: 'Tidal', revenue: 7999.25, streams: 120000, growth: 3 }
    ],
    recentActivity: [
      { type: 'payment', title: 'Spotify Royalty Payment', amount: 2450.50, date: '2025-11-20' },
      { type: 'track', title: 'New Track Added: "Summer Vibes"', date: '2025-11-19' },
      { type: 'milestone', title: '1M Streams Milestone Reached', date: '2025-11-18' },
      { type: 'payment', title: 'Apple Music Payment', amount: 1850.25, date: '2025-11-17' },
      { type: 'contract', title: 'Publishing Deal Signed', date: '2025-11-15' }
    ],
    topTracks: [
      { title: 'Summer Nights', streams: 450000, revenue: 3200.50, trend: 'up' },
      { title: 'City Lights', streams: 380000, revenue: 2850.75, trend: 'up' },
      { title: 'Midnight Drive', streams: 320000, revenue: 2400.25, trend: 'stable' },
      { title: 'Ocean Waves', streams: 280000, revenue: 2100.00, trend: 'down' },
      { title: 'Desert Storm', streams: 250000, revenue: 1950.50, trend: 'up' }
    ]
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'catalog', label: 'Music Catalog', icon: Music },
    { id: 'royalties', label: 'Royalties', icon: DollarSign },
    { id: 'streaming', label: 'Streaming', icon: Play },
    { id: 'publishing', label: 'Publishing', icon: FileText },
    { id: 'ai-studio', label: 'AI Studio', icon: Sparkles },
    { id: 'contracts', label: 'Contracts', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-black/80 backdrop-blur-xl border-r border-purple-500/20 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GOAT Royalty</h1>
                <p className="text-xs text-purple-400">Pro Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {sidebarOpen && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">HARVEY LEE MILLER</p>
                <p className="text-xs text-gray-400">FastAssMan Publishing</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-black/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <p className="text-sm text-gray-400">Welcome back, HARVEY LEE MILLER</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Track</span>
              </button>
              <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.growthRate}%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                ${stats.totalRoyalties.toLocaleString()}
              </h3>
              <p className="text-gray-400 text-sm">Total Royalties</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Music className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.activeTracks}</h3>
              <p className="text-gray-400 text-sm">Active Tracks</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:shadow-xl hover:shadow-pink-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <Play className="w-6 h-6 text-pink-400" />
                </div>
                <span className="text-pink-400 text-sm font-medium">This Month</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {(stats.monthlyStreams / 1000000).toFixed(1)}M
              </h3>
              <p className="text-gray-400 text-sm">Monthly Streams</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all hover:shadow-xl hover:shadow-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-medium">Growth</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.growthRate}%</h3>
              <p className="text-gray-400 text-sm">Growth Rate</p>
            </div>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Performance */}
            <div className="lg:col-span-2 bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Platform Performance</h3>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {stats.platforms.map((platform, index) => (
                  <div key={index} className="bg-purple-500/5 rounded-xl p-4 hover:bg-purple-500/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{platform.name}</p>
                          <p className="text-sm text-gray-400">{platform.streams.toLocaleString()} streams</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">${platform.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-400 flex items-center justify-end">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{platform.growth}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(platform.revenue / stats.totalRoyalties) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-purple-500/10 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'payment' ? 'bg-green-500/20' :
                      activity.type === 'track' ? 'bg-blue-500/20' :
                      activity.type === 'milestone' ? 'bg-purple-500/20' :
                      'bg-orange-500/20'
                    }`}>
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-400" />}
                      {activity.type === 'track' && <Music className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'milestone' && <Award className="w-4 h-4 text-purple-400" />}
                      {activity.type === 'contract' && <FileText className="w-4 h-4 text-orange-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                      {activity.amount && (
                        <p className="text-sm text-green-400 font-medium mt-1">
                          +${activity.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tracks */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Top Performing Tracks</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                View All Tracks →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.topTracks.map((track, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                    <div className={`p-1 rounded ${
                      track.trend === 'up' ? 'bg-green-500/20' :
                      track.trend === 'down' ? 'bg-red-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {track.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {track.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />}
                      {track.trend === 'stable' && <Activity className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <h4 className="font-medium text-white mb-2 truncate">{track.title}</h4>
                  <p className="text-sm text-gray-400 mb-1">{track.streams.toLocaleString()} streams</p>
                  <p className="text-lg font-bold text-green-400">${track.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Upload Track</h4>
              <p className="text-sm text-white/80">Add new music to your catalog</p>
            </button>

            <button className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">View Analytics</h4>
              <p className="text-sm text-white/80">Deep dive into your data</p>
            </button>

            <button className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">AI Studio</h4>
              <p className="text-sm text-white/80">Create with AI assistance</p>
            </button>

            <button className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-pink-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Export Reports</h4>
              <p className="text-sm text-white/80">Download your data</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}