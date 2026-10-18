let ctx
let unlocking

function context() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  return ctx
}

function ready() {
  const audio = context()
  if (!audio) return Promise.resolve(null)
  if (audio.state === 'running') return Promise.resolve(audio)
  if (!unlocking) {
    unlocking = audio.resume().finally(() => {
      unlocking = null
    })
  }
  return unlocking.then(() => (audio.state === 'running' ? audio : null))
}

function tone(freq, duration, type = 'sine', gain = 0.05, delay = 0) {
  const audio = context()
  if (!audio) return
  const start = audio.currentTime + delay
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(amp)
  amp.connect(audio.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

function play(notes) {
  ready().then((audio) => {
    if (!audio) return
    notes.forEach((note) => tone(...note))
  })
}

export function armVoteSound() {
  return ready()
}

export function playVoteOpen() {
  play([
    [392, 0.16, 'sine', 0.045, 0],
    [523, 0.18, 'triangle', 0.04, 0.12],
    [659, 0.32, 'sine', 0.035, 0.24],
  ])
}

export function playVoteTick(second) {
  const urgent = second <= 3
  play([[urgent ? 880 : 520, urgent ? 0.12 : 0.07, 'square', urgent ? 0.04 : 0.02, 0]])
}

export function playVoteLand() {
  play([[740, 0.08, 'triangle', 0.03, 0]])
}

export function playVoteReveal() {
  play([
    [523, 0.22, 'sine', 0.04, 0],
    [659, 0.28, 'sine', 0.04, 0.08],
    [784, 0.42, 'triangle', 0.045, 0.16],
  ])
}
