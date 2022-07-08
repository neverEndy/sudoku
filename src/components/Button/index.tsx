import classNames from 'classnames'
import React from 'react'
import './index.scss'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}
const Button = ({
  children,
  className = '',
  ...rest
}: IButtonProps) => {
  return <button className={classNames('Button-root', className)} {...rest}>{children}</button>
}

export default Button
