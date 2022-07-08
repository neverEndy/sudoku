import React, { ComponentType, createContext, useCallback, useContext, useEffect, useState } from 'react'
import useNineSquare, { NineSquarePosition, Wrapper } from './hooks/useNineSquare'
import positionTransformer from './utils/positionTransformer'
import SudokuCore, { generater } from './utils/Sudoku'
import { flatMapDeep, range } from 'lodash'
import forEachCell from './utils/forEachCell'

export const Difficulty = {
  Easy: 62,
  Medium: 53,
  Hard: 44,
  VaryHard: 35,
  Insane: 26,
  Inhuman: 17
}

export type SudokuGameConfig = {
  difficulty: keyof typeof Difficulty
  cheatMode: boolean
}

type CellValue = number |''

export type SudokuBoard = ReturnType<Wrapper<ReturnType<Wrapper<CellValue>['wrapped']>>['wrapped']>

type SudokuContext = {
  newStart: (myConfig?: SudokuGameConfig) => void
  gameConfig: SudokuGameConfig
  updateGameConfig: (conf: Partial<SudokuGameConfig>) => void
  board: SudokuBoard
  selectedPosition: NineSquarePosition[]
  frozenPositions: NineSquarePosition[]
  setFrozenPositions: (val: NineSquarePosition[]) => void
  setSelectedPosition: (val: NineSquarePosition[]) => void
  setCellValue: (param: { x: number, y: number }, value: CellValue, myBoard?: SudokuBoard) => void
  getCrossCells: (pos: NineSquarePosition) => { positions: NineSquarePosition[]; values: CellValue[]; }
  getSquareCells: (pos: NineSquarePosition) => { positions: NineSquarePosition[]; values: CellValue[]; }
  getFocusCells: (pos: NineSquarePosition) => { positions: NineSquarePosition[]; values: CellValue[]; }
  getCellValue: (position: NineSquarePosition) => CellValue
  solve: () => { isSolved: boolean, ans: string }
  extractAllCellValues: (myBoard?: SudokuBoard) => CellValue[]
}

const sudokuContext = createContext({} as SudokuContext)

const defaultGameConfig: SudokuGameConfig = {
  difficulty: 'Medium',
  cheatMode: false
}

export interface ISudokuProviderProps {
  gameConfig?: SudokuGameConfig
  children: React.ReactNode
}

