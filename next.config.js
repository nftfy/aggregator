/** @type {import('next').NextConfig} */
const withLess = require('next-with-less')

const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false
  }
}

module.exports = withLess(nextConfig)
