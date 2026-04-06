import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CSV_PATH = path.resolve('participants.csv')
const HEADER = '#,First Name,Last Name,Company,Email,Prize Won,Mode,Timestamp\n'

function ensureCsv() {
  if (!fs.existsSync(CSV_PATH)) fs.writeFileSync(CSV_PATH, HEADER)
}

function csvPlugin() {
  return {
    name: 'participants-csv',
    configureServer(server) {
      server.middlewares.use('/api/participant', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const p = JSON.parse(body)
            ensureCsv()
            const count = fs.readFileSync(CSV_PATH, 'utf-8').split('\n').filter(Boolean).length
            const esc = (v) => {
              const s = String(v ?? '')
              return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
            }
            const line = [
              count,
              esc(p.firstName),
              esc(p.lastName),
              esc(p.company),
              esc(p.email),
              esc(p.prize),
              esc(p.mode),
              esc(p.timestamp),
            ].join(',') + '\n'
            fs.appendFileSync(CSV_PATH, line)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), csvPlugin()],
})
