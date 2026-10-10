import { motion } from 'framer-motion'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-border bg-surface shadow-soft', className)} {...props} />
}

/** Card with subtle hover elevation and accent border glow. */
export function HoverCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group rounded-xl border border-border bg-surface shadow-soft transition-[border-color,box-shadow] duration-300',
        'hover:border-accent/50 hover:shadow-glow',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
