/**
 * SUPER GOAT ROYALTIES APP - Windows Installer Builder
 * Creates NSIS installer and portable executable for Windows
 */

const builder = require('electron-builder');
const path = require('path');
const fs = require('fs');

const config = {
  appId: 'com.goatroyalty.app',
  productName: 'SUPER GOAT ROYALTIES APP',
  copyright: 'Copyright © 2024 GOAT Royalty Team',
  directories: {
    output: 'dist',
    buildResources: 'build'
  },
  files: [
    'main.js',
    'preload.js',
    'start-server.js',
    '.next/**/*',
    'public/**/*',
    'pages/**/*',
    'components/**/*',
    'styles/**/*',
    'lib/**/*',
    'node_modules/**/*',
    'package.json',
    'next.config.js'
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      },
      {
        target: 'portable',
        arch: ['x64']
      }
    ],
    icon: 'public/icon.ico',
    sign: null, // Disable signing for development builds
    publisherName: 'GOAT Royalty Team',
    requestedExecutionLevel: 'asInvoker'
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'public/icon.ico',
    uninstallerIcon: 'public/icon.ico',
    installerHeaderIcon: 'public/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    license: null, // Add path to LICENSE file if available
    deleteAppDataOnUninstall: false,
    runAfterFinish: true,
    installerLanguages: ['en_US'],
    language: '1033',
    perMachine: false,
    displayLanguageSelector: false
  },
  portable: {
    artifactName: 'SUPER-GOAT-ROYALTIES-APP-Portable.exe'
  }
};

async function buildWindows() {
  console.log('========================================');
  console.log('  SUPER GOAT ROYALTIES APP');
  console.log('  Windows Installer Builder');
  console.log('========================================\n');

  try {
    // Check if build directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }

    console.log('Building Windows NSIS installer...');
    const results = await builder.build({
      targets: builder.Platform.WINDOWS.createTarget(),
      config: config
    });

    console.log('\n✓ Build Complete!');
    console.log('Output files:');
    results.forEach(file => {
      const stats = fs.statSync(file);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`  - ${path.basename(file)} (${sizeMB} MB)`);
    });

    return results;
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
}

// Run the build
buildWindows();