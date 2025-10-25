// GOAT Royalty App - Enhanced Version with Advanced Features
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Search, Globe, ShieldCheck, Music2, Youtube, 
  BadgeDollarSign, Bot, Crown, Camera, Sparkles, Film, 
  Zap, TrendingUp, DollarSign, Users, Award
} from "lucide-react";
import SuperNinjaAI from "./SuperNinjaAI";
import AdvancedCameraSystem from "./AdvancedCameraSystem";
import Sora2AIStudio from "./Sora2AIStudio";

export default function GOATRoyaltyAppEnhanced() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [royaltyStats, setRoyaltyStats] = useState({
    totalCollected: "$0",
    pendingClaims: "$0",
    unmatchedRoyalties: "$0",
    countriesCovered: "0"
  });

  useEffect(() => {
    fetchRoyaltyStats();
  }, []);

  const fetchRoyaltyStats = async () => {
    try {
      const response = await axios.get('/api/royalty/stats');
      setRoyaltyStats(response.data);
    } catch (error) {
      console.error("Error fetching royalty stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                GOAT Royalty Force
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Truth, Justice, and Pay Us Our Money! 💰
              </p>
              <p className="text-purple-400 mt-1 text-sm">
                Professional Cinema • AI-Powered • Next-Gen Technology
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400">{royaltyStats.totalCollected}</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-9 bg-gradient-to-r from-gray-800 to-gray-900 p-2 rounded-xl border border-purple-500/30">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Catalog</span>
            </TabsTrigger>
            <TabsTrigger value="protection" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Protection</span>
            </TabsTrigger>
            <TabsTrigger value="studio" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Music2 className="h-4 w-4" />
              <span className="hidden md:inline">Studio</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Youtube className="h-4 w-4" />
              <span className="hidden md:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-purple-600">
              <Camera className="h-4 w-4" />
              <span className="hidden md:inline">Cinema</span>
            </TabsTrigger>
            <TabsTrigger value="sora2" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Sora 2 AI</span>
            </TabsTrigger>
            <TabsTrigger value="superninja" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Bot className="h-4 w-4" />
              <span className="hidden md:inline">SuperNinja</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500/30 hover:border-green-400 transition-all transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <BadgeDollarSign className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Total Collected</p>
                    <p className="text-3xl font-bold text-green-400">{royaltyStats.totalCollected}</p>
                    <p className="text-xs text-green-300 mt-1">↑ 12.5% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400 transition-all transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Pending Claims</p>
                    <p className="text-3xl font-bold text-yellow-400">{royaltyStats.pendingClaims}</p>
                    <p className="text-xs text-yellow-300 mt-1">Processing...</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-xl p-6 border border-red-500/30 hover:border-red-400 transition-all transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Unmatched</p>
                    <p className="text-3xl font-bold text-red-400">{royaltyStats.unmatchedRoyalties}</p>
                    <p className="text-xs text-red-300 mt-1">Needs attention</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400 transition-all transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Countries</p>
                    <p className="text-3xl font-bold text-blue-400">{royaltyStats.countriesCovered}</p>
                    <p className="text-xs text-blue-300 mt-1">Global reach</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                <Film className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Cinema Camera</h3>
                <p className="text-gray-400 text-sm mb-4">Professional RED-level 8K recording with AI enhancement</p>
                <button 
                  onClick={() => setActiveTab('camera')}
                  className="w-full py-2 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg hover:from-red-700 hover:to-purple-700 transition-all"
                >
                  Open Camera
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                <Sparkles className="h-8 w-8 text-pink-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Sora 2 AI Studio</h3>
                <p className="text-gray-400 text-sm mb-4">Next-gen AI video generation and enhancement</p>
                <button 
                  onClick={() => setActiveTab('sora2')}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Launch Studio
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                <Bot className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">SuperNinja AI</h3>
                <p className="text-gray-400 text-sm mb-4">Intelligent assistant with 10X Rule principles</p>
                <button 
                  onClick={() => setActiveTab('superninja')}
                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all"
                >
                  Chat with AI
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Royalty Payment Received', amount: '$2,450', platform: 'Spotify', time: '2 hours ago', color: 'green' },
                  { action: 'New Claim Submitted', amount: '$1,200', platform: 'YouTube', time: '5 hours ago', color: 'yellow' },
                  { action: 'Video Generated', amount: '8K Cinema', platform: 'Sora 2 AI', time: '1 day ago', color: 'purple' },
                  { action: 'Camera Recording', amount: '4.5 hours', platform: 'Cinema Camera', time: '2 days ago', color: 'red' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full bg-${activity.color}-400`}></div>
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.platform} • {activity.time}</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{activity.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">Search Royalties</h2>
              <p className="text-gray-400">Advanced search functionality will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">Music Catalog</h2>
              <p className="text-gray-400">Your music catalog management will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Protection Tab */}
          <TabsContent value="protection" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">IP Protection</h2>
              <p className="text-gray-400">Intellectual property protection features will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Studio Tab */}
          <TabsContent value="studio" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">Music Studio</h2>
              <p className="text-gray-400">Music production and royalty calculation tools will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">Royalty Tracking</h2>
              <p className="text-gray-400">Track your royalties across platforms and territories.</p>
            </div>
          </TabsContent>

          {/* Cinema Camera Tab */}
          <TabsContent value="camera" className="mt-6">
            <AdvancedCameraSystem />
          </TabsContent>

          {/* Sora 2 AI Tab */}
          <TabsContent value="sora2" className="mt-6">
            <Sora2AIStudio />
          </TabsContent>

          {/* SuperNinja AI Tab */}
          <TabsContent value="superninja" className="mt-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30 mb-4">
              <h2 className="text-2xl font-bold mb-4">SuperNinja AI Assistant</h2>
              <p className="text-gray-400 mb-4">
                Your intelligent AI companion for royalty management. 
                Apply the 10X Rule principles to achieve extraordinary results in your music business operations:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Set targets 10 times higher than what you think you want</li>
                <li>Take 10 times the action to achieve those targets</li>
                <li>Massive thoughts must be followed by massive actions</li>
                <li>Think and act in a wildly different way than you previously have been</li>
                <li>Be willing to do what others won't do</li>
              </ul>
            </div>
            <SuperNinjaAI />
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-800 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-purple-400" />
            <p className="text-gray-400">© 2024 Harvey L. Miller Jr. (DJ Speedy) & Waka Flocka Flame</p>
          </div>
          <p className="text-gray-500 text-sm">GOAT Royalty Force v2.0.0 - Enhanced Edition</p>
          <p className="text-purple-400 text-xs mt-1">Powered by RED Cinema Technology • Sora 2 AI • SuperNinja Intelligence</p>
        </footer>
      </div>
    </div>
  );
}