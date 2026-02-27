/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const SAVE_FILE = path.resolve(__dirname, 'saves/autosave.json')

function diskSavePlugin() {
  return {
    name: 'disk-save',
    configureServer(server: any) {
      if (!fs.existsSync(path.dirname(SAVE_FILE))) {
        fs.mkdirSync(path.dirname(SAVE_FILE), { recursive: true })
      }

      server.middlewares.use('/api/save', (req: any, res: any) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
        let body = ''
        req.on('data', (chunk: any) => body += chunk)
        req.on('end', () => {
          try {
            fs.writeFileSync(SAVE_FILE, body, 'utf8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end('{"ok":true}')
          } catch (e) {
            res.writeHead(500); res.end('{"error":"save failed"}')
          }
        })
      })

      server.middlewares.use('/api/load', (req: any, res: any) => {
        if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
        try {
          if (fs.existsSync(SAVE_FILE)) {
            const data = fs.readFileSync(SAVE_FILE, 'utf8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(data)
          } else {
            res.writeHead(404); res.end('{"error":"no save"}')
          }
        } catch (e) {
          res.writeHead(500); res.end('{"error":"load failed"}')
        }
      })
    }
  }
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/mausritter-solo-companion/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    diskSavePlugin(),
  ],
  server: {
    port: 8081,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
