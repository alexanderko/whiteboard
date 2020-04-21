import { fromEvent } from 'rxjs'
import { filter, map, distinctUntilChanged, pairwise, startWith } from 'rxjs/operators'
import { M_KEY, R_KEY } from './keycode'

import { RectMode } from './modes/rect-mode'
import { MarkerMode } from './modes/marker-mode'

const DOT_SIZE = 2

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.lineWidth = DOT_SIZE

const preview = document.getElementById('preview')
const pCtx = canvas.getContext('2d')
pCtx.lineWidth = DOT_SIZE

const RECT = 'rect'
const MARKER = 'marker'
const NO_MODE = 'noMode'

const keyMode = {
  [R_KEY]: RECT,
  [M_KEY]: MARKER
}

const modes = {
  [NO_MODE]: { disable: function () {} },
  [RECT]: new RectMode(canvas, preview),
  [MARKER]: new MarkerMode(canvas, DOT_SIZE)
}

fromEvent(document, 'keydown')
  .pipe(
    map(e => keyMode[e.keyCode]),
    filter(mode => !!mode),
    startWith(NO_MODE, MARKER),
    distinctUntilChanged(),
    map(mode => modes[mode]),
    pairwise()
  )
  .subscribe(([prev, current]) => {
    prev.disable()
    current.enable()
  })
