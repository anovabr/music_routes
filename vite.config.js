import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change this to '/your-repo-name/' when deploying to GitHub Pages
  // e.g. if your repo is github.com/yourname/classical-music-neurotree
  // set base: '/classical-music-neurotree/'
  base: './',
})
