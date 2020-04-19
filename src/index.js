const DOT_SIZE = 2

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.lineWidth = DOT_SIZE

canvas.addEventListener('mousedown', function (e) {
  const x = e.offsetX
  const y = e.offsetY
  ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE)
  ctx.moveTo(x, y)
})

canvas.addEventListener('mousemove', function (e) {
  if (e.which === 0) return
  const x = e.offsetX
  const y = e.offsetY
  ctx.lineTo(x, y)
  ctx.stroke()
})
