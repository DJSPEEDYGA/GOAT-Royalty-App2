// ============================================================================
// SUPER GOAT ROYALTY - PRELOAD BRIDGE
// Secure IPC communication between main process and renderer
// Copyright © 2025 Harvey Miller (DJ Speedy) / GOAT Royalty
// ============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('goat', {
  // --- App Info ---
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    quit: () => ipcRenderer.invoke('app:quit')
  },

  // --- Window Controls ---
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    setAlwaysOnTop: (val) => ipcRenderer.invoke('window:setAlwaysOnTop', val)
  },

  // --- Settings ---
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    setAll: (s) => ipcRenderer.invoke('settings:setAll', s)
  },

  // --- System ---
  system: {
    info: () => ipcRenderer.invoke('system:info')
  },

  // --- Terminal ---
  terminal: {
    execute: (command, cwd) => ipcRenderer.invoke('terminal:execute', command, cwd)
  },

  // --- SSH ---
  ssh: {
    execute: (opts) => ipcRenderer.invoke('ssh:execute', opts)
  },

  // --- File System ---
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
    writeFile: (path, content) => ipcRenderer.invoke('fs:writeFile', path, content),
    readDir: (path) => ipcRenderer.invoke('fs:readDir', path),
    exists: (path) => ipcRenderer.invoke('fs:exists', path),
    mkdir: (path) => ipcRenderer.invoke('fs:mkdir', path),
    delete: (path) => ipcRenderer.invoke('fs:delete', path),
    stat: (path) => ipcRenderer.invoke('fs:stat', path)
  },

  // --- Dialogs ---
  dialog: {
    openFile: (opts) => ipcRenderer.invoke('dialog:openFile', opts),
    openDir: () => ipcRenderer.invoke('dialog:openDir'),
    saveFile: (opts) => ipcRenderer.invoke('dialog:saveFile', opts)
  },

  // --- Shell ---
  shell: {
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
    openPath: (p) => ipcRenderer.invoke('shell:openPath', p),
    showItemInFolder: (p) => ipcRenderer.invoke('shell:showItemInFolder', p)
  },

  // --- Clipboard ---
  clipboard: {
    read: () => ipcRenderer.invoke('clipboard:read'),
    write: (text) => ipcRenderer.invoke('clipboard:write', text)
  },

  // --- AI / LLM ---
  ai: {
    chat: (opts) => ipcRenderer.invoke('ai:chat', opts),
    ollamaModels: () => ipcRenderer.invoke('ai:ollama:models'),
    ollamaPull: (model) => ipcRenderer.invoke('ai:ollama:pull', model)
  },

  // --- Server ---
  server: {
    start: (opts) => ipcRenderer.invoke('server:start', opts),
    stop: () => ipcRenderer.invoke('server:stop'),
    status: () => ipcRenderer.invoke('server:status')
  },

  // --- Git ---
  git: {
    execute: (opts) => ipcRenderer.invoke('git:execute', opts)
  },

  // --- HTTP ---
  http: {
    fetch: (opts) => ipcRenderer.invoke('http:fetch', opts)
  },

  // --- Event Listeners ---
  on: (channel, callback) => {
    const validChannels = ['navigate', 'ssh-connect', 'deploy', 'theme-changed', 'notification'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

console.log('🐐 GOAT Royalty preload bridge initialized');