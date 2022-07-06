import React from 'react'
import classNames from 'classnames'
import './index.scss'
import { NineSquarePosition } from '../hooks/useNineSquare'
import positionTransformer from '../utils/positionTransformer'
import { useSudoku } from '..'

export interface ICellProps {
  refPosition: NineSquarePosition
  position: NineSquarePosition
  value: number | ''
  onChange: (value: ICellProps['value']) => void
  error?: boolean
  onError?: () => void
}

const cheatValue = '1,2,3,4,5,6,7,8,9'

const isValueValid = (val: number) => {
  const isNumber = typeof val === 'number'
  const isInSide = [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(val)
  return isInSide && isNumber
}

const isPositionEqual = (pos1: NineSquarePosition, pos2: NineSquarePosition) => {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

const Cell = ({
  refPosition,
  position,
  value,
  onChange,
  error = false
}: ICellProps) => {
  const cellPosition = positionTransformer.toGlobal(refPosition, position)
  const { setSelectedPositions, selectedPositions, extractSquareCells, extractCrossCells } = useSudoku()
  const handleHoverEffect = () => {
    const { position } = extractCrossCells(cellPosition)
    const { positions } = extractSquareCells(cellPosition)
    setSelectedPositions([
      ...position.col,
      ...position.row,
      ...positions
    ])
  }
  const handleValueChange = (val: number) => {
    if (isNaN(val)) {
      onChange('')
    }
    if (isValueValid(val)) {
      onChange(val)
    }
  }
  return (
    <span className={classNames('Cell-root', {
      selected: !!selectedPositions.find(item => isPositionEqual(item, cellPosition))
    })}>
      <input
        onFocus={() => handleHoverEffect()}
        className={classNames('Cell-root-input', {
          'Cell-root-error': error
        })}
        value={String(value)}
        onChange={e => handleValueChange(Number(e.target.value.at(-1)))}
      />
      <span className='Cell-root-cheatBoard'>
        {
          cheatValue.split(',').map((item, i) => <p key={i}>{item}</p>)
        }
      </span>
    </span>
  )
}

export default Cell
