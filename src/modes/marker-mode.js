export class MarkerMode {
  constructor (canvas, dotSize) {
    const ctx = canvas.getContext('2d')

    canvas.addEventListener('mousedown', function (e) {
      const x = e.offsetX
      const y = e.offsetY
      ctx.fillRect(x, y, dotSize, dotSize)
      ctx.moveTo(x, y)
    })

    canvas.addEventListener('mousemove', function (e) {
      if (e.which === 0) return
      const x = e.offsetX
      const y = e.offsetY
      ctx.lineTo(x, y)
      ctx.stroke()
    })
  }

  enable () {}

  disable () {}
}
