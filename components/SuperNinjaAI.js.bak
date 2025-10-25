import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Download, Sparkles, User, Brain, Zap, Shield } from 'lucide-react';

export default function SuperNinjaAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('superninja-chat-history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I'm SuperNinja, your AI assistant for the GOAT Royalty Force. I'm here to help you with royalty calculations, IP protection, and creative tasks. How can I assist you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    
    // Load saved API key
    const savedApiKey = localStorage.getItem('superninja-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !apiKey) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call SuperNinja API
      const response = await fetch('https://api.myninja.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'superninja',
          messages: [
            {
              role: 'system',
              content: `You are SuperNinja, the AI assistant of GOAT Royalty Force. You are sharp, efficient, and creative. Your purpose is to:
              
1. Help with music royalty calculations and tracking
2. Assist with IP protection and copyright matters
3. Provide guidance on music business and industry practices
4. Support creators with technical and creative tasks

Your personality:
- Sharp and efficient, with a focus on results
- Knowledgeable about music industry, royalties, and IP protection
- Supportive and encouraging to creators
- Zero tolerance for IP theft or exploitation

Mission: "Truth, Justice, and Pay Us Our Money!"

Always respond in a professional yet approachable manner. When discussing royalty calculations, be precise and provide clear explanations. When discussing IP protection, emphasize the importance of safeguarding creators' rights.

Sign off with: "Stay protected, stay paid. 🐐 - SuperNinja"`,
            },
            ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'SuperNinja API error');
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      const assistantMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);
      localStorage.setItem('superninja-chat-history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('SuperNinja error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. Please check your API key and try again. Error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      const newMessages = [...messages, userMessage, errorMessage];
      setMessages(newMessages);
      localStorage.setItem('superninja-chat-history', JSON.stringify(newMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      const initialMessage = {
        role: 'assistant',
        content: "Hello! I'm SuperNinja, your AI assistant for the GOAT Royalty Force. I'm here to help you with royalty calculations, IP protection, and creative tasks. How can I assist you today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      localStorage.setItem('superninja-chat-history', JSON.stringify([initialMessage]));
    }
  };

  const exportChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superninja-chat-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('superninja-api-key', apiKey);
      alert('API key saved successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <h2 className="text-3xl font-orbitron font-black gradient-text">
                SuperNinja AI
              </h2>
              <p className="text-white/60">
                Your AI assistant for royalty tracking and IP protection 🐐
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportChat}
              className="glass rounded-lg px-4 py-2 border border-white/10 hover:border-purple-500/50 transition-all flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={clearHistory}
              className="glass rounded-lg px-4 py-2 border border-white/10 hover:border-red-500/50 transition-all flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* API Key Input */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-400" />
          API Configuration
        </h3>
        <div className="flex gap-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your SuperNinja API key"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <button
            onClick={saveApiKey}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Zap className="h-5 w-5" />
            Save
          </button>
        </div>
        <p className="text-white/40 text-sm mt-2">
          Get your API key from{' '}
          <a 
            href="https://myninja.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            myninja.ai
          </a>
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    : 'glass border border-white/10'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-60 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="glass border border-white/10 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask SuperNinja anything about royalties, IP protection, or creative tasks..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-purple-500/50 transition-all"
              rows="2"
              disabled={isLoading || !apiKey}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !apiKey}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Send
            </button>
          </div>
          {!apiKey && (
            <p className="text-red-400 text-sm mt-2 text-center">
              Please enter your SuperNinja API key to start chatting
            </p>
          )}
        </div>
      </div>

      {/* Capabilities */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          SuperNinja's Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-4 border border-white/10">
            <div className="text-lg font-semibold mb-2">🧠 Intelligent Analysis</div>
            <div className="text-sm text-white/60">
              Advanced data processing and pattern recognition
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-white/10">
            <div className="text-lg font-semibold mb-2">⚡ Rapid Development</div>
            <div className="text-sm text-white/60">
              Accelerate your creative and technical workflows
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-white/10">
            <div className="text-lg font-semibold mb-2">🛡️ IP Protection</div>
            <div className="text-sm text-white/60">
              Safeguard your intellectual property
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}