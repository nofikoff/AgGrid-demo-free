export function drawSparkline(canvas: HTMLCanvasElement, data: number[]): void {
  const ctx = canvas.getContext('2d')
  if (!ctx || data.length < 2) return

  const w = canvas.width
  const h = canvas.height
  const pad = 2
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = (w - pad * 2) / (data.length - 1)

  const isUp = data[data.length - 1]! >= data[0]!
  const color = isUp ? '#22c55e' : '#ef4444'

  ctx.clearRect(0, 0, w, h)

  // Fill area
  ctx.beginPath()
  ctx.moveTo(pad, h)
  data.forEach((val, i) => {
    const x = pad + i * step
    const y = h - pad - ((val - min) / range) * (h - pad * 2)
    ctx.lineTo(x, y)
  })
  ctx.lineTo(pad + (data.length - 1) * step, h)
  ctx.closePath()
  ctx.fillStyle = isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
  ctx.fill()

  // Draw line
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  data.forEach((val, i) => {
    const x = pad + i * step
    const y = h - pad - ((val - min) / range) * (h - pad * 2)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // End dot
  const lastX = pad + (data.length - 1) * step
  const lastY = h - pad - ((data[data.length - 1]! - min) / range) * (h - pad * 2)
  ctx.beginPath()
  ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}
