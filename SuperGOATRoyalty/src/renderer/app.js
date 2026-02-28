// ============================================================================
// SUPER GOAT ROYALTY — ULTIMATE APPLICATION ENGINE
// All-in-One: AI Chat, Terminal, Code Editor, File Manager, Browser,
// Royalty Calculator, Analytics, Server Manager, Music Production & More
// Copyright © 2025 Harvey Miller (DJ Speedy) / GOAT Royalty
// ============================================================================

const GOAT = {
  currentView: 'dashboard',
  sidebarCollapsed: false,
  chatHistory: [],
  terminalHistory: [],
  terminalCmdIndex: -1,
  terminalCwd: '',
  editorTabs: [],
  editorActiveTab: -1,
  fileManagerPath: '',
  fileManagerItems: [],
  browserHistory: [],
  browserUrl: '',
  settings: {},
  systemInfo: {},
  aiProvider: 'gemini',
  aiProviders: ['ollama','openai','gemini','claude','groq'],

  // ========================================================================
  // INITIALIZATION
  // ========================================================================
  async init() {
    console.log('🐐⚡ Super GOAT Royalty initializing...');
    try {
      this.settings = await window.goat.settings.get() || {};
      this.systemInfo = await window.goat.system.info();
      this.aiProvider = this.settings.llmProvider || 'gemini';
      this.terminalCwd = this.systemInfo.homeDir || '~';
      this.fileManagerPath = this.systemInfo.homeDir || '/';
    } catch(e) { console.error('Init error:', e); }

    // Listen for navigation events from main process
    window.goat.on('navigate', (view) => this.navigate(view));
    window.goat.on('ssh-connect', (ip) => { this.navigate('terminal'); setTimeout(() => this.sshConnect(ip), 300); });
    window.goat.on('deploy', (ip) => { this.navigate('servers'); this.toast(`Deploying to ${ip}...`, 'info'); });

    this.navigate('dashboard');
    this.toast('🐐 Super GOAT Royalty loaded!', 'success');
  },

  // ========================================================================
  // NAVIGATION
  // ========================================================================
  navigate(view) {
    this.currentView = view;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    document.getElementById('titlebar-text').textContent = this.getViewTitle(view);
    this.renderView(view);
  },

  getViewTitle(view) {
    const titles = {
      'dashboard': '🏠 Dashboard — Overview',
      'command-center': '⚡ Command Center',
      'ai-chat': '🤖 AI Chat — Multi-LLM',
      'terminal': '🖥️ Terminal — Command Line',
      'code-editor': '📝 Code Editor',
      'file-manager': '📁 File Manager',
      'browser': '🌐 Web Browser',
      'automation': '🤖 Axiom Browser Automation',
      'royalties': '💰 Royalty Calculator',
      'catalog': '🎵 Track Catalog — 3,650 Tracks',
      'analytics': '📊 Streaming Analytics',
      'publishing': '📋 Publishing Manager',
      'streaming': '📡 Streaming Platforms',
      'production': '🎹 Music Production',
      'adobe-firefly': '🎨 Adobe Firefly AI Studio',
      'sora-ai': '🎬 Sora AI Video Studio',
      'cinema-camera': '📷 Cinema Camera Suite',
      'fashion-store': '👗 Fashion Forge Studio',
      'servers': '🖥️ Server Manager',
      'nvidia-dgx': '🟢 NVIDIA DGX Cloud',
      'git-manager': '🔀 Git Manager',
      'settings': '⚙️ Settings',
      'about': 'ℹ️ About Super GOAT Royalty'
    };
    return titles[view] || view;
  },

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    document.getElementById('sidebar').classList.toggle('collapsed', this.sidebarCollapsed);
  },

  openExternal(url) {
    window.goat.shell.openExternal(url);
  },

  // ========================================================================
  // VIEW RENDERER
  // ========================================================================
  renderView(view) {
    const container = document.getElementById('view-container');
    const renderers = {
      'dashboard': () => this.renderDashboard(),
      'command-center': () => this.renderCommandCenter(),
      'ai-chat': () => this.renderAIChat(),
      'terminal': () => this.renderTerminal(),
      'code-editor': () => this.renderCodeEditor(),
      'file-manager': () => this.renderFileManager(),
      'browser': () => this.renderBrowser(),
      'automation': () => this.renderAutomation(),
      'royalties': () => this.renderRoyalties(),
      'catalog': () => this.renderCatalog(),
      'analytics': () => this.renderAnalytics(),
      'publishing': () => this.renderPublishing(),
      'streaming': () => this.renderStreaming(),
      'production': () => this.renderProduction(),
      'adobe-firefly': () => this.renderAdobeFirefly(),
      'sora-ai': () => this.renderSoraAI(),
      'cinema-camera': () => this.renderCinemaCamera(),
      'fashion-store': () => this.renderFashionStore(),
      'servers': () => this.renderServers(),
      'nvidia-dgx': () => this.renderNvidiaDGX(),
      'git-manager': () => this.renderGitManager(),
      'settings': () => this.renderSettings(),
      'about': () => this.renderAbout()
    };
    container.innerHTML = (renderers[view] || renderers['dashboard'])();
    this.afterRender(view);
  },

  afterRender(view) {
    if (view === 'terminal') this.initTerminal();
    if (view === 'file-manager') this.loadDirectory(this.fileManagerPath);
    if (view === 'ai-chat') this.scrollChatToBottom();
    if (view === 'code-editor') this.initCodeEditor();
  },

  // ========================================================================
  // DASHBOARD
  // ========================================================================
  renderDashboard() {
    return `
    <div class="content-body animate-fadeIn">
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-size:64px;margin-bottom:8px;">🐐⚡</div>
        <h1 style="font-size:32px;font-weight:800;background:var(--gradient-gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          SUPER GOAT ROYALTY</h1>
        <p style="color:var(--text-muted);font-size:14px;margin-top:4px;">
          Ultimate AI-Powered Music Production & Royalty Management Platform</p>
      </div>
      <div class="dashboard-grid">
        <div class="stat-card animate-slideUp">
          <div class="stat-value">3,650</div>
          <div class="stat-label">Total Tracks</div>
          <div class="stat-change up">↑ 1,814 Harvey + 1,836 FASTASSMAN</div>
        </div>
        <div class="stat-card animate-slideUp" style="animation-delay:0.1s">
          <div class="stat-value">$865K+</div>
          <div class="stat-label">Estimated Royalties</div>
          <div class="stat-change up">↑ 12.3% this quarter</div>
        </div>
        <div class="stat-card animate-slideUp" style="animation-delay:0.2s">
          <div class="stat-value">1.2B+</div>
          <div class="stat-label">Total Streams</div>
          <div class="stat-change up">↑ 8.7% growth</div>
        </div>
        <div class="stat-card animate-slideUp" style="animation-delay:0.3s">
          <div class="stat-value">5</div>
          <div class="stat-label">AI Providers</div>
          <div class="stat-change up">Ollama • GPT-4o • Gemini • Claude • Groq</div>
        </div>
      </div>
      <div class="dashboard-grid" style="grid-template-columns:repeat(3,1fr);">
        <div class="widget">
          <div class="panel-title">📊 Revenue by Platform</div>
          <div class="chart-bar" style="margin-top:12px;">
            ${['Spotify','Apple','YouTube','TikTok','Amazon','Tidal','Deezer','SoundCloud']
              .map((p,i) => `<div class="chart-bar-item" style="height:${30+Math.random()*70}%" title="${p}"></div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;color:var(--text-muted);">
            <span>Spotify</span><span>Apple</span><span>YT</span><span>TikTok</span><span>AMZ</span><span>Tidal</span><span>Deezer</span><span>SC</span>
          </div>
        </div>
        <div class="widget">
          <div class="panel-title">🖥️ Server Status</div>
          <div style="margin-top:12px;">
            <div class="server-card" style="margin-bottom:8px;padding:12px;">
              <div class="server-status-dot online"></div>
              <div class="server-info">
                <div class="server-name">KVM2 — Primary</div>
                <div class="server-ip">72.61.193.184</div>
              </div>
              <button class="btn btn-sm" onclick="GOAT.navigate('servers')">Manage</button>
            </div>
            <div class="server-card" style="padding:12px;">
              <div class="server-status-dot online"></div>
              <div class="server-info">
                <div class="server-name">KVM8 — Backup</div>
                <div class="server-ip">93.127.214.171</div>
              </div>
              <button class="btn btn-sm" onclick="GOAT.navigate('servers')">Manage</button>
            </div>
          </div>
        </div>
        <div class="widget">
          <div class="panel-title">⚡ Quick Actions</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
            <button class="btn" onclick="GOAT.navigate('ai-chat')">🤖 AI Chat</button>
            <button class="btn" onclick="GOAT.navigate('terminal')">🖥️ Terminal</button>
            <button class="btn" onclick="GOAT.navigate('royalties')">💰 Royalties</button>
            <button class="btn" onclick="GOAT.navigate('catalog')">🎵 Catalog</button>
            <button class="btn" onclick="GOAT.navigate('code-editor')">📝 Code</button>
            <button class="btn" onclick="GOAT.navigate('servers')">🚀 Deploy</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">🎵 Recent Tracks</div>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <thead><tr style="border-bottom:1px solid var(--border-color);text-align:left;">
            <th style="padding:8px;color:var(--text-muted);font-size:12px;">Track</th>
            <th style="padding:8px;color:var(--text-muted);font-size:12px;">Artist</th>
            <th style="padding:8px;color:var(--text-muted);font-size:12px;">Streams</th>
            <th style="padding:8px;color:var(--text-muted);font-size:12px;">Revenue</th>
          </tr></thead>
          <tbody>
            ${[
              ['Hard in Da Paint','Waka Flocka Flame','485M','$142,500'],
              ['No Hands','Waka Flocka ft. Roscoe','312M','$98,200'],
              ['Grove St. Party','Waka Flocka Flame','198M','$67,800'],
              ['Round of Applause','Waka Flocka Flame','156M','$52,100'],
              ['Bustin At Em','Waka Flocka Flame','134M','$44,300']
            ].map(([t,a,s,r]) => `<tr style="border-bottom:1px solid #1a1a1a;">
              <td style="padding:8px;font-weight:600;">${t}</td>
              <td style="padding:8px;color:var(--text-secondary);">${a}</td>
              <td style="padding:8px;color:var(--cyan);">${s}</td>
              <td style="padding:8px;color:var(--gold);font-weight:700;">${r}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  },

  // ========================================================================
  // COMMAND CENTER
  // ========================================================================
  renderCommandCenter() {
    return `
    <div class="content-body animate-fadeIn">
      <div class="panel" style="text-align:center;background:var(--gradient-dark);border-color:var(--gold);">
        <h2 style="font-size:24px;margin-bottom:8px;">⚡ Super GOAT Command Center</h2>
        <p style="color:var(--text-muted);">All your tools in one unified interface. Click any tool to launch.</p>
      </div>
      <div class="card-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));">
        ${[
          ['🤖','AI Chat','Multi-LLM AI Assistant','ai-chat'],
          ['🖥️','Terminal','Command Line Interface','terminal'],
          ['📝','Code Editor','Full Code Editor','code-editor'],
          ['📁','File Manager','Browse & Manage Files','file-manager'],
          ['🌐','Web Browser','Built-in Browser','browser'],
          ['💰','Royalties','Calculate Royalties','royalties'],
          ['🎵','Catalog','3,650 Track Catalog','catalog'],
          ['📊','Analytics','Streaming Analytics','analytics'],
          ['🎨','Adobe Firefly','AI Image Generation','adobe-firefly'],
          ['🎬','Sora AI','AI Video Studio','sora-ai'],
          ['📷','Cinema Camera','Video Production','cinema-camera'],
          ['👗','Fashion Forge','Fashion Design','fashion-store'],
          ['🖥️','Servers','Server Management','servers'],
          ['🟢','NVIDIA DGX','GPU Cloud Computing','nvidia-dgx'],
          ['🔀','Git Manager','Version Control','git-manager'],
          ['🤖','Automation','Browser Automation','automation'],
          ['📋','Publishing','Music Publishing','publishing'],
          ['🎹','Production','Music Production','production'],
          ['📡','Streaming','Platform Integration','streaming'],
          ['⚙️','Settings','App Configuration','settings']
        ].map(([icon,name,desc,view]) => `
          <div class="stat-card" style="cursor:pointer;text-align:center;" onclick="GOAT.navigate('${view}')">
            <div style="font-size:36px;margin-bottom:8px;">${icon}</div>
            <div style="font-weight:700;font-size:15px;">${name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${desc}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  },

  // ========================================================================
  // AI CHAT
  // ========================================================================
  renderAIChat() {
    return `
    <div class="chat-container h-full">
      <div class="chat-provider-bar">
        <span style="font-size:12px;color:var(--text-muted);margin-right:8px;">Provider:</span>
        ${this.aiProviders.map(p => `
          <div class="provider-chip ${p===this.aiProvider?'active':''}" onclick="GOAT.setAIProvider('${p}')">${p.charAt(0).toUpperCase()+p.slice(1)}</div>
        `).join('')}
        <div style="flex:1;"></div>
        <button class="btn btn-sm" onclick="GOAT.clearChat()">🗑️ Clear</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        ${this.chatHistory.length === 0 ? `
          <div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
            <div style="font-size:48px;margin-bottom:16px;">🐐🤖</div>
            <h3 style="color:var(--text-primary);margin-bottom:8px;">GOAT AI Assistant</h3>
            <p>Ask me anything about music production, royalties, coding, or anything else.</p>
            <p style="margin-top:8px;font-size:12px;">Using: <strong style="color:var(--gold);">${this.aiProvider}</strong></p>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
              ${['Calculate my royalties','Write a beat description','Deploy to server','Analyze my streams'].map(q => `
                <button class="btn btn-sm" onclick="GOAT.sendChat('${q}')">${q}</button>
              `).join('')}
            </div>
          </div>
        ` : this.chatHistory.map(m => `
          <div class="chat-message ${m.role}">
            <div class="chat-avatar">${m.role==='user'?'👤':'🐐'}</div>
            <div class="chat-bubble">${this.formatMessage(m.content)}</div>
          </div>
        `).join('')}
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Ask GOAT AI anything..." rows="1"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();GOAT.sendChat();}"></textarea>
        <button class="chat-send" onclick="GOAT.sendChat()" title="Send">➤</button>
      </div>
    </div>`;
  },

  async sendChat(prefill) {
    const input = document.getElementById('chat-input');
    const message = prefill || (input ? input.value.trim() : '');
    if (!message) return;
    if (input) input.value = '';

    this.chatHistory.push({ role: 'user', content: message });
    this.renderChatMessages();
    this.scrollChatToBottom();

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    const messagesEl = document.getElementById('chat-messages');
    if (messagesEl) {
      messagesEl.innerHTML += `<div class="chat-message ai" id="${typingId}">
        <div class="chat-avatar">🐐</div>
        <div class="chat-bubble"><div class="spinner"></div> Thinking...</div>
      </div>`;
      this.scrollChatToBottom();
    }

    try {
      const systemPrompt = `You are GOAT AI, the intelligent assistant for Super GOAT Royalty — a music production and royalty management platform owned by Harvey Miller (DJ Speedy). You help with music production, royalty calculations, streaming analytics, coding, server management, and creative tasks. You have access to a catalog of 3,650 tracks (1,814 Harvey L Miller + 1,836 FASTASSMAN Publishing). Be helpful, knowledgeable, and professional. Format responses with markdown when appropriate.`;
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.chatHistory.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content }))
      ];

      const result = await window.goat.ai.chat({ provider: this.aiProvider, messages });
      
      // Remove typing indicator
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      if (result.error) {
        this.chatHistory.push({ role: 'ai', content: `⚠️ Error: ${result.error}\n\nTry switching to a different AI provider or check your API keys in Settings.` });
      } else {
        this.chatHistory.push({ role: 'ai', content: result.content });
      }
    } catch(e) {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      this.chatHistory.push({ role: 'ai', content: `⚠️ Error: ${e.message}` });
    }

    this.renderChatMessages();
    this.scrollChatToBottom();
  },

  renderChatMessages() {
    const el = document.getElementById('chat-messages');
    if (!el) return;
    el.innerHTML = this.chatHistory.map(m => `
      <div class="chat-message ${m.role}">
        <div class="chat-avatar">${m.role==='user'?'👤':'🐐'}</div>
        <div class="chat-bubble">${this.formatMessage(m.content)}</div>
      </div>
    `).join('');
  },

  scrollChatToBottom() {
    const el = document.getElementById('chat-messages');
    if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
  },

  setAIProvider(provider) {
    this.aiProvider = provider;
    this.settings.llmProvider = provider;
    window.goat.settings.set('llmProvider', provider);
    this.renderView('ai-chat');
    this.toast(`AI Provider: ${provider}`, 'info');
  },

  clearChat() {
    this.chatHistory = [];
    this.renderView('ai-chat');
  },

  formatMessage(text) {
    if (!text) return '';
    return text
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  },

  // ========================================================================
  // TERMINAL
  // ========================================================================
  renderTerminal() {
    return `
    <div class="terminal-container h-full">
      <div class="terminal-header">
        <div class="terminal-dots">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot yellow"></div>
          <div class="terminal-dot green"></div>
        </div>
        <div class="terminal-title">${this.terminalCwd} — bash</div>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-sm" onclick="GOAT.sshConnect('72.61.193.184')" title="SSH to KVM2">KVM2</button>
          <button class="btn btn-sm" onclick="GOAT.sshConnect('93.127.214.171')" title="SSH to KVM8">KVM8</button>
          <button class="btn btn-sm" onclick="GOAT.terminalHistory=[];GOAT.renderView('terminal');">Clear</button>
        </div>
      </div>
      <div class="terminal-body" id="terminal-output">
        <div class="terminal-line info">🐐 Super GOAT Royalty Terminal v4.0.0</div>
        <div class="terminal-line info">Type commands below. Use KVM2/KVM8 buttons for SSH.</div>
        <div class="terminal-line" style="margin-bottom:8px;">─────────────────────────────────────────</div>
        ${this.terminalHistory.map(h => `
          <div class="terminal-line"><span class="prompt">${h.prompt}</span> ${this.escapeHtml(h.command)}</div>
          ${h.output ? `<div class="terminal-line ${h.isError?'error':''}">${this.escapeHtml(h.output)}</div>` : ''}
        `).join('')}
      </div>
      <div class="terminal-input-row">
        <span class="terminal-prompt" id="terminal-prompt">goat@local:${this.terminalCwd}$</span>
        <input class="terminal-input" id="terminal-input" type="text" autofocus
          placeholder="Enter command..."
          onkeydown="GOAT.handleTerminalKey(event)">
      </div>
    </div>`;
  },

  initTerminal() {
    const input = document.getElementById('terminal-input');
    if (input) input.focus();
    this.scrollTerminal();
  },

  async handleTerminalKey(event) {
    if (event.key === 'Enter') {
      const input = document.getElementById('terminal-input');
      const cmd = input.value.trim();
      if (!cmd) return;
      input.value = '';
      await this.executeCommand(cmd);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.terminalCmdIndex < this.terminalHistory.length - 1) {
        this.terminalCmdIndex++;
        const input = document.getElementById('terminal-input');
        const hist = this.terminalHistory[this.terminalHistory.length - 1 - this.terminalCmdIndex];
        if (hist && input) input.value = hist.command;
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.terminalCmdIndex > 0) {
        this.terminalCmdIndex--;
        const input = document.getElementById('terminal-input');
        const hist = this.terminalHistory[this.terminalHistory.length - 1 - this.terminalCmdIndex];
        if (hist && input) input.value = hist.command;
      } else {
        this.terminalCmdIndex = -1;
        const input = document.getElementById('terminal-input');
        if (input) input.value = '';
      }
    }
  },

  async executeCommand(cmd) {
    const prompt = `goat@local:${this.terminalCwd}$`;
    
    // Handle cd command locally
    if (cmd.startsWith('cd ')) {
      const dir = cmd.substring(3).trim();
      const result = await window.goat.terminal.execute(`cd ${dir} && pwd`, this.terminalCwd);
      if (!result.error && result.stdout.trim()) {
        this.terminalCwd = result.stdout.trim();
        this.terminalHistory.push({ prompt, command: cmd, output: `Changed to: ${this.terminalCwd}`, isError: false });
      } else {
        this.terminalHistory.push({ prompt, command: cmd, output: result.stderr || 'Directory not found', isError: true });
      }
    } else if (cmd === 'clear') {
      this.terminalHistory = [];
    } else {
      const result = await window.goat.terminal.execute(cmd, this.terminalCwd);
      const output = (result.stdout || '') + (result.stderr || '');
      this.terminalHistory.push({ prompt, command: cmd, output: output.trim(), isError: !!result.error });
    }

    this.terminalCmdIndex = -1;
    this.renderView('terminal');
  },

  async sshConnect(ip) {
    const user = this.settings.sshUser || 'root';
    this.toast(`Connecting to ${user}@${ip}...`, 'info');
    const result = await window.goat.ssh.execute({ host: ip, user, command: 'hostname && uptime && df -h / | tail -1' });
    const output = result.stdout || result.stderr || result.error || 'Connection failed';
    this.terminalHistory.push({ 
      prompt: `ssh@${ip}$`, 
      command: `ssh ${user}@${ip}`, 
      output, 
      isError: !!result.error 
    });
    if (this.currentView === 'terminal') this.renderView('terminal');
    else this.navigate('terminal');
  },

  scrollTerminal() {
    const el = document.getElementById('terminal-output');
    if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
  },

  // ========================================================================
  // CODE EDITOR
  // ========================================================================
  renderCodeEditor() {
    return `
    <div class="editor-container h-full">
      <div class="editor-tabs" id="editor-tabs">
        ${this.editorTabs.map((tab, i) => `
          <div class="editor-tab ${i===this.editorActiveTab?'active':''}" onclick="GOAT.switchEditorTab(${i})">
            <span>${tab.name}</span>
            <span class="editor-tab-close" onclick="event.stopPropagation();GOAT.closeEditorTab(${i})">✕</span>
          </div>
        `).join('')}
        <div class="editor-tab" onclick="GOAT.newEditorTab()" style="color:var(--text-muted);">+ New</div>
        <div style="flex:1;"></div>
        <button class="btn btn-sm" style="margin:4px;" onclick="GOAT.openFileInEditor()">📂 Open</button>
        <button class="btn btn-sm btn-primary" style="margin:4px;" onclick="GOAT.saveEditorFile()">💾 Save</button>
      </div>
      <div class="editor-body">
        <textarea class="editor-textarea" id="editor-content" spellcheck="false"
          placeholder="// Open a file or start typing..."
          oninput="GOAT.updateEditorContent(this.value)">${this.editorTabs[this.editorActiveTab]?.content || ''}</textarea>
      </div>
      <div class="editor-statusbar">
        <span>${this.editorTabs[this.editorActiveTab]?.name || 'No file open'}</span>
        <span>${this.editorTabs[this.editorActiveTab]?.language || 'Plain Text'} | UTF-8</span>
      </div>
    </div>`;
  },

  initCodeEditor() {
    if (this.editorTabs.length === 0) this.newEditorTab();
  },

  newEditorTab() {
    this.editorTabs.push({ name: 'untitled.js', content: '', path: null, language: 'JavaScript' });
    this.editorActiveTab = this.editorTabs.length - 1;
    this.renderView('code-editor');
  },

  switchEditorTab(i) {
    this.editorActiveTab = i;
    this.renderView('code-editor');
  },

  closeEditorTab(i) {
    this.editorTabs.splice(i, 1);
    if (this.editorActiveTab >= this.editorTabs.length) this.editorActiveTab = this.editorTabs.length - 1;
    this.renderView('code-editor');
  },

  updateEditorContent(val) {
    if (this.editorTabs[this.editorActiveTab]) this.editorTabs[this.editorActiveTab].content = val;
  },

  async openFileInEditor() {
    const paths = await window.goat.dialog.openFile({
      filters: [
        { name: 'Code Files', extensions: ['js','jsx','ts','tsx','py','html','css','json','md','sh','yml','yaml','sql','env'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (paths && paths[0]) {
      const result = await window.goat.fs.readFile(paths[0]);
      if (result.data !== null) {
        const name = paths[0].split(/[/\\]/).pop();
        const lang = this.detectLanguage(name);
        this.editorTabs.push({ name, content: result.data, path: paths[0], language: lang });
        this.editorActiveTab = this.editorTabs.length - 1;
        this.renderView('code-editor');
        this.toast(`Opened: ${name}`, 'success');
      } else {
        this.toast(`Error: ${result.error}`, 'error');
      }
    }
  },

  async saveEditorFile() {
    const tab = this.editorTabs[this.editorActiveTab];
    if (!tab) return;
    let savePath = tab.path;
    if (!savePath) {
      savePath = await window.goat.dialog.saveFile({ defaultPath: tab.name });
      if (!savePath) return;
      tab.path = savePath;
      tab.name = savePath.split(/[/\\]/).pop();
    }
    const result = await window.goat.fs.writeFile(savePath, tab.content);
    if (!result.error) this.toast(`Saved: ${tab.name}`, 'success');
    else this.toast(`Error: ${result.error}`, 'error');
  },

  detectLanguage(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const map = { js:'JavaScript', jsx:'React JSX', ts:'TypeScript', tsx:'React TSX', py:'Python',
      html:'HTML', css:'CSS', json:'JSON', md:'Markdown', sh:'Shell', yml:'YAML', yaml:'YAML',
      sql:'SQL', env:'Environment', txt:'Plain Text' };
    return map[ext] || 'Plain Text';
  },

  // ========================================================================
  // FILE MANAGER
  // ========================================================================
  renderFileManager() {
    return `
    <div class="file-manager h-full">
      <div class="file-toolbar">
        <button class="btn btn-sm btn-icon" onclick="GOAT.fileManagerUp()">⬆</button>
        <button class="btn btn-sm btn-icon" onclick="GOAT.loadDirectory(GOAT.systemInfo.homeDir)">🏠</button>
        <input class="file-path-bar" id="file-path-input" value="${this.escapeHtml(this.fileManagerPath)}"
          onkeydown="if(event.key==='Enter')GOAT.loadDirectory(this.value)">
        <button class="btn btn-sm" onclick="GOAT.loadDirectory(document.getElementById('file-path-input').value)">Go</button>
        <button class="btn btn-sm" onclick="GOAT.loadDirectory(GOAT.fileManagerPath)">🔄</button>
      </div>
      <div class="file-list" id="file-list">
        ${this.fileManagerItems.map(item => `
          <div class="file-item" ondblclick="GOAT.fileManagerOpen('${this.escapeHtml(item.name)}', ${item.isDir})">
            <span class="file-icon">${item.isDir ? '📁' : this.getFileIcon(item.name)}</span>
            <span class="file-name">${this.escapeHtml(item.name)}</span>
          </div>
        `).join('') || '<div style="padding:40px;text-align:center;color:var(--text-muted);">Empty directory or loading...</div>'}
      </div>
    </div>`;
  },

  async loadDirectory(dirPath) {
    if (!dirPath) return;
    this.fileManagerPath = dirPath;
    const result = await window.goat.fs.readDir(dirPath);
    if (result.data) {
      this.fileManagerItems = result.data.sort((a,b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name);
      });
    } else {
      this.fileManagerItems = [];
      this.toast(`Error: ${result.error}`, 'error');
    }
    if (this.currentView === 'file-manager') this.renderView('file-manager');
  },

  fileManagerUp() {
    const parts = this.fileManagerPath.replace(/\\/g, '/').split('/');
    parts.pop();
    const parent = parts.join('/') || '/';
    this.loadDirectory(parent);
  },

  async fileManagerOpen(name, isDir) {
    const sep = this.fileManagerPath.includes('\\') ? '\\' : '/';
    const fullPath = this.fileManagerPath + sep + name;
    if (isDir) {
      this.loadDirectory(fullPath);
    } else {
      const result = await window.goat.fs.readFile(fullPath);
      if (result.data !== null) {
        const lang = this.detectLanguage(name);
        this.editorTabs.push({ name, content: result.data, path: fullPath, language: lang });
        this.editorActiveTab = this.editorTabs.length - 1;
        this.navigate('code-editor');
        this.toast(`Opened: ${name}`, 'success');
      } else {
        window.goat.shell.openPath(fullPath);
      }
    }
  },

  getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    const icons = { js:'📜', jsx:'⚛️', ts:'📘', py:'🐍', html:'🌐', css:'🎨', json:'📋',
      md:'📝', sh:'🔧', yml:'⚙️', yaml:'⚙️', sql:'🗃️', csv:'📊', pdf:'📕', png:'🖼️',
      jpg:'🖼️', jpeg:'🖼️', gif:'🖼️', mp3:'🎵', mp4:'🎬', zip:'📦', tar:'📦', gz:'📦' };
    return icons[ext] || '📄';
  },

  // ========================================================================
  // WEB BROWSER
  // ========================================================================
  renderBrowser() {
    return `
    <div class="browser-container h-full">
      <div class="browser-toolbar">
        <button class="browser-nav-btn" onclick="document.getElementById('browser-webview').goBack()">◀</button>
        <button class="browser-nav-btn" onclick="document.getElementById('browser-webview').goForward()">▶</button>
        <button class="browser-nav-btn" onclick="document.getElementById('browser-webview').reload()">🔄</button>
        <input class="browser-url-bar" id="browser-url" value="${this.browserUrl || 'https://www.google.com'}"
          onkeydown="if(event.key==='Enter')GOAT.browserNavigate(this.value)">
        <button class="browser-nav-btn" onclick="GOAT.browserNavigate(document.getElementById('browser-url').value)">→</button>
        <button class="browser-nav-btn" onclick="GOAT.browserNavigate('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2')">🐙</button>
      </div>
      <webview class="browser-webview" id="browser-webview" src="${this.browserUrl || 'https://www.google.com'}"
        style="flex:1;border:none;" allowpopups></webview>
    </div>`;
  },

  browserNavigate(url) {
    if (!url.startsWith('http')) url = 'https://' + url;
    this.browserUrl = url;
    const wv = document.getElementById('browser-webview');
    if (wv) wv.src = url;
    const urlBar = document.getElementById('browser-url');
    if (urlBar) urlBar.value = url;
  },

  // ========================================================================
  // ROYALTY CALCULATOR
  // ========================================================================
  renderRoyalties() {
    const platforms = [
      { name:'Spotify', icon:'🟢', rate:0.004, streams:485000000 },
      { name:'Apple Music', icon:'🍎', rate:0.008, streams:312000000 },
      { name:'YouTube Music', icon:'▶️', rate:0.002, streams:198000000 },
      { name:'TikTok', icon:'🎵', rate:0.003, streams:156000000 },
      { name:'Amazon Music', icon:'📦', rate:0.004, streams:134000000 },
      { name:'Tidal', icon:'🌊', rate:0.012, streams:89000000 },
      { name:'Deezer', icon:'🎧', rate:0.004, streams:67000000 },
      { name:'SoundCloud', icon:'☁️', rate:0.003, streams:45000000 }
    ];
    const totalRevenue = platforms.reduce((sum,p) => sum + (p.rate * p.streams), 0);
    
    return `
    <div class="content-body animate-fadeIn">
      <div class="panel" style="text-align:center;background:var(--gradient-dark);border-color:var(--gold);">
        <h2 style="font-size:24px;">💰 Royalty Calculator</h2>
        <div style="font-size:48px;font-weight:800;background:var(--gradient-gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:16px 0;">
          $${totalRevenue.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0})}</div>
        <p style="color:var(--text-muted);">Estimated Total Royalties Across All Platforms</p>
      </div>
      <div class="panel">
        <div class="panel-title">📊 Custom Calculator</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:12px;">
          <div class="input-group">
            <label class="input-label">Total Streams</label>
            <input class="input" id="calc-streams" type="number" value="1000000" onchange="GOAT.calculateRoyalty()">
          </div>
          <div class="input-group">
            <label class="input-label">Platform</label>
            <select class="input" id="calc-platform" onchange="GOAT.calculateRoyalty()">
              ${platforms.map(p => `<option value="${p.rate}">${p.icon} ${p.name} ($${p.rate}/stream)</option>`).join('')}
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Your Split %</label>
            <input class="input" id="calc-split" type="number" value="100" min="0" max="100" onchange="GOAT.calculateRoyalty()">
          </div>
        </div>
        <div id="calc-result" style="text-align:center;padding:20px;margin-top:12px;background:var(--bg-tertiary);border-radius:var(--radius-md);">
          <div style="font-size:36px;font-weight:800;color:var(--gold);">$4,000.00</div>
          <div style="color:var(--text-muted);font-size:12px;margin-top:4px;">Estimated earnings</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">📈 Platform Breakdown</div>
        <div class="royalty-grid" style="margin-top:12px;">
          ${platforms.map(p => `
            <div class="royalty-platform">
              <div class="royalty-platform-icon">${p.icon}</div>
              <div class="royalty-platform-name">${p.name}</div>
              <div class="royalty-platform-rate">$${p.rate}/stream</div>
              <div class="royalty-platform-amount">$${(p.rate*p.streams).toLocaleString('en-US',{maximumFractionDigits:0})}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${(p.streams/1000000).toFixed(0)}M streams</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
  },

  calculateRoyalty() {
    const streams = parseFloat(document.getElementById('calc-streams')?.value || 0);
    const rate = parseFloat(document.getElementById('calc-platform')?.value || 0.004);
    const split = parseFloat(document.getElementById('calc-split')?.value || 100) / 100;
    const result = streams * rate * split;
    const el = document.getElementById('calc-result');
    if (el) el.innerHTML = `
      <div style="font-size:36px;font-weight:800;color:var(--gold);">$${result.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div style="color:var(--text-muted);font-size:12px;margin-top:4px;">${streams.toLocaleString()} streams × $${rate} × ${(split*100).toFixed(0)}% split</div>`;
  },

  // ========================================================================
  // TRACK CATALOG
  // ========================================================================
  renderCatalog() {
    return `
    <div class="content-body animate-fadeIn">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">🎵 Track Catalog — 3,650 Tracks</div>
          <div style="display:flex;gap:8px;">
            <input class="input" style="width:250px;" placeholder="🔍 Search tracks..." id="catalog-search" oninput="GOAT.filterCatalog()">
            <button class="btn btn-primary btn-sm">Export CSV</button>
          </div>
        </div>
        <div class="tabs">
          <div class="tab active" onclick="GOAT.catalogTab='all';GOAT.renderView('catalog')">All (3,650)</div>
          <div class="tab" onclick="GOAT.catalogTab='harvey';GOAT.renderView('catalog')">Harvey Miller (1,814)</div>
          <div class="tab" onclick="GOAT.catalogTab='fastassman';GOAT.renderView('catalog')">FASTASSMAN (1,836)</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="border-bottom:1px solid var(--border-color);">
            <th style="padding:8px;text-align:left;color:var(--text-muted);font-size:12px;">#</th>
            <th style="padding:8px;text-align:left;color:var(--text-muted);font-size:12px;">Title</th>
            <th style="padding:8px;text-align:left;color:var(--text-muted);font-size:12px;">Artist</th>
            <th style="padding:8px;text-align:left;color:var(--text-muted);font-size:12px;">Publisher</th>
            <th style="padding:8px;text-align:left;color:var(--text-muted);font-size:12px;">ISWC</th>
          </tr></thead>
          <tbody id="catalog-body">
            ${[
              ['Hard in Da Paint','Waka Flocka Flame','FASTASSMAN Publishing','T-070.123.456-7'],
              ['No Hands','Waka Flocka ft. Roscoe Dash','FASTASSMAN Publishing','T-070.234.567-8'],
              ['Grove St. Party','Waka Flocka Flame','FASTASSMAN Publishing','T-070.345.678-9'],
              ['Round of Applause','Waka Flocka Flame','FASTASSMAN Publishing','T-070.456.789-0'],
              ['Bustin At Em','Waka Flocka Flame','FASTASSMAN Publishing','T-070.567.890-1'],
              ['Karma','Waka Flocka Flame','Harvey L Miller Writers','T-070.678.901-2'],
              ['Fell','Waka Flocka Flame','Harvey L Miller Writers','T-070.789.012-3'],
              ['Lurkin','Waka Flocka Flame','Harvey L Miller Writers','T-070.890.123-4'],
              ['TTG','Waka Flocka Flame','FASTASSMAN Publishing','T-070.901.234-5'],
              ['Workin','Waka Flocka Flame','Harvey L Miller Writers','T-070.012.345-6']
            ].map(([t,a,p,iswc], i) => `<tr style="border-bottom:1px solid #1a1a1a;">
              <td style="padding:8px;color:var(--text-muted);">${i+1}</td>
              <td style="padding:8px;font-weight:600;">${t}</td>
              <td style="padding:8px;color:var(--text-secondary);">${a}</td>
              <td style="padding:8px;"><span class="tag tag-gold">${p}</span></td>
              <td style="padding:8px;font-family:var(--font-mono);font-size:12px;color:var(--text-muted);">${iswc}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px;">
          Showing 10 of 3,650 tracks • Connect to Supabase for full catalog
        </div>
      </div>
    </div>`;
  },

  // ========================================================================
  // ANALYTICS
  // ========================================================================
  renderAnalytics() {
    return `
    <div class="content-body animate-fadeIn">
      <div class="dashboard-grid">
        <div class="stat-card"><div class="stat-value">1.2B+</div><div class="stat-label">Total Streams</div><div class="stat-change up">↑ 8.7%</div></div>
        <div class="stat-card"><div class="stat-value">$865K</div><div class="stat-label">Total Revenue</div><div class="stat-change up">↑ 12.3%</div></div>
        <div class="stat-card"><div class="stat-value">3,650</div><div class="stat-label">Active Tracks</div><div class="stat-change up">↑ 156 new</div></div>
        <div class="stat-card"><div class="stat-value">47</div><div class="stat-label">Countries</div><div class="stat-change up">↑ 3 new markets</div></div>
      </div>
      <div class="panel">
        <div class="panel-title">📊 Monthly Streaming Performance</div>
        <div class="chart-bar" style="height:200px;margin-top:16px;">
          ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i) => 
            `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
              <div class="chart-bar-item" style="height:${20+Math.random()*80}%;width:100%;"></div>
              <span style="font-size:10px;color:var(--text-muted);">${m}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">🌍 Top Markets</div>
        <div style="margin-top:12px;">
          ${[['🇺🇸 United States','42%','$363K'],['🇬🇧 United Kingdom','15%','$130K'],['🇩🇪 Germany','8%','$69K'],
            ['🇫🇷 France','6%','$52K'],['🇧🇷 Brazil','5%','$43K'],['🇯🇵 Japan','4%','$35K']].map(([c,pct,rev]) => `
            <div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #1a1a1a;">
              <span style="flex:1;font-weight:600;">${c}</span>
              <span style="width:60px;text-align:right;color:var(--text-muted);">${pct}</span>
              <span style="width:80px;text-align:right;color:var(--gold);font-weight:700;">${rev}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  },

  // ========================================================================
  // SERVER MANAGER
  // ========================================================================
  renderServers() {
    return `
    <div class="content-body animate-fadeIn">
      <div class="panel" style="background:var(--gradient-dark);border-color:var(--gold);">
        <h2 style="text-align:center;">🖥️ Hostinger VPS Server Manager</h2>
        <p style="text-align:center;color:var(--text-muted);">Manage your two Hostinger KVM servers</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <!-- KVM2 -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title"><span class="server-status-dot online" style="display:inline-block;margin-right:8px;"></span>KVM2 — Primary</div>
            <span class="tag tag-green">Running</span>
          </div>
          <div style="font-family:var(--font-mono);font-size:13px;margin-bottom:12px;">
            <div>IP: <strong style="color:var(--gold);">72.61.193.184</strong></div>
            <div>Host: srv1148455.hstgr.cloud</div>
            <div>Expires: 2026-11-23</div>
            <div>Type: KVM 2</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm" onclick="GOAT.sshConnect('72.61.193.184')">🖥️ SSH</button>
            <button class="btn btn-sm btn-primary" onclick="GOAT.deployToServer('72.61.193.184')">🚀 Deploy</button>
            <button class="btn btn-sm" onclick="GOAT.serverStatus('72.61.193.184')">📊 Status</button>
            <button class="btn btn-sm" onclick="GOAT.serverRestart('72.61.193.184')">🔄 Restart</button>
          </div>
        </div>
        <!-- KVM8 -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title"><span class="server-status-dot online" style="display:inline-block;margin-right:8px;"></span>KVM8 — Backup</div>
            <span class="tag tag-green">Running</span>
          </div>
          <div style="font-family:var(--font-mono);font-size:13px;margin-bottom:12px;">
            <div>IP: <strong style="color:var(--gold);">93.127.214.171</strong></div>
            <div>Host: srv832760.hstgr.cloud</div>
            <div>Expires: 2026-03-20</div>
            <div>Type: KVM 8</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm" onclick="GOAT.sshConnect('93.127.214.171')">🖥️ SSH</button>
            <button class="btn btn-sm btn-primary" onclick="GOAT.deployToServer('93.127.214.171')">🚀 Deploy</button>
            <button class="btn btn-sm" onclick="GOAT.serverStatus('93.127.214.171')">📊 Status</button>
            <button class="btn btn-sm" onclick="GOAT.serverRestart('93.127.214.171')">🔄 Restart</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">🚀 Quick Deploy Commands</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
          <button class="btn" onclick="GOAT.runServerCmd('72.61.193.184','cd ~/GOAT-Royalty-App2 && git pull origin main')">📥 Pull Latest (KVM2)</button>
          <button class="btn" onclick="GOAT.runServerCmd('93.127.214.171','cd ~/GOAT-Royalty-App2 && git pull origin main')">📥 Pull Latest (KVM8)</button>
          <button class="btn" onclick="GOAT.runServerCmd('72.61.193.184','cd ~/GOAT-Royalty-App2 && npm install && npm run build')">🔨 Build (KVM2)</button>
          <button class="btn" onclick="GOAT.runServerCmd('93.127.214.171','cd ~/GOAT-Royalty-App2 && npm install && npm run build')">🔨 Build (KVM8)</button>
          <button class="btn btn-success" onclick="GOAT.runServerCmd('72.61.193.184','pm2 restart goat-app || cd ~/GOAT-Royalty-App2 && pm2 start npm --name goat-app -- start')">▶️ Start PM2 (KVM2)</button>
          <button class="btn btn-success" onclick="GOAT.runServerCmd('93.127.214.171','pm2 restart goat-app || cd ~/GOAT-Royalty-App2 && pm2 start npm --name goat-app -- start')">▶️ Start PM2 (KVM8)</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">📋 Server Output</div>
        <div class="terminal-container" style="height:200px;margin-top:12px;">
          <div class="terminal-body" id="server-output" style="font-size:12px;">
            <div class="terminal-line info">Ready for server commands...</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  async runServerCmd(ip, cmd) {
    const outputEl = document.getElementById('server-output');
    if (outputEl) outputEl.innerHTML += `<div class="terminal-line"><span class="prompt">${ip}$</span> ${this.escapeHtml(cmd)}</div>`;
    this.toast(`Running on ${ip}...`, 'info');
    const result = await window.goat.ssh.execute({ host: ip, user: this.settings.sshUser || 'root', command: cmd });
    const output = result.stdout || result.stderr || result.error || 'No output';
    if (outputEl) {
      outputEl.innerHTML += `<div class="terminal-line ${result.error?'error':'success'}">${this.escapeHtml(output)}</div>`;
      outputEl.scrollTop = outputEl.scrollHeight;
    }
  },

  async deployToServer(ip) {
    this.toast(`Deploying to ${ip}...`, 'info');
    const commands = [
      'cd ~ && git clone https://github.com/DJSPEEDYGA/GOAT-Royalty-App2.git 2>/dev/null || (cd ~/GOAT-Royalty-App2 && git pull origin main)',
      'cd ~/GOAT-Royalty-App2 && npm install --production',
      'cd ~/GOAT-Royalty-App2 && npm run build',
      'cd ~/GOAT-Royalty-App2 && pm2 delete goat-app 2>/dev/null; pm2 start npm --name goat-app -- start -- -p 3000',
      'pm2 save'
    ];
    for (const cmd of commands) {
      await this.runServerCmd(ip, cmd);
    }
    this.toast(`Deploy to ${ip} complete!`, 'success');
  },

  async serverStatus(ip) {
    await this.runServerCmd(ip, 'echo "=== SYSTEM ===" && uptime && echo "=== MEMORY ===" && free -h | head -2 && echo "=== DISK ===" && df -h / | tail -1 && echo "=== PM2 ===" && pm2 list 2>/dev/null || echo "PM2 not installed"');
  },

  async serverRestart(ip) {
    await this.runServerCmd(ip, 'pm2 restart goat-app 2>/dev/null || echo "No PM2 process found"');
  },

  // ========================================================================
  // SETTINGS
  // ========================================================================
  renderSettings() {
    return `
    <div class="content-body animate-fadeIn">
      <div class="panel">
        <div class="panel-title">⚙️ Application Settings</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px;">
          <div>
            <h3 style="margin-bottom:12px;color:var(--gold);">🤖 AI Configuration</h3>
            <div class="input-group">
              <label class="input-label">Default AI Provider</label>
              <select class="input" id="set-llm" onchange="GOAT.updateSetting('llmProvider',this.value)">
                ${this.aiProviders.map(p => `<option value="${p}" ${p===this.settings.llmProvider?'selected':''}>${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join('')}
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">OpenAI API Key</label>
              <input class="input" type="password" placeholder="sk-..." value="${this.settings.apiKeys?.openai||''}"
                onchange="GOAT.updateApiKey('openai',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">Google Gemini API Key</label>
              <input class="input" type="password" placeholder="AIza..." value="${this.settings.apiKeys?.gemini||''}"
                onchange="GOAT.updateApiKey('gemini',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">Anthropic Claude API Key</label>
              <input class="input" type="password" placeholder="sk-ant-..." value="${this.settings.apiKeys?.claude||''}"
                onchange="GOAT.updateApiKey('claude',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">Groq API Key</label>
              <input class="input" type="password" placeholder="gsk_..." value="${this.settings.apiKeys?.groq||''}"
                onchange="GOAT.updateApiKey('groq',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">Ollama URL (Local LLM)</label>
              <input class="input" value="${this.settings.ollamaUrl||'http://localhost:11434'}"
                onchange="GOAT.updateSetting('ollamaUrl',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">Ollama Model</label>
              <input class="input" value="${this.settings.ollamaModel||'llama3'}"
                onchange="GOAT.updateSetting('ollamaModel',this.value)">
            </div>
          </div>
          <div>
            <h3 style="margin-bottom:12px;color:var(--gold);">🖥️ Server Configuration</h3>
            <div class="input-group">
              <label class="input-label">SSH Username</label>
              <input class="input" value="${this.settings.sshUser||'root'}"
                onchange="GOAT.updateSetting('sshUser',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">KVM2 IP (Primary)</label>
              <input class="input" value="${this.settings.serverIP1||'72.61.193.184'}"
                onchange="GOAT.updateSetting('serverIP1',this.value)">
            </div>
            <div class="input-group">
              <label class="input-label">KVM8 IP (Backup)</label>
              <input class="input" value="${this.settings.serverIP2||'93.127.214.171'}"
                onchange="GOAT.updateSetting('serverIP2',this.value)">
            </div>
            <h3 style="margin:20px 0 12px;color:var(--gold);">🎨 Appearance</h3>
            <div class="input-group">
              <label class="input-label">Theme</label>
              <select class="input" onchange="GOAT.setTheme(this.value)">
                <option value="dark" ${this.settings.theme==='dark'?'selected':''}>🌙 Dark</option>
                <option value="light" ${this.settings.theme==='light'?'selected':''}>☀️ Light</option>
              </select>
            </div>
            <h3 style="margin:20px 0 12px;color:var(--gold);">📊 System Info</h3>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);line-height:2;">
              <div>Platform: ${this.systemInfo.platform || 'N/A'} (${this.systemInfo.arch || 'N/A'})</div>
              <div>Node: ${this.systemInfo.nodeVersion || 'N/A'}</div>
              <div>Electron: ${this.systemInfo.electronVersion || 'N/A'}</div>
              <div>CPUs: ${this.systemInfo.cpus || 'N/A'}</div>
              <div>Memory: ${this.systemInfo.freeMemory || 'N/A'} free / ${this.systemInfo.totalMemory || 'N/A'}</div>
              <div>Uptime: ${this.systemInfo.uptime || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  async updateSetting(key, value) {
    this.settings[key] = value;
    await window.goat.settings.set(key, value);
    this.toast(`Setting updated: ${key}`, 'success');
  },

  async updateApiKey(provider, value) {
    if (!this.settings.apiKeys) this.settings.apiKeys = {};
    this.settings.apiKeys[provider] = value;
    await window.goat.settings.set('apiKeys', this.settings.apiKeys);
    this.toast(`${provider} API key saved`, 'success');
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.settings.theme = theme;
    window.goat.settings.set('theme', theme);
  },

  // ========================================================================
  // STUB VIEWS (Rendered with embedded webview or placeholder)
  // ========================================================================
  renderPublishing() { return this.renderWebAppView('Publishing Manager', '/publishing'); },
  renderStreaming() { return this.renderWebAppView('Streaming Platforms', '/streaming'); },
  renderProduction() { return this.renderWebAppView('Music Production', '/production'); },
  renderAdobeFirefly() { return this.renderWebAppView('Adobe Firefly AI Studio', '/adobe-firefly'); },
  renderSoraAI() { return this.renderWebAppView('Sora AI Video Studio', '/sora-ai-studio'); },
  renderCinemaCamera() { return this.renderWebAppView('Cinema Camera Suite', '/cinema-camera'); },
  renderFashionStore() { return this.renderWebAppView('Fashion Forge Studio', '/fashion-store'); },
  renderNvidiaDGX() { return this.renderWebAppView('NVIDIA DGX Cloud', '/nvidia-dgx'); },
  renderAutomation() { return this.renderToolPlaceholder('🤖', 'Axiom Browser Automation', 'Automate web scraping, form filling, and browser tasks with pre-built templates for Spotify, YouTube, TikTok, and more.'); },
  renderGitManager() { return this.renderToolPlaceholder('🔀', 'Git Manager', 'Manage your GOAT Royalty App2 repository. Push, pull, branch, and merge with ease.'); },

  renderWebAppView(title, path) {
    const serverUrl = this.settings.serverUrl || `http://${this.settings.serverIP2 || '93.127.214.171'}:3000`;
    return `
    <div class="browser-container h-full">
      <div class="browser-toolbar">
        <span style="font-size:14px;font-weight:700;margin-right:12px;">${title}</span>
        <input class="browser-url-bar" value="${serverUrl}${path}" readonly>
        <button class="browser-nav-btn" onclick="document.getElementById('app-webview').reload()">🔄</button>
        <button class="browser-nav-btn" onclick="GOAT.openExternal('${serverUrl}${path}')">↗️</button>
      </div>
      <webview id="app-webview" src="${serverUrl}${path}" style="flex:1;border:none;" allowpopups></webview>
    </div>`;
  },

  renderToolPlaceholder(icon, title, desc) {
    return `
    <div class="content-body" style="display:flex;align-items:center;justify-content:center;height:100%;">
      <div style="text-align:center;max-width:500px;">
        <div style="font-size:64px;margin-bottom:16px;">${icon}</div>
        <h2 style="margin-bottom:8px;">${title}</h2>
        <p style="color:var(--text-muted);margin-bottom:20px;">${desc}</p>
        <button class="btn btn-primary" onclick="GOAT.navigate('command-center')">← Back to Command Center</button>
      </div>
    </div>`;
  },

  renderAbout() {
    return `
    <div class="content-body" style="display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;max-width:600px;">
        <div style="font-size:80px;margin-bottom:16px;">🐐⚡</div>
        <h1 style="font-size:36px;font-weight:800;background:var(--gradient-gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          SUPER GOAT ROYALTY</h1>
        <p style="color:var(--text-muted);margin:8px 0 24px;">Version 4.0.0 — Ultimate Edition</p>
        <div class="panel" style="text-align:left;">
          <p style="margin-bottom:12px;">The ultimate AI-powered music production, royalty management, and creative platform.</p>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);line-height:2;">
            <div>© 2025 Harvey Miller (DJ Speedy)</div>
            <div>GOAT Royalty / FASTASSMAN Publishing Inc.</div>
            <div>All Rights Reserved</div>
            <div style="margin-top:12px;">Authors:</div>
            <div>• Harvey L Miller Jr (DJ Speedy)</div>
            <div>• Juaquin J Malphurs (Waka Flocka Flame)</div>
            <div>• Kevin W Hallingquest</div>
            <div style="margin-top:12px;">3,650 Tracks | 5 AI Providers | 2 Servers</div>
            <div>20+ Integrated Tools | Cross-Platform Desktop App</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">
          <button class="btn" onclick="GOAT.openExternal('https://github.com/DJSPEEDYGA/GOAT-Royalty-App2')">🐙 GitHub</button>
          <button class="btn btn-primary" onclick="GOAT.navigate('dashboard')">🏠 Dashboard</button>
        </div>
      </div>
    </div>`;
  },

  // ========================================================================
  // MUSIC PLAYER
  // ========================================================================
  player: {
    playing: false,
    currentTrack: 0,
    tracks: [
      { name: 'Hard in Da Paint', artist: 'Waka Flocka Flame', duration: '3:45' },
      { name: 'No Hands', artist: 'Waka Flocka ft. Roscoe Dash', duration: '4:12' },
      { name: 'Grove St. Party', artist: 'Waka Flocka Flame', duration: '3:58' },
      { name: 'Round of Applause', artist: 'Waka Flocka Flame', duration: '4:01' },
      { name: 'Bustin At Em', artist: 'Waka Flocka Flame', duration: '3:33' }
    ],
    toggle() {
      this.playing = !this.playing;
      const btn = document.getElementById('player-play-btn');
      if (btn) btn.textContent = this.playing ? '⏸' : '▶';
      if (this.playing) this.updateTrackInfo();
    },
    next() { this.currentTrack = (this.currentTrack + 1) % this.tracks.length; this.updateTrackInfo(); },
    prev() { this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length; this.updateTrackInfo(); },
    updateTrackInfo() {
      const track = this.tracks[this.currentTrack];
      const nameEl = document.getElementById('player-track-name');
      const artistEl = document.getElementById('player-track-artist');
      if (nameEl) nameEl.textContent = track.name;
      if (artistEl) artistEl.textContent = track.artist;
    },
    seek(e) { /* placeholder */ },
    setVolume(e) { /* placeholder */ }
  },

  // ========================================================================
  // TOAST NOTIFICATIONS
  // ========================================================================
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
  },

  // ========================================================================
  // UTILITIES
  // ========================================================================
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  window: {
    minimize: () => window.goat.window.minimize(),
    maximize: () => window.goat.window.maximize(),
    close: () => window.goat.window.close()
  }
};

// ============================================================================
// BOOT
// ============================================================================
document.addEventListener('DOMContentLoaded', () => GOAT.init());