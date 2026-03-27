/**
 * SUPER GOAT ROYALTIES APP - Linux Package Builder
 * Creates .AppImage, .deb, and .tar.gz packages for Linux
 */

const builder = require('electron-builder');
const path = require('path');
const fs = require('fs');

const config = {
  appId: 'com.goatroyalty.app',
  productName: 'super-goat-royalties-app',
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
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      },
      {
        target: 'tar.gz',
        arch: ['x64']
      }
    ],
    category: 'Audio;Music;AudioVideo',
    icon: 'public/',
    maintainer: 'GOAT Royalty Team <info@goatroyaltyapp.com>',
    vendor: 'GOAT Royalty Team',
    synopsis: 'Music royalty management platform for artists and rights holders',
    description: 'SUPER GOAT ROYALTIES APP - A comprehensive music royalty management platform featuring 242 API endpoints, 6 AI engines, voice commands, and real-time analytics dashboard.',
    desktop: {
      Name: 'SUPER GOAT ROYALTIES APP',
      Comment: 'Music royalty management platform',
      Categories: 'Audio;Music;AudioVideo',
      StartupNotify: 'true',
      Terminal: 'false',
      Type: 'Application'
    }
  },
  appImage: {
    // systemIntegration is handled by AppImageLauncher
  },
  deb: {
    priority: 'optional',
    compression: 'xz',
    depends: ['libgtk-3-0', 'libnotify4', 'libnss3', 'libxss1', 'libxtst6', 'xdg-utils']
  }
};

async function buildLinux() {
  console.log('========================================');
  console.log('  SUPER GOAT ROYALTIES APP');
  console.log('  Linux Package Builder');
  console.log('========================================\n');

  try {
    // Check if build directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }

    console.log('Building Linux packages...\n');
    
    // Build AppImage
    console.log('1. Building AppImage (universal Linux package)...');
    const appImageResults = await builder.build({
      targets: builder.Platform.LINUX.createTarget(['appimage'], builder.Arch.x64),
      config: config
    });
    
    // Build DEB
    console.log('\n2. Building .deb package (Debian/Ubuntu)...');
    const debResults = await builder.build({
      targets: builder.Platform.LINUX.createTarget(['deb'], builder.Arch.x64),
      config: config
    });
    
    // Build TAR.GZ
    console.log('\n3. Building .tar.gz archive...');
    const tarResults = await builder.build({
      targets: builder.Platform.LINUX.createTarget(['tar.gz'], builder.Arch.x64),
      config: config
    });

    const allResults = [...appImageResults, ...debResults, ...tarResults];

    console.log('\n✓ Build Complete!');
    console.log('Output files:');
    allResults.forEach(file => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`  - ${path.basename(file)} (${sizeMB} MB)`);
      }
    });

    return allResults;
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
}

// Run the build
buildLinux();