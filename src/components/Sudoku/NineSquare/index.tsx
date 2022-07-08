import React from 'react'
import Cell, { ICellProps } from '../Cell'
import useNineSquare, { NineSquarePosition } from '../hooks/useNineSquare'
import './index.scss'

export type NineSquareCellData = NineSquarePosition & {
  value: ICellProps['value']
}

export interface INineSquareProps {
  position: NineSquarePosition
  value: (ICellProps['value'])[][]
  onChange: (param: NineSquareCellData) => void
}

const isValueFormatValid = (value: INineSquareProps['value']) => {
  const has3Rows = value.length === 3
  const has3Cols = value[0]?.length === 3
  return has3Cols && has3Rows
}

const NineSquare = ({
  position,
  value,
  onChange
}: INineSquareProps) => {
  const isValueValid = isValueFormatValid(value)
  const { forEachUnitRenderer } = useNineSquare<ICellProps['value']>(value)
  const handleChange = (x: number, y: number, value: ICellProps['value']) => {
    onChange({ x, y, value })
  }

  if (!isValueValid) {
    throw new Error('value needs 3*3 array')
  }
  return (
    <div className='NineSquare-root'>
      {
        forEachUnitRenderer(({ x, y, value: val }) => (
          <Cell refPosition={position} position={{ x, y }} key={`${x}-${y}`} value={val} onChange={(val) => handleChange(x, y, val)}/>
        ))
      }
    </div>
  )
}

export default NineSquare
