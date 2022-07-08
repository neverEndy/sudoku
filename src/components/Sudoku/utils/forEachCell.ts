import { range } from 'lodash'
import { NineSquarePosition } from '../hooks/useNineSquare'

const forEachCell = (cb: ({ position, index }: {position: NineSquarePosition, index: number}) => void) => {
  const xs = range(0, 9)
  const ys = range(0, 9)
  let i = 0
  for (const y of ys) {
    for (const x of xs) {
      const param = { position: { x, y }, index: i }
      cb(param)
      i++
    }
  }
}

export default forEachCell
