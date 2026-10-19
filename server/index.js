import fs from 'fs'
import os from 'os'
import path from 'path'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import express from 'express'
import { WebSocketServer } from 'ws'
import { apply, BRIEF_MAX, createState, PHASE, summarize, votedCaseIndexes } from '../shared/meeting.js'
import { loadJson, validateData } from './check-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT || 5173)
const dataDir = path.join(__dirname, 'data')
const stateFile = path.join(dataDir, 'state.json')

const cases = loadJson('cases.json')
const roles = loadJson('roles.json')
const dataErrors = validateData(cases, roles)
if (dataErrors.length) {
  console.error(dataErrors.join('\n'))
  process.exit(1)
}

function lanUrls(port) {
  const urls = new Set([`http://localhost:${port}`])
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) urls.add(`http://${entry.address}:${port}`)
    }
  }
  return [...urls]
}

function normalize(raw) {
  const base = createState()
  const next = { ...base, ...raw }
  if (!Number.isInteger(next.caseIndex) || next.caseIndex < 0 || next.caseIndex >= cases.length) {
    next.caseIndex = 0
  }
  if (![PHASE.discuss, PHASE.voting, PHASE.results].includes(next.phase)) next.phase = PHASE.discuss
  if (!next.votes || typeof next.votes !== 'object') next.votes = {}
  if (!['A', 'B', 'C'].includes(next.advice)) next.advice = null
  if (!next.history || typeof next.history !== 'object') next.history = {}
  if (typeof next.voteEndsAt !== 'number') next.voteEndsAt = null
  if (next.briefing !== null && (!Number.isInteger(next.briefing) || next.briefing < 0 || next.briefing > BRIEF_MAX)) next.briefing = 0
  if (!Array.isArray(next.ledger)) next.ledger = []
  return next
}

function loadState() {
  try {
    return normalize(JSON.parse(fs.readFileSync(stateFile, 'utf8')))
  } catch {
    return createState()
  }
}

fs.mkdirSync(dataDir, { recursive: true })
let meeting = loadState()

function persist() {
  fs.writeFileSync(stateFile, JSON.stringify(meeting))
}

function onlineIds() {
  const ids = new Set()
  for (const client of wss.clients) {
    if (client.readyState === 1 && client.studentId) ids.add(client.studentId)
  }
  return [...ids].sort((a, b) => a - b)
}

function viewFor(client) {
  const base = {
    rev: meeting.rev,
    caseIndex: meeting.caseIndex,
    phase: meeting.phase,
    timerEndsAt: meeting.timerEndsAt,
    voteEndsAt: meeting.voteEndsAt,
    advice: meeting.advice,
    briefing: meeting.briefing === undefined ? 0 : meeting.briefing,
    discussStartedAt: typeof meeting.discussStartedAt === 'number' ? meeting.discussStartedAt : null,
    updatedAt: meeting.updatedAt,
  }
  if (client.isHost) {
    return {
      ...base,
      votes: meeting.votes,
      ledger: meeting.ledger || [],
      votedCases: votedCaseIndexes(meeting),
      summary: meeting.phase === PHASE.results ? summarize(meeting.votes, roles) : null,
    }
  }
  const key = client.studentId ? String(client.studentId) : null
  return {
    ...base,
    myVote: key ? meeting.votes[key] || null : null,
    summary: meeting.phase === PHASE.results ? summarize(meeting.votes, roles) : null,
  }
}

function sendState(client) {
  if (client.readyState !== 1 || !client.joined) return
  client.send(JSON.stringify({ type: 'state', state: viewFor(client), onlineIds: onlineIds() }))
}

function broadcast() {
  for (const client of wss.clients) sendState(client)
}

function commit(next) {
  if (!next || next.rev === meeting.rev) return
  meeting = next
  persist()
  broadcast()
}

const app = express()
app.get('/api/info', (_req, res) => {
  res.json({
    urls: lanUrls(PORT),
    caseCount: cases.length,
    roleCount: roles.length,
  })
})

if (isProd) {
  const dist = path.join(root, 'dist')
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('لم يُعثر على الواجهة. شغّلي الأمر: npm run build')
    process.exit(1)
  }
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

const server = createServer(app)
const wss = new WebSocketServer({ noServer: true })

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  if (pathname !== '/ws') return
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

wss.on('connection', (ws) => {
  ws.isAlive = true
  ws.joined = false
  ws.on('pong', () => {
    ws.isAlive = true
  })

  ws.on('message', (buffer) => {
    let message
    try {
      message = JSON.parse(buffer.toString())
    } catch {
      return
    }

    if (message.type === 'join') {
      if (message.role === 'host') {
        ws.isHost = true
        ws.joined = true
      } else if (message.role === 'student') {
        const studentId = Number(message.studentId)
        if (!Number.isInteger(studentId) || studentId < 1 || studentId > roles.length) {
          ws.send(JSON.stringify({ type: 'error', code: 'id' }))
          ws.close()
          return
        }
        for (const other of wss.clients) {
          if (other !== ws && other.studentId === studentId) {
            other.send(JSON.stringify({ type: 'replaced' }))
            other.close()
          }
        }
        ws.studentId = studentId
        ws.joined = true
        commit(apply(meeting, { type: 'arrive', studentId }, cases.length))
      } else {
        return
      }
      sendState(ws)
      broadcast()
      return
    }

    if (!ws.joined) return

    if (message.type === 'host' && ws.isHost) {
      const action = {
        type: message.action,
        caseIndex: Number(message.caseIndex),
        minutes: Number(message.minutes),
        choice: message.choice,
        step: message.step === undefined ? undefined : message.step,
        studentId: message.studentId,
        guess: message.guess,
      }
      if (action.type === 'advise' && cases[meeting.caseIndex]?.addressedTo !== 'host') return
      commit(apply(meeting, action, cases.length))
    }

    if (message.type === 'advise' && ws.studentId) {
      const item = cases[meeting.caseIndex]
      if (String(item?.addressedTo) !== String(ws.studentId)) return
      commit(apply(meeting, { type: 'advise', choice: message.choice }, cases.length))
    }

    if (message.type === 'vote' && ws.studentId) {
      commit(apply(meeting, { type: 'vote', studentId: ws.studentId, choice: message.choice }, cases.length))
    }
  })

  ws.on('close', () => broadcast())
})

const voteWatch = setInterval(() => {
  if (meeting.phase === PHASE.voting && meeting.voteEndsAt && Date.now() >= meeting.voteEndsAt) {
    commit(apply(meeting, { type: 'close' }, cases.length))
  }
}, 200)

const pulse = setInterval(() => {
  for (const client of wss.clients) {
    if (client.isAlive === false) {
      client.terminate()
      continue
    }
    client.isAlive = false
    client.ping()
  }
}, 15000)

wss.on('close', () => {
  clearInterval(pulse)
  clearInterval(voteWatch)
})

if (!isProd) {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    root,
    appType: 'spa',
    server: { middlewareMode: true, hmr: false },
  })
  app.use(vite.middlewares)
}

server.listen(PORT, '0.0.0.0', () => {
  const urls = lanUrls(PORT)
  console.log('')
  console.log('الاجتماع الطارئ — The Emergency Meeting')
  console.log('نوفا ترافل — Nova Travel')
  console.log(isProd ? 'وضع التشغيل للحصّة' : 'وضع التطوير للحصّة')
  urls.forEach((url) => {
    console.log(`المضيفة: ${url}/host`)
    console.log(`البنات: ${url}/join`)
  })
  console.log('')
})
