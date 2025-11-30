const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies from knex
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(oracledb|pg-native|pg-query-stream|sqlite3|better-sqlite3|mysql|mysql2|tedious)$/,
      })
    )
    // Suppress critical dependency warnings from dynamic imports
    config.stats = {
      warningsFilter: (warning) => warning.message && warning.message.includes('Critical dependency: the request of a dependency is an expression'),
    };
    // Ignore dynamic require warning for knex
    config.ignoreWarnings = [
      { module: /node_modules\/knex\/lib\/migrations\/util\/import-file\.js/ }
    ];
    return config
  },
}

module.exports = nextConfig
