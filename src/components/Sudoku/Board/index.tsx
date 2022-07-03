import React from 'react'
import useNineSquare, { NineSquarePosition } from '../hooks/useNineSquare'
import NineSquare, { NineSquareCellData } from '../NineSquare'
import './index.scss'

// const createSmapleValue = (): (number | '')[][] => [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ]

const createSmapleValue2 = (): (number | '')[][] => [
  ['', '', ''],
  ['', 5, ''],
  ['', '', '']
]

const createSmapleValue3 = (): (number | '')[][] => [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const Board = () => {
  const {
    forEachUnitRenderer,
    getUnitByPosition: getSquareByPosition
  } = useNineSquare([
    [useNineSquare(createSmapleValue3()), useNineSquare(createSmapleValue3()), useNineSquare(createSmapleValue3())],
    [useNineSquare(createSmapleValue3()), useNineSquare(createSmapleValue2()), useNineSquare(createSmapleValue3())],
    [useNineSquare(createSmapleValue3()), useNineSquare(createSmapleValue3()), useNineSquare(createSmapleValue3())]
  ])

  const handleUnitChange = (boardUnitPosition: NineSquarePosition, { value: num, ...position }: NineSquareCellData) => {
    const { setUnitByPosition: setSquareCellValue } = getSquareByPosition(boardUnitPosition)
    setSquareCellValue(position, num)
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
