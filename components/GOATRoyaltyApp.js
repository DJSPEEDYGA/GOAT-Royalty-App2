// GOAT Royalty App Core Frontend + Backend API Integration
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Search, Globe, ShieldCheck, Music2, Youtube, BadgeDollarSign, Bot, Crown } from "lucide-react";
import SuperNinjaAI from "./SuperNinjaAI";

export default function GOATRoyaltyApp() {
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
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                GOAT Royalty Force
              </h1>
              <p className="text-gray-400 mt-2">
                Truth, Justice, and Pay Us Our Money! 💰
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="protection" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Protection
            </TabsTrigger>
            <TabsTrigger value="studio" className="flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              Studio
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="superninja" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              SuperNinja AI
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <BadgeDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400">Total Collected</p>
                    <p className="text-2xl font-bold">{royaltyStats.totalCollected}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400">Pending Claims</p>
                    <p className="text-2xl font-bold">{royaltyStats.pendingClaims}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400">Unmatched</p>
                    <p className="text-2xl font-bold">{royaltyStats.unmatchedRoyalties}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400">Countries</p>
                    <p className="text-2xl font-bold">{royaltyStats.countriesCovered}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Search Royalties</h2>
              <p className="text-gray-400">Search functionality will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Music Catalog</h2>
              <p className="text-gray-400">Your music catalog management will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Protection Tab */}
          <TabsContent value="protection" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">IP Protection</h2>
              <p className="text-gray-400">Intellectual property protection features will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Studio Tab */}
          <TabsContent value="studio" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Music Studio</h2>
              <p className="text-gray-400">Music production and royalty calculation tools will be implemented here.</p>
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Royalty Tracking</h2>
              <p className="text-gray-400">Track your royalties across platforms and territories.</p>
            </div>
          </TabsContent>

          {/* SuperNinja AI Tab */}
          <TabsContent value="superninja" className="mt-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-4">
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

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>© 2024 Harvey L. Miller Jr. (DJ Speedy) & Waka Flocka Flame</p>
          <p className="mt-2">GOAT Royalty Force v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}