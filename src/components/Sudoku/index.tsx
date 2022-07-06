import React, { createContext, useContext, useEffect, useState } from 'react'
import Board from './Board'
import useNineSquare, { NineSquarePosition, Wrapper } from './hooks/useNineSquare'
import positionTransformer from './utils/positionTransformer'
import './index.scss'
import classNames from 'classnames'
import range from './utils/range'
import { shuffle, difference } from 'lodash'

export type SudokuGameConfig = {
  initialSeed: number
}

export type SudokuBoard = ReturnType<Wrapper<ReturnType<Wrapper<number | ''>['wrapped']>>['wrapped']>

type CellDatas = (number | '')[]

type SudokuContext = {
  newStart: () => void
  gameConfig: SudokuGameConfig
  board: SudokuBoard
  selectedPositions: NineSquarePosition[]
  setSelectedPositions: (val: NineSquarePosition[]) => void
  setCellValue: (param: NineSquarePosition, value: number | '') => void
  extractSquareCells: (param: NineSquarePosition) => { data: CellDatas, positions: NineSquarePosition[] }
  extractRowCells: (param: NineSquarePosition) => { data: CellDatas, positions: NineSquarePosition[] }
  extractColCells: (param: NineSquarePosition) => { data: CellDatas, positions: NineSquarePosition[] }
  extractCrossCells: (param: NineSquarePosition) => {
    data: {
        col: CellDatas
        row: CellDatas
    }
    position: {
        col: NineSquarePosition[]
        row: NineSquarePosition[]
    }
}
}

const sudokuContext = createContext({} as SudokuContext)

const defaultGameConfig: SudokuGameConfig = {
  initialSeed: 10
}

export interface ISudokuProps {
  className?: string
  gameConfig?: SudokuGameConfig
}

const createDefaultSquare = (): (number | '')[][] => [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const Sudoku = ({
  className = '',
  gameConfig = defaultGameConfig
}: ISudokuProps) => {
  const board = useNineSquare([
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
    [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())]
  ])

  // const shadowBoard = useNineSquare([
  //   [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
  //   [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())],
  //   [useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare()), useNineSquare(createDefaultSquare())]
  // ])
  const [selectedPositions, setSelectedPositions] = useState<Array<NineSquarePosition>>([])

  const getSquare = ({ x, y }: NineSquarePosition, myBoard: typeof board = board) => {
    const { refPosition } = positionTransformer.toLocal({ x, y })
    return myBoard.getUnitByPosition(refPosition)
  }

  const setCellValue: SudokuContext['setCellValue'] = ({ x, y }, value, myBoard: typeof board = board) => {
    const square = getSquare({ x, y }, myBoard)
    const { localPosition } = positionTransformer.toLocal({ x, y })
    square.setUnitByPosition(localPosition, value)
  }

  const getCellValue = ({ x, y }: NineSquarePosition, myBoard: typeof board = board) => {
    const square = getSquare({ x, y }, myBoard)
    const { localPosition } = positionTransformer.toLocal({ x, y })
    return square.getUnitByPosition(localPosition)
  }

  const extractSquareCells = ({ x, y }: NineSquarePosition, myBoard: typeof board = board) => {
    const { refPosition, localPosition } = positionTransformer.toLocal({ x, y })
    const xs = range(0, 3)
    const ys = range(0, 3)
    const mapPos = xs.map(x => ys.map(y => ({ x, y })).flat()).flat().filter(pos => {
      return pos.x !== localPosition.x && pos.y !== localPosition.y
    })
    const square = getSquare({ x, y }, myBoard)
    return {
      data: square.value.map(item => item.flat()).flat(),
      positions: mapPos.map(pos => positionTransformer.toGlobal(refPosition, pos))
    }
  }

  const extractRowCells = ({ x, y }: NineSquarePosition, myBoard: typeof board = board) => {
    const searchXs = [...range(0, x), ...range(x + 1, 8 - x)]
    const positions = searchXs.map(x => ({ x, y }))
    return {
      data: searchXs.map(x => getCellValue({ x, y }, myBoard)),
      positions
    }
  }

  const extractColCells = ({ x, y }: NineSquarePosition, myBoard: typeof board = board) => {
    const searchYs = [...range(0, y), ...range(y + 1, 8 - y)]
    const positions = searchYs.map(y => ({ x, y }))
    return {
      data: searchYs.map(y => getCellValue({ x, y }, myBoard)),
      positions
    }
  }

  const extractCrossCells = ({ x, y }: NineSquarePosition) => {
    const { data: rowCellDatas, positions: xPosition } = extractRowCells({ x, y })
    const { data: colCellDatas, positions: yPosition } = extractColCells({ x, y })
    return {
      data: {
        col: colCellDatas,
        row: rowCellDatas
      },
      position: {
        col: yPosition,
        row: xPosition
      }
    }
  }

  const extractFocusCells = ({ x, y }: NineSquarePosition) => {
    const {
      data: { col: colDatas, row: rowDatas },
      position: { col: colPosition, row: rowPosition }
    } = extractCrossCells({ x, y })
    const { data: squareDatas, positions } = extractSquareCells({ x, y })
    const flatArray = [...colDatas, ...rowDatas, ...squareDatas]
    return {
      data: Array.from(new Set(flatArray.filter(item => typeof item === 'number'))),
      positions: [...colPosition, ...rowPosition, positions]
    }
  }

  // const asyncSetCellValue = ({ x, y }: NineSquarePosition, value: number | '') => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       setCellValue({ x, y }, value)
  //       resolve(null)
  //     }, 3000)
  //   })
  // }

  const clearBoard = () => {
    const xs = range(0, 9)
    const ys = range(0, 9)
    xs.forEach(x => ys.forEach(y => {
      setCellValue({ x, y }, '')
    }))
  }

  const newStart = () => {
    clearBoard()
    const initialDatas = shuffle(range(1, 9))
    const xs = range(0, 9)
    const ys = range(1, 8)
    xs.forEach(x => setCellValue({ x, y: 0 }, initialDatas[x]))
    for (const y of ys) {
      for (const x of xs) {
        const { data: usedValues } = extractFocusCells({ x, y })
        const availableValues = difference(range(1, 9), usedValues)
        if (!availableValues[0]) {
          console.warn('fuck something went wrong')
          // newStart()
        }
        setCellValue({ x, y }, availableValues[0])
        // await asyncSetCellValue({ x, y }, availableValues[0])
      }
    }
  }

  useEffect(() => {
    newStart()
  }, [])

  const value: SudokuContext = {
    newStart,
    setCellValue,
    gameConfig,
    board,
    extractCrossCells,
    extractSquareCells,
    extractColCells,
    extractRowCells,
    selectedPositions,
    setSelectedPositions
  }
  return (
    <sudokuContext.Provider value={value}>
      <div className={classNames('Sudoku-root', className)}>
        <Board />
      </div>
    </sudokuContext.Provider>
  )
}

export const useSudoku = () => useContext(sudokuContext)

export default Sudoku
