import React, { createContext, useContext } from 'react'
import Board from './Board'
import useNineSquare, { Wrapper } from './hooks/useNineSquare'
import positionTransformer from './utils/positionTransformer'
import check from './utils/check'
import './index.scss'

export type SudokuGameConfig = {
  initialSeed: number
}

export type SudokuBoard = ReturnType<Wrapper<ReturnType<Wrapper<number | ''>['wrapped']>>['wrapped']>

type SudokuContext = {
  newStart: () => void
  gameConfig: SudokuGameConfig
  board: SudokuBoard
  setCellValue: (param: { x: number, y: number }, value: number | '') => void
}

const sudokuContext = createContext({} as SudokuContext)

const defaultGameConfig: SudokuGameConfig = {
  initialSeed: 10
}

export interface ISudokuProps {
  gameConfig?: SudokuGameConfig
}

const createDefaultSquare = (): (number | '')[][] => [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const Sudoku = ({
  gameConfig = defaultGameConfig
}: ISudokuProps) => {
  const board = useNineSquare([
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())]
  ])

  const newStart = () => {}

  const setCellValue: SudokuContext['setCellValue'] = ({ x, y }, value) => {
    const { refPosition, localPosition } = positionTransformer.toLocal({ x, y })
    const square = board.getUnitByPosition(refPosition)
    square.setUnitByPosition(localPosition, value)
    console.log('isRulePass', check.square(square.value).isRulePass())
    console.log('isComplete', check.square(square.value).isComplete())
  }

  const value: SudokuContext = {
    newStart,
    setCellValue,
    gameConfig,
    board
  }
  return (
    <sudokuContext.Provider value={value}>
      <div className='Sudoku-root'>
        <Board />
      </div>
    </sudokuContext.Provider>
  )
}

export const useSudoku = () => useContext(sudokuContext)

export default Sudoku
