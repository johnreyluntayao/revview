import { ChipProps } from '@/lib/types'
import React from 'react'

 const variantStyles = {
  default: {
    background: '',
    text: '',
  },
  numerical: {
    background: 'bg-primary/10',
    text: 'text-primary',
  },
  verbal: {
    background: 'bg-success/10',
    text: 'text-success',
  },
  general: {
    background: 'bg-secondary/10',
    text: 'text-secondary',
  },
  analytical: {
    background: 'bg-amber-100',
    text: 'text-amber-800',
  },
  correct: {
    background: 'bg-success/10',
    text: 'text-success',
  },
  incorrect: {
    background: 'bg-destructive/10',
    text: 'text-destructive',
  },
  resolved: {
    background: 'bg-success/10',
    text: 'text-success',
  },
  score: {
    background: 'bg-indigo-50',
    text: 'text-indigo-800 font-medium',
  },
}

const Chip: React.FC<ChipProps> = ({
  leftIcon,
  rightIcon,
  text,
  className,
  variant = 'default'
}) => {
  const style = variantStyles[variant] || variantStyles.default

    const baseClasses = `inline-flex items-center font-medium gap-2 px-3 py-1 text-[10px] md:text-xs lg:text-sm ${className} ${style.background} ${style.text} rounded-full`
  return (

    <div className={baseClasses}>
      {leftIcon && <span>{leftIcon}</span>}
      {text && <span>{text}</span>}
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  )
}

export default Chip