/** @type {import('next').NextConfig} */
const withLess = require('next-with-less')

const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false
  },
  images: {
    domains: ['images.ctfassets.net']
  }
}

module.exports = withLess(nextConfig)
