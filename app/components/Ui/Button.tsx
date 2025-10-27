import React from 'react'

const Button = ({ children, variant } : { children: React.ReactNode, variant: string }) => {
  return (
    <button type='submit' className={`${variant}`}>
      {children}
    </button>
  )
}

export default Button
