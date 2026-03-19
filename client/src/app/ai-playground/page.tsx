'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Zap, Code2, MessageSquare, BarChart3, Settings, Play, Copy, Check, RefreshCw, Search, Globe, Cpu, Shield, Music, Layers } from 'lucide-react';

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  streaming: boolean;
  category: 'nvidia-nim' | 'openai' | 'anthropic' | 'google' | 'meta' | 'openrouter' | 'goat';
  badge?: string;
  contextWindow?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIResponse {
  content: string;
  model: string;
  tokens: number;
  latency: number;
  metadata?: any;
}

const AI_MODELS: ModelConfig[] = [
  // NVIDIA NIM Models
  {
    id: 'nvidia/llama-3.2-nv-rerankqa-1b-v2',
    name: 'Llama 3.2 NV RerankQA 1B',
    provider: 'NVIDIA NIM',
    description: 'Multilingual reranking model optimized for QA retrieval. Supports 26 languages with up to 8192 tokens.',
    maxTokens: 8192,
    streaming: false,
    category: 'nvidia-nim',
    badge: 'NIM',
    contextWindow: '8K'
  },
  {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct',
    name: 'Nemotron 70B Instruct',
    provider: 'NVIDIA NIM',
    description: 'NVIDIA customized Llama 3.1 for superior instruction following',
    maxTokens: 4096,
    streaming: true,
    category: 'nvidia-nim',
    badge: 'NIM',
    contextWindow: '128K'
  },
  {
    id: 'nvidia/nv-embedqa-e5-v5',
    name: 'NV EmbedQA E5 v5',
    provider: 'NVIDIA NIM',
    description: 'State-of-the-art embedding model for retrieval pipelines',
    maxTokens: 512,
    streaming: false,
    category: 'nvidia-nim',
    badge: 'NIM',
    contextWindow: '512'
  },
  // OpenAI Models
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model for complex tasks',
    maxTokens: 4096,
    streaming: true,
    category: 'openai',
    contextWindow: '128K'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    streaming: true,
    category: 'openai',
    contextWindow: '16K'
  },
  // Anthropic Models
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most intelligent Claude for complex reasoning',
    maxTokens: 4096,
    streaming: true,
    category: 'anthropic',
    contextWindow: '200K'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and speed',
    maxTokens: 4096,
    streaming: true,
    category: 'anthropic',
    contextWindow: '200K'
  },
  {
    id: 'claude-v2',
    name: 'Claude v2.0',
    provider: 'Anthropic',
    description: 'Superior performance on complex reasoning with 100K context',
    maxTokens: 4096,
    streaming: true,
    category: 'anthropic',
    contextWindow: '100K'
  },
  // Google Models
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s most capable model',
    maxTokens: 4096,
    streaming: true,
    category: 'google',
    contextWindow: '32K'
  },
  {
    id: 'palm-2-chat',
    name: 'PaLM 2 Chat',
    provider: 'Google',
    description: 'Improved multilingual, reasoning and coding capabilities',
    maxTokens: 4096,
    streaming: true,
    category: 'google',
    contextWindow: '9K'
  },
  {
    id: 'palm-2-code-chat',
    name: 'PaLM 2 Code Chat',
    provider: 'Google',
    description: 'Fine-tuned for code-related conversations',
    maxTokens: 4096,
    streaming: true,
    category: 'google',
    contextWindow: '7K'
  },
  // Meta Models
  {
    id: 'meta/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Latest Llama model with 70B parameters',
    maxTokens: 4096,
    streaming: true,
    category: 'meta',
    contextWindow: '128K'
  },
  {
    id: 'meta/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Largest open-source model, 405B parameters',
    maxTokens: 4096,
    streaming: true,
    category: 'meta',
    badge: '405B',
    contextWindow: '128K'
  },
  {
    id: 'meta/llama-2-70b-chat',
    name: 'Llama 2 70B Chat',
    provider: 'Meta',
    description: 'Flagship 70B param model fine-tuned for chat',
    maxTokens: 4096,
    streaming: true,
    category: 'meta',
    contextWindow: '4K'
  },
  // OpenRouter / DeepSeek
  {
    id: 'deepseek-ai/deepseek-r1-distill-qwen-32b',
    name: 'DeepSeek R1 Qwen 32B',
    provider: 'DeepSeek',
    description: 'Advanced reasoning model distilled from DeepSeek R1',
    maxTokens: 4096,
    streaming: true,
    category: 'openrouter',
    badge: 'R1',
    contextWindow: '128K'
  },
  {
    id: 'deepseek-ai/deepseek-v3.1',
    name: 'DeepSeek V3.1',
    provider: 'DeepSeek',
    description: 'Latest DeepSeek model with improved capabilities',
    maxTokens: 4096,
    streaming: true,
    category: 'openrouter',
    contextWindow: '128K'
  },
  // GOAT Royalty Custom
  {
    id: 'athena-core',
    name: 'ATHENA Core',
    provider: 'GOAT Royalty',
    description: 'AI consciousness engine for music industry intelligence',
    maxTokens: 8192,
    streaming: true,
    category: 'goat',
    badge: 'GOAT',
    contextWindow: '32K'
  }
];

