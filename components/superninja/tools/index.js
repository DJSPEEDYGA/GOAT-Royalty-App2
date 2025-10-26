// SuperNinja AI Tools Integration
// This file exports all available tools for the SuperNinja AI component

import { cinemaCameraTool } from './cinemaCameraTool';
import { sora2AITool } from './sora2AITool';
import { royaltyCalculatorTool } from './royaltyCalculatorTool';
import { contractAnalyzerTool } from './contractAnalyzerTool';
import { ipProtectionTool } from './ipProtectionTool';
import { musicStudioTool } from './musicStudioTool';
import { trackingDashboardTool } from './trackingDashboardTool';
import { moneypennySearchTool } from './moneypennySearchTool';
import { codexEngineTool } from './codexEngineTool';

// Export all tools as a single object
export const superninjaTools = {
  cinemaCamera: cinemaCameraTool,
  sora2AI: sora2AITool,
  royaltyCalculator: royaltyCalculatorTool,
  contractAnalyzer: contractAnalyzerTool,
  ipProtection: ipProtectionTool,
  musicStudio: musicStudioTool,
  trackingDashboard: trackingDashboardTool,
  moneypennySearch: moneypennySearchTool,
  codexEngine: codexEngineTool
};

// Export tool metadata for UI display
export const toolMetadata = {
  cinemaCamera: {
    name: "Cinema Camera System",
    description: "Professional RED Cinema-level video recording controls",
    category: "Media Production",
    icon: "🎥"
  },
  sora2AI: {
    name: "Sora 2 AI Studio",
    description: "AI-powered video generation with advanced prompt engineering",
    category: "AI Generation",
    icon: "🎬"
  },
  royaltyCalculator: {
    name: "Royalty Calculator",
    description: "Calculate music royalties based on industry standards",
    category: "Financial Tools",
    icon: "💰"
  },
  contractAnalyzer: {
    name: "Contract Analyzer",
    description: "Analyze music contracts for potential issues and opportunities",
    category: "Legal Tools",
    icon: "📝"
  },
  ipProtection: {
    name: "IP Protection Vault",
    description: "Manage copyright registrations and intellectual property",
    category: "Legal Tools",
    icon: "🛡️"
  },
  musicStudio: {
    name: "Music Studio",
    description: "Track management and metadata editing tools",
    category: "Content Management",
    icon: "🎵"
  },
  trackingDashboard: {
    name: "Tracking Dashboard",
    description: "Analytics and insights for royalty tracking",
    category: "Analytics",
    icon: "📈"
  },
  moneypennySearch: {
    name: "Moneypenny AI Search",
    description: "AI-powered search assistant with natural language queries",
    category: "Search Tools",
    icon: "🔍"
  },
  codexEngine: {
    name: "Codex Engine",
    description: "Global royalty tracking and collection management",
    category: "Tracking Tools",
    icon: "🌐"
  }
};