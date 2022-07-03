import React from 'react'
import classNames from 'classnames'
import './index.scss'
export interface ICellProps {
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

const Cell = ({
  value,
  onChange,
  error = false
}: ICellProps) => {
  const handleValueChange = (val: number) => {
    if (isNaN(val)) {
      onChange('')
    }
    if (isValueValid(val)) {
      onChange(val)
    }
  }
  return (
    <span className='Cell-root'>
      <input
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