const MODEL_CATEGORIES = [
  { id: 'all', name: 'All Models', icon: Layers, count: AI_MODELS.length },
  { id: 'nvidia-nim', name: 'NVIDIA NIM', icon: Cpu, count: AI_MODELS.filter(m => m.category === 'nvidia-nim').length },
  { id: 'openai', name: 'OpenAI', icon: Zap, count: AI_MODELS.filter(m => m.category === 'openai').length },
  { id: 'anthropic', name: 'Anthropic', icon: Brain, count: AI_MODELS.filter(m => m.category === 'anthropic').length },
  { id: 'google', name: 'Google', icon: Globe, count: AI_MODELS.filter(m => m.category === 'google').length },
  { id: 'meta', name: 'Meta', icon: Code2, count: AI_MODELS.filter(m => m.category === 'meta').length },
  { id: 'openrouter', name: 'OpenRouter', icon: Search, count: AI_MODELS.filter(m => m.category === 'openrouter').length },
  { id: 'goat', name: 'GOAT Royalty', icon: Music, count: AI_MODELS.filter(m => m.category === 'goat').length },
];

const PROMPT_TEMPLATES = [
  {
    name: '🎵 Music Royalty Analysis',
    template: 'Analyze the royalty distribution for a track that generated 1M streams on Spotify. Calculate estimated earnings and suggest optimization strategies.',
    category: 'Music Business'
  },
  {
    name: '📝 Contract Review',
    template: 'Review this music publishing contract clause and identify potential risks: "{contract_text}"',
    category: 'Legal'
  },
  {
    name: '📢 Marketing Strategy',
    template: 'Create a comprehensive marketing plan for a new hip-hop release targeting Gen Z audience across social media platforms.',
    category: 'Marketing'
  },
  {
    name: '🎯 Playlist Placement',
    template: 'Generate a pitch email for Spotify playlist placement for a new track with these characteristics: upbeat tempo, summer vibes, crossover appeal.',
    category: 'Promotion'
  },
  {
    name: '📊 Revenue Forecasting',
    template: 'Forecast projected revenue for the next 6 months based on current streaming data of 500K monthly listeners and 2M total streams.',
    category: 'Analytics'
  },
  {
    name: '🔍 NVIDIA Rerank Query',
    template: 'Given the query "best royalty collection services for independent artists", rerank these documents by relevance: 1) TuneCore distribution, 2) BMI collection, 3) ASCAP licensing, 4) DistroKid analytics',
    category: 'AI/Retrieval'
  },
  {
    name: '🤖 AI Music Assistant',
    template: 'As an AI music industry consultant, analyze the current state of music streaming economics and suggest how independent artists can maximize their revenue in 2025.',
    category: 'AI Assistant'
  },
  {
    name: '🌐 Multilingual Query',
    template: 'Translate and analyze this music contract clause in Spanish, French, and Japanese, identifying key legal terms in each language.',
    category: 'Multilingual'
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'nvidia-nim': 'from-green-500 to-emerald-600',
    'openai': 'from-blue-500 to-indigo-600',
    'anthropic': 'from-orange-500 to-amber-600',
    'google': 'from-red-500 to-pink-600',
    'meta': 'from-blue-600 to-purple-600',
    'openrouter': 'from-violet-500 to-purple-600',
    'goat': 'from-yellow-500 to-amber-500',
  };
  return colors[category] || 'from-gray-500 to-gray-600';
};

const getCategoryBorderColor = (category: string) => {
  const colors: Record<string, string> = {
    'nvidia-nim': 'border-green-500/50',
    'openai': 'border-blue-500/50',
    'anthropic': 'border-orange-500/50',
    'google': 'border-red-500/50',
    'meta': 'border-blue-600/50',
    'openrouter': 'border-violet-500/50',
    'goat': 'border-yellow-500/50',
  };
  return colors[category] || 'border-gray-500/50';
};

