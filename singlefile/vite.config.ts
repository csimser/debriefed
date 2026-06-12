import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

const repoRoot = path.resolve(__dirname, '..')

// Builds the single-file Debriefed.html distribution.
// Run: npm run build:singlefile  →  dist-singlefile/Debriefed.html
export default defineConfig({
  root: __dirname,
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.join(repoRoot, 'src'),
      // The app pages are written for Next.js — shim its client modules
      // onto the hash router.
      'next/link': path.join(__dirname, 'shims/link.tsx'),
      'next/navigation': path.join(__dirname, 'shims/navigation.ts'),
    },
    dedupe: ['react', 'react-dom', '@react-pdf/renderer'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify('https://getdebriefed.co'),
    'process.env.NEXT_PUBLIC_SUPPORT_EMAIL': JSON.stringify('support@getdebriefed.co'),
  },
  css: {
    postcss: repoRoot,
  },
  build: {
    outDir: path.join(repoRoot, 'dist-singlefile'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 20000,
    rollupOptions: {
      output: {
        // vite-plugin-singlefile inlines everything anyway
        manualChunks: undefined,
      },
    },
  },
})
