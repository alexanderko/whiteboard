import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'

export function watchMouseCoord (node, eventType) {
  return fromEvent(node, eventType).pipe(
    map(e => [e.offsetX, e.offsetY])
  )
}