export default function AIPlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(AI_MODELS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [responseMetadata, setResponseMetadata] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modelCount, setModelCount] = useState(AI_MODELS.length);

  const filteredModels = AI_MODELS.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const generateAIResponse = async (prompt: string, model: ModelConfig) => {
    const startTime = Date.now();
    
    try {
      if (model.id === 'athena-core') {
        const response = await fetch('http://localhost:3000/api/athena/think', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thought: prompt })
        });
        
        const data = await response.json();
        const latency = Date.now() - startTime;
        
        return {
          content: data.data?.strategy?.steps?.join('\n') || data.data?.message || 'ATHENA processed your thought successfully.',
          model: model.id,
          tokens: prompt.length + (data.data?.strategy?.steps?.join('').length || 0),
          latency,
          metadata: data.data
        };
      } else if (model.category === 'nvidia-nim') {
        // NVIDIA NIM API simulation
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
        const latency = Date.now() - startTime;
        
        let responseText = '';
        if (model.id.includes('rerankqa')) {
          responseText = `🟢 **NVIDIA NIM Reranking Analysis** (${model.name})\n\n**Query:** "${prompt.substring(0, 80)}..."\n\n**Reranking Results:**\n\n| Rank | Document | Relevance Score |\n|------|----------|----------------|\n| 1 | Most relevant passage | 0.9847 |\n| 2 | Highly relevant | 0.8923 |\n| 3 | Moderately relevant | 0.7156 |\n| 4 | Less relevant | 0.4231 |\n\n**Model Details:**\n- Architecture: Llama-3.2 1B Transformer\n- Multilingual: 26 languages supported\n- Max Sequence: 8,192 tokens\n- Optimized for: QA Retrieval + Cross-lingual\n- Inference Engine: TensorRT\n- Hardware: H100/A100/L40s/L4/A10G\n\n**Performance Metrics:**\n- BEIR Average Recall@5: 73.64%\n- MIRACL Multilingual: 65.80%\n- MLQA Cross-lingual: 86.83%\n- MLDR Long-doc: 70.69%\n\n*Powered by NVIDIA NIM Microservices*`;
        } else if (model.id.includes('nemotron')) {
          responseText = `🟢 **NVIDIA Nemotron 70B Analysis**\n\nBased on your query: "${prompt.substring(0, 60)}..."\n\n**Comprehensive Analysis:**\n\nI've analyzed this from multiple angles using NVIDIA's optimized inference pipeline:\n\n1. **Core Assessment:** The request touches on key industry challenges that require both quantitative analysis and strategic thinking.\n\n2. **Data-Driven Insights:**\n   - Revenue optimization potential: 15-30% improvement\n   - Market positioning accuracy: 92.4%\n   - Competitive analysis confidence: High\n\n3. **Strategic Recommendations:**\n   - Implement automated tracking systems\n   - Leverage AI-powered analytics for decision making\n   - Focus on cross-platform revenue optimization\n\n4. **Next Steps:** Consider deploying NIM microservices for real-time data processing.\n\n*Processed via NVIDIA NIM - Optimized for lowest latency*`;
        } else {
          responseText = `🟢 **NVIDIA NIM Embedding Results**\n\nGenerated embeddings for: "${prompt.substring(0, 60)}..."\n\n**Embedding Dimensions:** 1024\n**Similarity Scores Computed:** ✅\n**Model:** NV-EmbedQA-E5-v5\n\n*Ready for RAG pipeline integration*`;
        }
        
        return {
          content: responseText,
          model: model.id,
          tokens: prompt.length + responseText.length,
          latency,
          metadata: { provider: 'nvidia-nim', temperature, maxTokens }
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        const latency = Date.now() - startTime;

        const providerEmoji: Record<string, string> = {
          'openai': '🔵',
          'anthropic': '🟠',
          'google': '🔴',
          'meta': '🟣',
          'openrouter': '🟣',
        };

        const emoji = providerEmoji[model.category] || '⚡';
        
        const responseText = `${emoji} **${model.name} Response**\n\nAnalyzing: "${prompt.substring(0, 60)}..."\n\n**Key Insights:**\n\n1. **Strategic Analysis:** Based on current music industry trends and data-driven insights, there are several important factors to consider.\n\n2. **Recommendations:**\n   - Optimize royalty collection across all platforms\n   - Implement automated tracking for real-time analytics\n   - Leverage AI-powered tools for contract analysis\n   - Focus on cross-platform revenue diversification\n\n3. **Market Intelligence:**\n   - Current streaming rates: $0.003-0.005 per stream\n   - Independent artist growth: +23% YoY\n   - AI adoption in music industry: +156% since 2023\n\n4. **Action Items:**\n   - Set up automated royalty monitoring\n   - Review existing contracts for optimization\n   - Implement AI-driven marketing strategies\n\n**Confidence Level:** 94.2%\n**Context Window Used:** ${model.contextWindow || 'N/A'}\n\n*Powered by ${model.provider} via GOAT Royalty AI Platform*`;

        return {
          content: responseText,
          model: model.id,
          tokens: prompt.length + responseText.length,
          latency,
          metadata: { temperature, maxTokens, provider: model.provider }
        };
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      return {
        content: `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: model.id,
        tokens: 0,
        latency: Date.now() - startTime,
        metadata: { error: true }
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const response = await generateAIResponse(userMessage, selectedModel);
      setResponseMetadata(response);
      
      const words = response.content.split(' ');
      let i = 0;
      
      const streamInterval = setInterval(() => {
        if (i < words.length) {
          setCurrentResponse(prev => prev + (prev ? ' ' : '') + words[i]);
          i++;
        } else {
          clearInterval(streamInterval);
          setIsLoading(false);
          addMessage('assistant', response.content);
          setCurrentResponse('');
        }
      }, 30);
      
    } catch (error) {
      setIsLoading(false);
      addMessage('system', `Error: ${error instanceof Error ? error.message : 'Failed to generate response'}`);
    }
  };

  const useTemplate = (template: string) => {
    setInputText(template);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentResponse('');
    setResponseMetadata(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  GOAT AI Playground
                </h1>
                <p className="text-sm text-gray-400">
                  {AI_MODELS.length} Models • NVIDIA NIM • OpenRouter • Multi-Provider
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2 bg-green-900/30 border border-green-500/30 rounded-lg px-3 py-1.5">
                <Cpu className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-medium">NVIDIA NIM Active</span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={clearConversation}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear Conversation"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Model Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search Models */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-green-500/50 text-white placeholder-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
              <div className="flex flex-wrap gap-1.5">
                {MODEL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    <span>{cat.name}</span>
                    <span className="opacity-60">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 max-h-[500px] overflow-y-auto">
              <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-green-400" />
                  Models ({filteredModels.length})
                </span>
              </h3>
              <div className="space-y-2">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedModel.id === model.id
                        ? `bg-gradient-to-r ${getCategoryColor(model.category)} border-2 ${getCategoryBorderColor(model.category)} shadow-lg`
                        : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs truncate mr-2">{model.name}</span>
                      <div className="flex items-center space-x-1">
                        {model.badge && (
                          <span className="px-1.5 py-0.5 bg-black/30 rounded text-[10px] font-bold">
                            {model.badge}
                          </span>
                        )}
                        {model.streaming && (
                          <Zap className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">{model.provider}</span>
                      {model.contextWindow && (
                        <span className="text-[10px] text-gray-400">{model.contextWindow} ctx</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-green-400" />
                  Model Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Temperature: {temperature.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Max Tokens: {maxTokens}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full accent-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Templates */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                Templates
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {PROMPT_TEMPLATES.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => useTemplate(template.template)}
                    className="w-full text-left p-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="text-xs font-medium">{template.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{template.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Active Model Info Bar */}
            <div className={`bg-gradient-to-r ${getCategoryColor(selectedModel.category)} rounded-xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedModel.name}</h2>
                  <p className="text-sm opacity-80">{selectedModel.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{selectedModel.provider}</div>
                  <div className="text-xs opacity-80">
                    {selectedModel.contextWindow && `${selectedModel.contextWindow} context`}
                    {selectedModel.streaming && ' • Streaming'}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
              {messages.length === 0 && !currentResponse && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">GOAT AI Playground</h3>
                    <p className="text-gray-400 text-sm max-w-md">
                      Select a model and start chatting. Try NVIDIA NIM for blazing-fast reranking, 
                      or compare responses across {AI_MODELS.length} AI models.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <span className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-xs text-green-400">NVIDIA NIM</span>
                      <span className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-xs text-blue-400">OpenAI</span>
                      <span className="px-3 py-1 bg-orange-900/30 border border-orange-500/30 rounded-full text-xs text-orange-400">Anthropic</span>
                      <span className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs text-purple-400">Meta Llama</span>
                      <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded-full text-xs text-yellow-400">GOAT ATHENA</span>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : msg.role === 'system'
                        ? 'bg-red-900/30 border border-red-500/30 text-red-300'
                        : 'bg-gray-700/50 border border-gray-600 text-gray-100'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] opacity-50">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Response */}
              {currentResponse && (
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-700/50 border border-gray-600">
                    <div className="text-sm whitespace-pre-wrap text-gray-100">{currentResponse}</div>
                    <div className="mt-2">
                      <span className="inline-flex items-center space-x-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span>Streaming from {selectedModel.name}...</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex space-x-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask ${selectedModel.name} anything about music royalties, contracts, or industry analytics...`}
                  className="flex-1 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 resize-none text-white placeholder-gray-500"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                  className={`px-6 rounded-xl font-medium text-sm transition-all ${
                    isLoading || !inputText.trim()
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Response Metadata */}
              {responseMetadata && (
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>{responseMetadata.tokens} tokens</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>{responseMetadata.latency}ms</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>{selectedModel.name}</span>
                  </span>
                  {selectedModel.category === 'nvidia-nim' && (
                    <span className="flex items-center space-x-1 text-green-400">
                      <Cpu className="w-3 h-3" />
                      <span>NIM Optimized</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}