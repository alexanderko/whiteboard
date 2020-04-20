import { fromEvent, zip } from 'rxjs'
import { filter, map, takeUntil, combineLatest, repeat, first, repeatWhen } from 'rxjs/operators'
import { M_KEY, R_KEY } from './keycode'

const DOT_SIZE = 2

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.lineWidth = DOT_SIZE

const rectMode$ = watchKey(R_KEY)
const markerMode$ = watchKey(M_KEY)

function watchKey (keyCode) {
  return fromEvent(document, 'keydown')
    .pipe(
      filter(e => e.keyCode === keyCode),
      map(_ => keyCode)
    )
}

rectMode$
  .pipe(
    first(),
    repeatWhen(() => markerMode$)
  )
  .subscribe(enablePreview)

markerMode$
  .pipe(
    first(),
    repeatWhen(() => rectMode$)
  )
  .subscribe(disablePreview)

const preview = document.getElementById('preview')
let pctx
let previewUnsubscribe
let finalUnsubscribe

function disablePreview () {
  preview.style.display = 'none'
  previewUnsubscribe.unsubscribe()
  finalUnsubscribe.unsubscribe()
}

function enablePreview () {
  preview.style.display = 'block'
  preview.width = canvas.width
  preview.height = canvas.height
  pctx = preview.getContext('2d')

  const startPoint$ = watchMouseCoord(preview, 'mousedown')
  const coord$ = watchMouseCoord(preview, 'mousemove')
  const endPoint$ = watchMouseCoord(preview, 'mouseup')

  previewUnsubscribe = startPoint$
    .pipe(
      combineLatest(coord$),
      map(pointsToRect),
      takeUntil(endPoint$),
      repeat()
    )
    .subscribe(drawRectPreview)

  finalUnsubscribe = zip(startPoint$, endPoint$)
    .pipe(map(pointsToRect))
    .subscribe(drawFinalRect)
}

function drawFinalRect (rect) {
  ctx.strokeRect.apply(ctx, rect)
  clearPreview()
}

function pointsToRect ([[x, y], [x2, y2]]) {
  return [x, y, x2 - x, y2 - y]
}

function clearPreview () {
  pctx.clearRect(0, 0, preview.width, preview.height)
}

function drawRectPreview (rect) {
  clearPreview()
  pctx.strokeRect.apply(pctx, rect)
}

function watchMouseCoord (node, eventType) {
  return fromEvent(node, eventType).pipe(
    map(e => [e.offsetX, e.offsetY])
  )
}

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
