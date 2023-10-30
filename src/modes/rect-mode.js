import { zip, combineLatest } from 'rxjs'
import { map, takeUntil, repeat } from 'rxjs/operators'
import { watchMouseCoord } from './unit'

export class RectMode {
  constructor (main, preview) {
    this.main = main
    this.preview = preview

    this._drawRectPreview = this._drawRectPreview.bind(this)
    this._drawFinalRect = this._drawFinalRect.bind(this)
  }

  enable () {
    this.preview.style.display = 'block'
    this.preview.width = this.main.width
    this.preview.height = this.main.height
    this.pCtx = this.preview.getContext('2d')
    this.ctx = this.main.getContext('2d')

    const startPoint$ = watchMouseCoord(this.preview, 'mousedown')
    const coord$ = watchMouseCoord(this.preview, 'mousemove')
    const endPoint$ = watchMouseCoord(this.preview, 'mouseup')

    this.previewSubscription = combineLatest([startPoint$, coord$])
      .pipe(
        map(pointsToRect),
        takeUntil(endPoint$),
        repeat()
      )
      .subscribe(this._drawRectPreview)

    this.mainSubscription = zip(startPoint$, endPoint$)
      .pipe(map(pointsToRect))
      .subscribe(this._drawFinalRect)
  }

  disable () {
    this.preview.style.display = 'none'
    this.previewSubscription.unsubscribe()
    this.mainSubscription.unsubscribe()
  }

  _drawRectPreview (rect) {
    this._clearPreview()
    this.pCtx.strokeRect.apply(this.pCtx, rect)
  }

  _drawFinalRect (rect) {
    this.ctx.strokeRect.apply(this.ctx, rect)
    this._clearPreview()
  }

  _clearPreview () {
    this.pCtx.clearRect(0, 0, this.preview.width, this.preview.height)
  }
}

function pointsToRect ([[x, y], [x2, y2]]) {
  return [x, y, x2 - x, y2 - y]
}
