import React from 'react'

const Button = ({ children, variant, disabled } : { children: React.ReactNode, variant: string, disabled: boolean }) => {
  return (
    <button disabled={disabled} type='submit' className={`${variant}`}>
      {children}
    </button>
  )
}

export default Button
