import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 600,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "three-vendor": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "maath",
          ],
          "animation-vendor": ["framer-motion"],
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

  server: {
    historyApiFallback: true,
  },
})
