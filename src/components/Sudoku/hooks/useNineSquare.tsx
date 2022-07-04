import React, { useState } from 'react'

export type NineSquareValue<T> = Array<Array<T>>

/**
 * @example (x, y)
 * .--- --- ---.
 * |0,0|1,0|2,0|
 * .--- --- ---.
 * |0,1|1,1|2,1|
 * .--- --- ---.
 * |0,2|1,2|2,2|
 * .--- --- ---.
 */
export type NineSquarePosition = {
  x: number
  y: number
}

const useNineSquare = <T, >(value: NineSquareValue<T>) => {
  const [_value, _setValue] = useState(value)
  const getUnitByPosition = ({ x, y }: NineSquarePosition) => {
    return value[y][x]
  }
  const setUnitByPosition = ({ x, y }: NineSquarePosition, val: T) => {
    const newVal = [..._value]
    newVal[y][x] = val
    _setValue(newVal)
    return newVal
  }
  const forEachUnitRenderer = (callback: (param: NineSquarePosition & { value: T }) => React.ReactNode) => {
    return value.map((row, y) => (
      row.map((val, x) => {
        const payload = { x, y, value: val }
        return callback(payload)
      }))
    )
  }
  return {
    value: _value,
    setUnitByPosition,
    forEachUnitRenderer,
    getUnitByPosition
  }
}

export default useNineSquare

export class Wrapper<T> {
  wrapped (value: NineSquareValue<T>) {
    return useNineSquare<T>(value)
  }
}
