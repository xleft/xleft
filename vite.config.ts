import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: This ensures assets are loaded relatively (e.g. "./assets/index.js") 
  // instead of absolutely (e.g. "/assets/index.js").
  // This is required for GitHub Pages which serves from a subdirectory (e.g. /repo-name/).
  base: './',
})