const createDefaultSquare = (): (CellValue)[][] => [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const SudokuProvider = ({
  gameConfig = defaultGameConfig,
  children
}: ISudokuProviderProps) => {
  const [config, setConfic] = useState<SudokuGameConfig>(gameConfig)
  const [frozenPositions, setFrozenPositions] = useState<NineSquarePosition[]>([])
  const [selectedPosition, setSelectedPosition] = useState<NineSquarePosition[]>([])
  const board = useNineSquare([
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())]
  ])

  const shadowBoard = useNineSquare([
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())]
  ])

  const updateGameConfig = (conf: Partial<SudokuGameConfig>) => {
    setConfic(prev => ({
      ...prev,
      ...conf
    }))
  }

  const getSquare = (position: NineSquarePosition, myBoard: SudokuBoard = board) => {
    const { refPosition } = positionTransformer.toLocal(position)
    const square = myBoard.getUnitByPosition(refPosition)
    return square
  }

  const getCellValue = (position: NineSquarePosition, myBoard: SudokuBoard = board) => {
    const { localPosition } = positionTransformer.toLocal(position)
    const square = getSquare(position, myBoard)
    const value = square.getUnitByPosition(localPosition)
    return value
  }

  const setCellValue: SudokuContext['setCellValue'] = ({ x, y }, value, myBoard = board) => {
    const { localPosition } = positionTransformer.toLocal({ x, y })
    const square = getSquare({ x, y }, myBoard)
    square.setUnitByPosition(localPosition, value)
  }

  const getSquareCells = ({ x, y }: NineSquarePosition, myBoard: SudokuBoard = board) => {
    const { refPosition } = positionTransformer.toLocal({ x, y })
    const xs = range(0, 3)
    const ys = range(0, 3)
    const flatPositions = flatMapDeep(xs.map(x => ys.map(y => ({ x, y }))))
    const positions = flatPositions.map(pos => positionTransformer.toGlobal(refPosition, pos)).filter(pos => !(pos.x === x && pos.y === y))
    return {
      positions,
      values: positions.map(pos => getCellValue(pos, myBoard))
    }
  }

  const getCrossCells = ({ x, y }: NineSquarePosition, myBoard: SudokuBoard = board) => {
    const xs = [...range(0, x), ...range(x + 1, 9)]
    const ys = [...range(0, y), ...range(y + 1, 9)]
    const rowPositions = xs.map(p => ({ x: p, y }))
    const colPositions = ys.map(p => ({ x, y: p }))
    const positions = [...rowPositions, ...colPositions]
    return {
      positions,
      values: positions.map(pos => getCellValue(pos, myBoard))
    }
  }

  const getFocusCells = (position: NineSquarePosition, myBoard: SudokuBoard = board) => {
    const square = getSquareCells(position, myBoard)
    const cross = getCrossCells(position, myBoard)
    return {
      positions: [...square.positions, ...cross.positions],
      values: [...square.values, ...cross.values]
    }
  }

  const clearBoard = (myBoard: SudokuBoard = board) => {
    forEachCell(({ position }) => {
      setCellValue(position, '', myBoard)
    })
  }

  const extractAllCellValues = useCallback((myBoard: SudokuBoard = board) => {
    const result: CellValue[] = []
    forEachCell(({ position }) => {
      const value = getCellValue(position, myBoard)
      result.push(value)
    })
    return result
  }, [board])

  const solve = () => {
    clearBoard(shadowBoard)
    const puz = extractAllCellValues().map(value => typeof value === 'string' ? '.' : String(value)).join('')
    const result = SudokuCore.solve(puz, true)
    const isSolved = puz === result
    const ans = typeof result === 'string' ? result : puz
    forEachCell(({ position, index }) => {
      const value = Number(ans.at(index))
      setCellValue(position, isNaN(value) ? '' : value, shadowBoard)
    })
    return {
      isSolved,
      ans
    }
  }

  const newStart = (myConfig: SudokuGameConfig = config, myBoard: SudokuBoard = board) => {
    const puz = generater(Difficulty[myConfig.difficulty])
    const frozenPositions: Array<NineSquarePosition> = []
    forEachCell(({ position, index }) => {
      const value = puz[index]
      const isEmpty = typeof value === 'string'
      if (!isEmpty) frozenPositions.push(position)
      setCellValue(position, value, myBoard)
    })
    setFrozenPositions(frozenPositions)
  }

  useEffect(() => {
    newStart()
  }, [])

  const value: SudokuContext = {
    newStart,
    setCellValue,
    gameConfig: config,
    updateGameConfig,
    board,
    getCrossCells,
    getSquareCells,
    getFocusCells,
    selectedPosition,
    setSelectedPosition,
    getCellValue,
    frozenPositions,
    setFrozenPositions,
    solve,
    extractAllCellValues
  }
  return (
    <sudokuContext.Provider value={value}>
      {children}
    </sudokuContext.Provider>
  )
}

export const useSudoku = () => useContext(sudokuContext)

export const WithSudokuProvider = (config: ISudokuProviderProps['gameConfig'] = defaultGameConfig) =>
  <P extends { [k: string]: any }>(Component: ComponentType<P>) => {
    const Wrapper = (props: P) => {
      return (
        <SudokuProvider gameConfig={config}>
          <Component {...props}/>
        </SudokuProvider>
      )
    }
    return Wrapper
  }

export default SudokuProvider
