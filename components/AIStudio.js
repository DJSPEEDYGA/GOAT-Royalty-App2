import { useState } from 'react'
import {
  Sparkles, Music, Mic2, Image, FileText, Video, Wand2, Zap,
  Download, Play, Pause, RefreshCw, Settings, Save, Share2,
  TrendingUp, Target, Lightbulb, Brain, Cpu, Rocket
} from 'lucide-react'

export default function AIStudio() {
  const [activeTab, setActiveTab] = useState('music')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)

  const aiTools = [
    {
      id: 'music',
      name: 'Music Composer',
      icon: Music,
      description: 'Generate original music compositions',
      color: 'from-purple-600 to-blue-600',
      features: ['Melody Generation', 'Chord Progressions', 'Beat Making', 'Full Arrangements']
    },
    {
      id: 'lyrics',
      name: 'Lyrics Generator',
      icon: Mic2,
      description: 'Create compelling lyrics and verses',
      color: 'from-pink-600 to-purple-600',
      features: ['Verse Writing', 'Chorus Creation', 'Rhyme Schemes', 'Theme Development']
    },
    {
      id: 'artwork',
      name: 'Cover Art Creator',
      icon: Image,
      description: 'Design stunning album artwork',
      color: 'from-orange-600 to-red-600',
      features: ['Album Covers', 'Single Art', 'Social Media Graphics', 'Brand Assets']
    },
    {
      id: 'marketing',
      name: 'Marketing Copy',
      icon: FileText,
      description: 'Write promotional content',
      color: 'from-green-600 to-emerald-600',
      features: ['Press Releases', 'Social Posts', 'Email Campaigns', 'Bio Writing']
    },
    {
      id: 'video',
      name: 'Video Ideas',
      icon: Video,
      description: 'Generate music video concepts',
      color: 'from-blue-600 to-cyan-600',
      features: ['Storyboards', 'Scene Ideas', 'Visual Effects', 'Editing Tips']
    },
    {
      id: 'analytics',
      name: 'Trend Analyzer',
      icon: TrendingUp,
      description: 'Analyze market trends and opportunities',
      color: 'from-yellow-600 to-orange-600',
      features: ['Market Research', 'Competitor Analysis', 'Trend Forecasting', 'Strategy Planning']
    }
  ]

  const musicStyles = [
    'Pop', 'Hip Hop', 'R&B', 'Rock', 'Electronic', 'Jazz', 'Country', 'Classical',
    'Reggae', 'Blues', 'Folk', 'Metal', 'Indie', 'Soul', 'Funk', 'Disco'
  ]

  const moods = [
    'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Aggressive', 'Melancholic',
    'Uplifting', 'Dark', 'Dreamy', 'Intense', 'Chill', 'Mysterious', 'Playful'
  ]

  const handleGenerate = () => {
    setGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent({
        title: 'AI Generated Content',
        content: 'Your amazing AI-generated content will appear here!',
        timestamp: new Date().toISOString()
      })
      setGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Studio</h1>
                <p className="text-gray-400">Create with artificial intelligence</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-xl text-white hover:border-purple-500/50 transition-all flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiTools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`bg-black/50 backdrop-blur-lg rounded-2xl p-6 border transition-all text-left ${
                  activeTab === tool.id
                    ? 'border-purple-500/50 shadow-xl shadow-purple-500/20'
                    : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Music Composer */}
          {activeTab === 'music' && (
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Music className="w-6 h-6 mr-2 text-purple-400" />
                AI Music Composer
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Describe Your Music
                  </label>
                  <textarea
                    placeholder="E.g., 'Create an upbeat pop song with catchy hooks and summer vibes'"
                    className="w-full h-32 px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Genre
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option value="">Select Genre</option>
                      {musicStyles.map((style) => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Mood
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option value="">Select Mood</option>
                      {moods.map((mood) => (
                        <option key={mood} value={mood}>{mood}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      BPM
                    </label>
                    <input
                      type="number"
                      placeholder="120"
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Key
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option>C Major</option>
                      <option>D Minor</option>
                      <option>G Major</option>
                      <option>A Minor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="3:30"
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating Music...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Music</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Lyrics Generator */}
          {activeTab === 'lyrics' && (
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Mic2 className="w-6 h-6 mr-2 text-pink-400" />
                AI Lyrics Generator
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Song Theme or Topic
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., 'Summer love, heartbreak, overcoming challenges'"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    placeholder="Describe the story, emotions, or specific phrases you want to include..."
                    className="w-full h-32 px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Style
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option>Poetic</option>
                      <option>Conversational</option>
                      <option>Metaphorical</option>
                      <option>Direct</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Structure
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option>Verse-Chorus-Verse</option>
                      <option>Verse-Chorus-Bridge</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating Lyrics...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Lyrics</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Cover Art Creator */}
          {activeTab === 'artwork' && (
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Image className="w-6 h-6 mr-2 text-orange-400" />
                AI Cover Art Creator
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Describe Your Vision
                  </label>
                  <textarea
                    placeholder="E.g., 'A vibrant sunset over a city skyline with neon lights and palm trees'"
                    className="w-full h-32 px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Art Style
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option>Photorealistic</option>
                      <option>Abstract</option>
                      <option>Minimalist</option>
                      <option>Vintage</option>
                      <option>Futuristic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Color Palette
                    </label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                      <option>Vibrant</option>
                      <option>Pastel</option>
                      <option>Dark</option>
                      <option>Monochrome</option>
                      <option>Neon</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating Artwork...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Artwork</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              I'm here to help you create amazing content. Select a tool and describe what you want to create!
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span>Tip: Be specific for better results</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Pro features unlock advanced AI</span>
              </div>
            </div>
          </div>

          {/* Recent Generations */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Recent Generations</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-purple-500/5 rounded-xl p-3 hover:bg-purple-500/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Generated Content #{item}</span>
                    <button className="p-1 hover:bg-purple-500/20 rounded">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Usage This Month</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Generations</span>
                  <span className="text-sm font-medium text-white">47 / 100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full" style={{ width: '47%' }} />
                </div>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">
                Upgrade for Unlimited
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}