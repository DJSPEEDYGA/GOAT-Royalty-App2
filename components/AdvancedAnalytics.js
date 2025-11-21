import { useState } from 'react'
import {
  TrendingUp, DollarSign, Music, Play, Users, Globe, Calendar,
  BarChart3, PieChart, Activity, Zap, Target, Award, ArrowUp, ArrowDown
} from 'lucide-react'

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30days')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 125840.50,
      revenueChange: 23.5,
      totalStreams: 2400000,
      streamsChange: 18.2,
      totalTracks: 347,
      tracksChange: 5.1,
      avgPerStream: 0.0524,
      avgChange: 4.3
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 8500, streams: 180000 },
      { month: 'Feb', revenue: 9200, streams: 195000 },
      { month: 'Mar', revenue: 10800, streams: 220000 },
      { month: 'Apr', revenue: 12400, streams: 245000 },
      { month: 'May', revenue: 14200, streams: 280000 },
      { month: 'Jun', revenue: 16500, streams: 320000 },
      { month: 'Jul', revenue: 18200, streams: 350000 },
      { month: 'Aug', revenue: 19800, streams: 385000 },
      { month: 'Sep', revenue: 21500, streams: 410000 },
      { month: 'Oct', revenue: 23100, streams: 445000 },
      { month: 'Nov', revenue: 25200, streams: 480000 }
    ],
    platformBreakdown: [
      { name: 'Spotify', revenue: 45230.20, percentage: 35.9, streams: 1200000, color: 'from-green-500 to-emerald-600' },
      { name: 'Apple Music', revenue: 32150.75, percentage: 25.5, streams: 850000, color: 'from-pink-500 to-rose-600' },
      { name: 'YouTube', revenue: 28460.30, percentage: 22.6, streams: 350000, color: 'from-red-500 to-orange-600' },
      { name: 'Amazon Music', revenue: 12000.00, percentage: 9.5, streams: 180000, color: 'from-blue-500 to-cyan-600' },
      { name: 'Tidal', revenue: 7999.25, percentage: 6.5, streams: 120000, color: 'from-purple-500 to-indigo-600' }
    ],
    topCountries: [
      { country: 'United States', streams: 850000, revenue: 44625, flag: '🇺🇸' },
      { country: 'United Kingdom', streams: 420000, revenue: 22050, flag: '🇬🇧' },
      { country: 'Canada', streams: 280000, revenue: 14700, flag: '🇨🇦' },
      { country: 'Germany', streams: 245000, revenue: 12862, flag: '🇩🇪' },
      { country: 'Australia', streams: 195000, revenue: 10237, flag: '🇦🇺' },
      { country: 'France', streams: 165000, revenue: 8662, flag: '🇫🇷' },
      { country: 'Brazil', streams: 145000, revenue: 7612, flag: '🇧🇷' },
      { country: 'Japan', streams: 100000, revenue: 5250, flag: '🇯🇵' }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 28, count: 672000 },
        { range: '25-34', percentage: 35, count: 840000 },
        { range: '35-44', percentage: 22, count: 528000 },
        { range: '45-54', percentage: 10, count: 240000 },
        { range: '55+', percentage: 5, count: 120000 }
      ],
      gender: [
        { type: 'Male', percentage: 52, count: 1248000 },
        { type: 'Female', percentage: 45, count: 1080000 },
        { type: 'Other', percentage: 3, count: 72000 }
      ]
    },
    topTracks: [
      { title: 'Summer Nights', streams: 450000, revenue: 23625, growth: 15.2 },
      { title: 'City Lights', streams: 380000, revenue: 19950, growth: 12.8 },
      { title: 'Midnight Drive', streams: 320000, revenue: 16800, growth: 8.5 },
      { title: 'Ocean Waves', streams: 280000, revenue: 14700, growth: -3.2 },
      { title: 'Desert Storm', streams: 250000, revenue: 13125, growth: 18.7 }
    ],
    predictions: {
      nextMonth: {
        revenue: 27500,
        streams: 520000,
        confidence: 87
      },
      yearEnd: {
        revenue: 165000,
        streams: 3200000,
        confidence: 82
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-gray-400">Deep insights into your music performance</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl text-white focus:outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-800/30 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                {analytics.overview.revenueChange}%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ${analytics.overview.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-800/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Play className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                {analytics.overview.streamsChange}%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {(analytics.overview.totalStreams / 1000000).toFixed(1)}M
            </h3>
            <p className="text-gray-400 text-sm">Total Streams</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                {analytics.overview.tracksChange}%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {analytics.overview.totalTracks}
            </h3>
            <p className="text-gray-400 text-sm">Active Tracks</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-red-800/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center text-orange-400 text-sm font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                {analytics.overview.avgChange}%
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ${analytics.overview.avgPerStream.toFixed(4)}
            </h3>
            <p className="text-gray-400 text-sm">Avg Per Stream</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
        <h3 className="text-xl font-bold text-white mb-6">Revenue & Streams Over Time</h3>
        <div className="space-y-4">
          {analytics.revenueByMonth.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 w-12">{month.month}</span>
                <span className="text-green-400 font-medium">${month.revenue.toLocaleString()}</span>
                <span className="text-blue-400 font-medium">{(month.streams / 1000).toFixed(0)}K streams</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${(month.revenue / 25200) * 100}%` }}
                  />
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 h-full rounded-full transition-all"
                    style={{ width: `${(month.streams / 480000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown & Top Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Platform Breakdown */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Platform Breakdown</h3>
          <div className="space-y-4">
            {analytics.platformBreakdown.map((platform, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center`}>
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{platform.name}</p>
                      <p className="text-sm text-gray-400">{platform.streams.toLocaleString()} streams</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${platform.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{platform.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${platform.color} h-2 rounded-full transition-all`}
                    style={{ width: `${platform.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Top Countries</h3>
          <div className="space-y-3">
            {analytics.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-purple-500/5 rounded-xl hover:bg-purple-500/10 transition-all">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-medium text-white">{country.country}</p>
                    <p className="text-sm text-gray-400">{country.streams.toLocaleString()} streams</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">${country.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics & Top Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Demographics */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Audience Demographics</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Age Groups</h4>
            <div className="space-y-3">
              {analytics.demographics.ageGroups.map((group, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{group.range}</span>
                    <span className="text-purple-400 font-medium">{group.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Gender Distribution</h4>
            <div className="space-y-3">
              {analytics.demographics.gender.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{item.type}</span>
                    <span className="text-blue-400 font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Tracks */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Top Performing Tracks</h3>
          <div className="space-y-3">
            {analytics.topTracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-purple-500/5 rounded-xl hover:bg-purple-500/10 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{track.title}</p>
                    <p className="text-sm text-gray-400">{track.streams.toLocaleString()} streams</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">${track.revenue.toLocaleString()}</p>
                  <div className={`flex items-center justify-end text-sm ${track.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {track.growth > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {Math.abs(track.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">AI-Powered Predictions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Next Month Forecast</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Predicted Revenue</span>
                <span className="text-2xl font-bold text-green-400">${analytics.predictions.nextMonth.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Predicted Streams</span>
                <span className="text-2xl font-bold text-blue-400">{(analytics.predictions.nextMonth.streams / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <span className="text-lg font-bold text-purple-400">{analytics.predictions.nextMonth.confidence}%</span>
              </div>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Year-End Projection</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Projected Revenue</span>
                <span className="text-2xl font-bold text-green-400">${analytics.predictions.yearEnd.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Projected Streams</span>
                <span className="text-2xl font-bold text-blue-400">{(analytics.predictions.yearEnd.streams / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <span className="text-lg font-bold text-purple-400">{analytics.predictions.yearEnd.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}