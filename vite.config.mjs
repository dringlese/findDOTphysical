import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

const cityRoutes = [
  '/oklahoma-city',
  '/tulsa',
  '/norman',
  '/lawton',
  '/edmond',
  '/broken-arrow',
  '/midwest-city',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.finddotphysical.com',
      dynamicRoutes: ['/', ...cityRoutes, '/get-listed'],
    }),
  ],
})
