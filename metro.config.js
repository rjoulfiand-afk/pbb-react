const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajarin Expo (Metro Bundler) buat ngenalin mesin .wasm punya SQLite
config.resolver.assetExts.push('wasm');

module.exports = config;