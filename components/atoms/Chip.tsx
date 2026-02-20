import { ChipProps } from '@/lib/types'
import React from 'react'

 const variantStyles = {
  default: {
    background: '',
    text: '',
  },
  numerical: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
  },
  verbal: {
    background: 'bg-green-100',
    text: 'text-green-800',
  },
  general: {
    background: 'bg-purple-100',
    text: 'text-purple-800',
  },
  analytical: {
    background: 'bg-amber-100', // or orange-100 / yellow-100
    text: 'text-amber-800',
  },
  correct: {
    background: 'bg-emerald-100',
    text: 'text-emerald-800 font-medium',
  },
  resolved: {
    background: 'bg-cyan-100',
    text: 'text-cyan-800 font-medium',
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

    const baseClasses = `inline-flex items-center gap-2 px-3 py-1 text-xs md:text-sm lg:text-base ${className} ${style.background} ${style.text} rounded-full`
  return (

    <div className={baseClasses}>
      {leftIcon && <span>{leftIcon}</span>}
      {text && <span>{text}</span>}
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  )
}

export default Chip