import React from 'react'
import { createPortal } from 'react-dom'
import './index.scss'

export interface IPopupProps {
  title: string
  children?: React.ReactNode
  open: boolean
  onClose: () => void
  withBackDrop?: boolean
  closeOnClickBackDrop?: boolean
}

const Popup = ({
  title,
  children,
  open,
  onClose,
  withBackDrop = true,
  closeOnClickBackDrop = true
}: IPopupProps) => {
  if (!open) return null
  return (
    createPortal((
      <div className='Popup-root'>
        <div className="Popup-container">
          <span className='Popup-container-closeBtn' onClick={() => onClose()}>✕</span>
          <div className="Popup-container-title">{title}</div>
          <div className="Popup-container-content">{children}</div>
        </div>
        {withBackDrop && <div className="Popup-Block" onClick={() => closeOnClickBackDrop && onClose()}></div>}
      </div>
    ), document.body)
  )
}

export default Popup
