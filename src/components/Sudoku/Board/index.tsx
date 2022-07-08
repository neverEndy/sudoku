import React from 'react'
import { SudokuBoard, useSudoku } from '../SudokuProvider'
import useNineSquare, { NineSquarePosition } from '../hooks/useNineSquare'
import NineSquare, { NineSquareCellData } from '../NineSquare'
import positionTransformer from '../utils/positionTransformer'
import './index.scss'

interface IBoardProps {
  board?: SudokuBoard
}

const Board = ({
  board: desireBoard
}: IBoardProps) => {
  const { setCellValue, board: defaultBoard } = useSudoku()
  const board = desireBoard || defaultBoard
  const { forEachUnitRenderer } = useNineSquare(board.value)

  const handleUnitChange = (refPosition: NineSquarePosition, { value: num, ...localPosition }: NineSquareCellData) => {
    const position = positionTransformer.toGlobal(refPosition, localPosition)
    setCellValue(position, num, board)
  }
  return (
    <div className='Board-root'>
      {
        forEachUnitRenderer(({ x, y, value: unitData }) => (
          <NineSquare position={{ x, y }} key={`${x}-${y}`} value={unitData.value} onChange={(e) => handleUnitChange({ x, y }, e)}/>
        ))
      }
    </div>
  )
}

export default Board
