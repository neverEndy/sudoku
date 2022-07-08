import React, { useState } from 'react'
import { map } from 'lodash'
import { Difficulty, useSudoku } from '../SudokuProvider'
import Button from '../../Button'
import Popup from '../../Popup'

interface IGameConfigProps {
  onClose: () => void
}

const GameConfig = ({
  onClose
}: IGameConfigProps) => {
  const {
    gameConfig,
    updateGameConfig,
    newStart
  } = useSudoku()
  const [difficulty, setDifficulty] = useState(gameConfig.difficulty)
  const [cheatMode, setCheatMode] = useState(gameConfig.cheatMode)
  const [openRestartWarning, setOpenRestartWarning] = useState(false)

  const handleConfirm = () => {
    const newConfig = { ...gameConfig, difficulty, cheatMode }
    if (gameConfig.difficulty !== difficulty) {
      return setOpenRestartWarning(true)
    }
    updateGameConfig(newConfig)
    onClose()
  }

  const handleWarngingConfigm = () => {
    const newConfig = { ...gameConfig, difficulty, cheatMode }
    updateGameConfig(newConfig)
    newStart(newConfig)
    onClose()
  }
  return (
    <div className="GameConfig-root">
      <div className="GameConfig-form">
        <fieldset className='GameConfig-form-field'>
          <label>Difficulty: </label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value as keyof typeof Difficulty)}>
            {
              map(Difficulty, (value, key) => (
                <option key={key} value={key}>{key}</option>
              ))
            }
          </select>
          {gameConfig.difficulty !== difficulty && <p className='GameConfig-form-field-helper'>Require Game Restart</p>}
        </fieldset>
        <fieldset className='GameConfig-form-field'>
          <label>Cheat Mode: </label>
          <input type="checkbox" checked={cheatMode} onChange={e => setCheatMode(e.target.checked)}/>
        </fieldset>
      </div>
      <div className="GameConfig-root-actions">
        <Button onClick={onClose}>cancel</Button>
        <Button onClick={handleConfirm}>confirm</Button>
      </div>
      <Popup
        title='Warning'
        open={openRestartWarning}
        onClose={() => setOpenRestartWarning(false)}>
          <div className='GameConfig-root'>
            <p className='GameConfig-form'>Require Game Restart</p>
            <div className="GameConfig-root-actions">
              <Button onClick={() => setOpenRestartWarning(false)}>cancel</Button>
              <Button onClick={handleWarngingConfigm}>confirm</Button>
            </div>
          </div>
      </Popup>
    </div>
  )
}

export default GameConfig
