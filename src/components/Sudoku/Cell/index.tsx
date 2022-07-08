import React, { useMemo } from 'react'
import classNames from 'classnames'
import './index.scss'
import { useSudoku } from '../SudokuProvider'
import { NineSquarePosition } from '../hooks/useNineSquare'
import positionTransformer from '../utils/positionTransformer'
import { difference, range } from 'lodash'
export interface ICellProps {
  refPosition: NineSquarePosition
  position: NineSquarePosition
  value: number | ''
  onChange: (value: ICellProps['value']) => void
  error?: boolean
  onError?: () => void
}

const isValueValid = (val: number) => {
  const isNumber = typeof val === 'number'
  const isInSide = [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(val)
  return isInSide && isNumber
}

const isPositionSame = (pos1: NineSquarePosition, pos2: NineSquarePosition) => {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

const isPositionsInclude = (positions: NineSquarePosition[], target: NineSquarePosition) => {
  return !!positions.find(position => isPositionSame(position, target))
}

const Cell = ({
  refPosition,
  position,
  value,
  onChange,
  error = false
}: ICellProps) => {
  const cellGlobalPosition = positionTransformer.toGlobal(refPosition, position)
  const { getFocusCells, setSelectedPosition, selectedPosition, frozenPositions, gameConfig } = useSudoku()
  const frozen = useMemo(() => isPositionsInclude(frozenPositions, cellGlobalPosition), [frozenPositions])
  const cheatValues = (() => {
    const { values } = getFocusCells(cellGlobalPosition)
    const usedValues = Array.from(new Set(values))
    return difference(range(1, 10), Array.from(new Set(usedValues)))
  })()

  const handleValueChange = (val: number) => {
    if (isNaN(val)) {
      onChange('')
    }
    if (isValueValid(val)) {
      onChange(val)
    }
  }

  const handleFocusEffect = () => {
    const { positions } = getFocusCells(cellGlobalPosition)
    setSelectedPosition(positions)
  }

  return (
    <span className={classNames('Cell-root', {
      focus: isPositionsInclude(selectedPosition, cellGlobalPosition)
    })}>
      <input
        className={classNames('Cell-root-input', {
          'Cell-root-error': error
        })}
        disabled={frozen}
        value={String(value)}
        onChange={e => handleValueChange(Number(e.target.value.at(-1)))}
        onFocus={() => handleFocusEffect()}
      />
      <span className='Cell-root-cheatBoard'>
        {
          !frozen && gameConfig.cheatMode && cheatValues.map((item, i) => <p key={i}>{item}</p>)
        }
      </span>
    </span>
  )
}

export default Cell
