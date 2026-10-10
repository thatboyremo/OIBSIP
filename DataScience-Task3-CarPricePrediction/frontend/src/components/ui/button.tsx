import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ' +
  'hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-accent to-accent2 text-white shadow-glow hover:brightness-110 dark:text-slate-950',
  secondary: 'border border-border bg-surface text-fg hover:border-accent/50 hover:bg-surface2',
  ghost: 'text-muted hover:bg-surface2 hover:text-fg',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className)

interface Common { variant?: Variant; size?: Size }

export function Button({ variant, size, className, type = 'button', ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonLink({ variant, size, className, ...props }: Common & LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}
