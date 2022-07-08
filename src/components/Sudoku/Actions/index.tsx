import React, { useState } from 'react'
import Popup from '../../Popup'
import GameConfig from './GameConfig'
import Button from '../../Button'
import './index.scss'

export interface IActionsProps {
  onSolve: () => void
  disabledSolve?: boolean
  onNewStart: () => void
  disabledNewStart?: boolean
}

const Actions = ({
  onSolve,
  disabledSolve = false,
  onNewStart,
  disabledNewStart = false
}: IActionsProps) => {
  const [openSetting, setOpenSetting] = useState(false)
  return (
    <>
      <div className='Actions-root'>
        <Button className='Actions-root-btn' disabled={disabledSolve} onClick={onSolve}>Solve</Button>
        <Button className='Actions-root-btn' disabled={disabledNewStart} onClick={onNewStart}>New Start</Button>
        <Button className='Actions-root-btn' disabled={disabledNewStart} onClick={() => setOpenSetting(true)}>Setting</Button>
      </div>
      <Popup
        open={openSetting}
        title='Game Setting'
        onClose={() => setOpenSetting(false)}>
        <GameConfig onClose={() => setOpenSetting(false)}/>
      </Popup>
    </>
  )
}

export default Actions
