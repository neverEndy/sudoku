import React from 'react'
import { useSudoku } from '..'
import useNineSquare, { NineSquarePosition } from '../hooks/useNineSquare'
import NineSquare, { NineSquareCellData } from '../NineSquare'
import positionTransformer from '../utils/positionTransformer'
import './index.scss'

const Board = () => {
  const { setCellValue, board } = useSudoku()
  const { forEachUnitRenderer } = useNineSquare(board.value)

  const handleUnitChange = (refPosition: NineSquarePosition, { value: num, ...localPosition }: NineSquareCellData) => {
    const position = positionTransformer.toGlobal(refPosition, localPosition)
    setCellValue(position, num)
  }
  return (
    <div className='Board-root'>
      {
        forEachUnitRenderer(({ x, y, value: unitData }) => (
          <NineSquare key={`${x}-${y}`} value={unitData.value} onChange={(e) => handleUnitChange({ x, y }, e)}/>
        ))
      }
    </div>
  )
}

export default Board
