/**
 * SUPER GOAT ROYALTIES APP - macOS Installer Builder
 * Creates DMG and ZIP packages for macOS
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
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64']
      }
    ],
    category: 'public.app-category.music',
    icon: 'public/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'entitlements.mac.plist',
    entitlementsInherit: 'entitlements.mac.plist',
    type: 'distribution',
    minimumSystemVersion: '10.15.0'
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications'
      }
    ],
    window: {
      width: 540,
      height: 380
    },
    background: null, // Add path to background image if available
    iconSize: 100,
    iconTextSize: 14
  }
};

async function buildMacOS() {
  console.log('========================================');
  console.log('  SUPER GOAT ROYALTIES APP');
  console.log('  macOS Installer Builder');
  console.log('========================================\n');

  const platform = process.platform;
  
  if (platform !== 'darwin') {
    console.log('⚠ Warning: Building macOS apps on non-macOS platforms is limited.');
    console.log('  The resulting app will be unsigned and may not work on all Macs.');
    console.log('  For production builds, run this on a macOS machine with Xcode.\n');
  }

  try {
    // Check if build directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }

    console.log('Building macOS DMG/ZIP packages...');
    const results = await builder.build({
      targets: builder.Platform.MAC.createTarget(),
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
buildMacOS();