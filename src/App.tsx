import React from 'react'
import Sudoku from './components/Sudoku'
import './App.scss'

function App () {
  return (
    <div className="App-root">
      <Sudoku className='App-root-game'/>
      <img className='App-root-fucker' src="./fuck.png" alt="fuck" />
    </div>
  )
}

export default App
