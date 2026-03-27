import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300'
  
  const variants = {
    default: 'border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
    secondary: 'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700',
    outline: 'text-zinc-950 border-zinc-200 dark:border-zinc-800 dark:text-zinc-50',
    success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  )
}

export { Badge }
