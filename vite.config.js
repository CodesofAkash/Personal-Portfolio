import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Increase warning threshold slightly — Three.js is large by nature
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy
         *
         * Before: 1 x 1,456 KB bundle (everything together)
         * After:  ~6 separate chunks loaded on demand
         *
         * - react-vendor: React core — cached aggressively, changes rarely
         * - three-vendor: Three.js — large but only needed for 3D sections
         * - animation-vendor: Framer Motion — only needed for animated sections
         * - router-vendor: React Router — tiny, separate for caching
         * - ui-vendor: UI libs (toastify, tilt, timeline) — separate chunk
         * - index: Your actual app code — smallest chunk, changes most often
         */
        manualChunks: {
          // React core — changes almost never, will be cached for months
          "react-vendor": ["react", "react-dom"],

          // React Router — tiny, separate so core React chunk stays clean
          "router-vendor": ["react-router-dom"],

          // Three.js ecosystem — only loaded when 3D canvas components mount
          "three-vendor": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "maath",
          ],

          // Animation — Framer Motion is ~20KB, separate for caching
          "animation-vendor": ["framer-motion"],

          // UI utility libs — rarely change, good cache candidates
          "ui-vendor": [
            "react-toastify",
            "react-tilt",
            "react-vertical-timeline-component",
            "@emailjs/browser",
          ],
        },
      },
    },
  },

  // Optimize deps — pre-bundle heavy dependencies for faster dev server startup
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "framer-motion",
    ],
  },

  server: { historyApiFallback: true }
})