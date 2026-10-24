const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/**
 * `next dev` builds into its own folder. Sharing `.next` with `next build` meant a
 * build run while the dev server was up replaced the dev output underneath it
 * ("Cannot find module './vendor-chunks/next.js'" on every page until restart).
 *
 * @type {(phase: string) => import('next').NextConfig}
 */
const nextConfig = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com', 'via.placeholder.com'],
  },
})

module.exports = nextConfig
