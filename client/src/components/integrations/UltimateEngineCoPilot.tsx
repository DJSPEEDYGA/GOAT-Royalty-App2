'use client';

import { useState } from 'react';
import { 
  Crown, 
  Zap, 
  CheckCircle, 
  ExternalLink, 
  Code, 
  Brain, 
  Gamepad2,
  Cpu,
  Lock,
  Star,
  XCircle,
  ArrowRight,
  PlayCircle,
  FileText,
  HelpCircle
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "True AI Partner",
    description: "Select any node and ask AI to add logic directly after it. Explain complex Blueprints conversationally.",
    highlight: true
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "Full C++ Source Code",
    description: "One-time purchase gives you complete ownership. Modify, extend, and learn from the code. No black boxes.",
    highlight: true
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Local LLM Support",
    description: "Run completely offline with local LLMs. No server dependencies, no usage fees. Your AI, your control.",
    highlight: false
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "17+ AI Models Supported",
    description: "Connect to Gemini, Claude Desktop, Cursor, GitHub Copilot, DeepSeek, and more. Desktop & browser AI.",
    highlight: false
  },
  {
    icon: <Gamepad2 className="h-5 w-5" />,
    title: "FAB Featured",
    description: "Featured on Epic Games FAB (Feb 5-9, 2026). Battle-tested by the community. The standard for UE5.",
    highlight: false
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Multi-Language Support",
    description: "Think in English, Spanish, German, Chinese - create in Unreal. AI understands intent, not just words.",
    highlight: false
  }
];

const comparison = [
  { feature: "Pricing Model", copilot: "One-time purchase", others: "Monthly subscription" },
  { feature: "Source Code", copilot: "Full C++ included", others: "Closed source" },
  { feature: "Usage Limits", copilot: "Unlimited (local LLM)", others: "Pay-per-use limits" },
  { feature: "Connection Methods", copilot: "Multiple (Desktop + Web)", others: "Single server only" },
  { feature: "Ownership", copilot: "Buy once, own forever", others: "License fees forever" },
  { feature: "Support", copilot: "Direct Discord dev access", others: "Corporate support" }
];

export function UltimateEngineCoPilot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'comparison' | 'faq'>('overview');

  return (
    <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Ultimate Engine CoPilot</h2>
                <p className="text-purple-100 text-lg">AI-Powered Unreal Engine Development</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                Version 0.3.5
              </span>
              <span className="px-3 py-1 bg-yellow-500/90 text-yellow-900 rounded-full text-sm font-medium">
                ⭐ FAB Featured
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-200 mb-1">Standard for UE5 Assistance</div>
            <div className="text-2xl font-bold">One-Time Purchase</div>
            <div className="text-purple-200 text-sm">Lifetime Updates</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Hero Description */}
        <div className="mb-8">
          <p className="text-xl text-gray-300 leading-relaxed">
            The ultimate AI copilot for Unreal Engine. Go beyond simple code generation: analyze your entire project's architecture, 
            build complex scenes and UI from a single command, and refactor Blueprints conversationally.
          </p>
          <p className="text-lg text-purple-300 mt-3">
            A deeply integrated development partner that understands your code, your assets, and your context.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-slate-800/50 rounded-lg p-1">
            {(['overview', 'features', 'comparison', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    feature.highlight
                      ? 'bg-purple-500/10 border-purple-500/50'
                      : 'bg-slate-800/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${feature.highlight ? 'bg-purple-500/20' : 'bg-slate-700'}`}>
                      <div className={feature.highlight ? 'text-purple-400' : 'text-gray-400'}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-2">
                🚀 The AI Revolution in Unreal is Here
              </h3>
              <p className="text-gray-300 mb-4">
                While others are manually wiring nodes, you could be directing your vision. Every hour you wait is an hour 
                your competitors are using AI to innovate, create, and ship faster than you.
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                  <ExternalLink className="h-5 w-5" />
                  <span>Get on FAB</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                  <PlayCircle className="h-5 w-5" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Documentation', icon: FileText },
                { label: 'Changelog', icon: Code },
                { label: 'FAQ', icon: HelpCircle },
                { label: 'Discord', icon: ExternalLink }
              ].map((link, idx) => (
                <button
                  key={idx}
                  className="flex items-center justify-center space-x-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Complete Feature Set</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Blueprint Analyzer",
                  description: "Add confusing Blueprints as context and have AI explain them in detail. Learn from marketplace assets.",
                  icon: <Brain className="h-5 w-5" />
                },
                {
                  title: "Conversational Refactoring",
                  description: "Select nodes and ask AI to add logic after them. Like collaborating with a senior developer.",
                  icon: <Code className="h-5 w-5" />
                },
                {
                  title: "Scene Generation",
                  description: "Build complex scenes and UI from a single command. Transform ideas into reality instantly.",
                  icon: <Gamepad2 className="h-5 w-5" />
                },
                {
                  title: "Multi-Language Support",
                  description: "Think in your native language - English, Spanish, German, Chinese, and more.",
                  icon: <Zap className="h-5 w-5" />
                },
                {
                  title: "Desktop App Integration",
                  description: "Connect to Claude Desktop, Cursor, GitHub Copilot, Google Antigravity, and more.",
                  icon: <Cpu className="h-5 w-5" />
                },
                {
                  title: "Browser AI Support",
                  description: "Connect to DeepSeek, Gemini, and other browser AIs through extensions.",
                  icon: <ExternalLink className="h-5 w-5" />
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Why CoPilot is the Best Value</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                    <th className="text-left py-3 px-4 text-purple-400 font-medium">Ultimate CoPilot</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 text-gray-300">{item.feature}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-white">{item.copilot}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-gray-500">{item.others}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            {[
              {
                q: "What do I get with my purchase?",
                a: "Full C++ source code, lifetime updates, unlimited usage with local LLM, and direct Discord support from the developer."
              },
              {
                q: "Is this a beta release?",
                a: "Yes, version 0.3.5 is in beta. Core features are stable, but bugs may occur. Your feedback helps shape the tool's future."
              },
              {
                q: "Can I modify the source code?",
                a: "Yes! Unlike subscription-based plugins, you get the full source code. Modify it for your personal use and educational purposes."
              },
              {
                q: "What AI models are supported?",
                a: "Gemini, Claude Desktop, Cursor, GitHub Copilot, Google Antigravity, DeepSeek, local LLMs, and more via desktop apps or browser extensions."
              },
              {
                q: "Is AI-generated content guaranteed to be correct?",
                a: "No. AI is a co-pilot, not an autopilot. You're responsible for reviewing, testing, and validating all generated content before use in production."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-8">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Licensed per-seat</div>
                <div className="text-xs text-gray-500">Source code for personal/educational use only</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Source by:</div>
              <div className="text-white font-medium">Solo Developer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}