import React, { useState } from 'react'
import Board from './Board'
import Actions from './Actions'
import { useSudoku, WithSudokuProvider } from './SudokuProvider'
import './index.scss'
import Popup, { IPopupProps } from '../Popup'

export interface ISudokuProps {}

const Sudoku = () => {
  const {
    extractAllCellValues,
    solve,
    board,
    newStart
    // updateGameConfig
  } = useSudoku()
  const [popupInfo, setPopupInfo] = useState<Omit<IPopupProps, 'onClose'>>({
    title: '',
    children: '',
    open: false
  })

  const isComplete = extractAllCellValues().filter(item => typeof item !== 'string').length === 81

  const showPass = () => {
    setPopupInfo(prev => ({
      ...prev,
      open: true,
      title: 'Correct!',
      children: 'you can have a new start'
    }))
  }

  const showFailure = () => {
    setPopupInfo(prev => ({
      ...prev,
      open: true,
      title: 'Not Correct',
      children: 'keep going'
    }))
  }

  const handleSolve = () => {
    const { isSolved } = solve()
    isSolved ? showPass() : showFailure()
  }

  const handleNewStart = () => {
    newStart()
  }
  return (
    <div className='Sudoku-root'>
      <Actions
        onSolve={handleSolve} onNewStart={handleNewStart}
        disabledSolve={!isComplete}/>
      <Board board={board}/>
      <Popup {...popupInfo} onClose={() => setPopupInfo(prev => ({ ...prev, open: false }))}>{popupInfo.children}</Popup>
    </div>
  )
}
export default WithSudokuProvider()(Sudoku)
