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
    return config
  },
}

module.exports = nextConfig
