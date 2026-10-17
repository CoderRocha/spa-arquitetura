import { cx } from '@ui/variants'

export type SpinnerProps = {
  label: string
  className?: string
}

export const Spinner = ({ label, className }: SpinnerProps) => (
  <output data-slot="spinner" aria-label={label} className={cx('inline-flex size-5', className)}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-full animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </output>
)

export const Loading = ({ label, className }: SpinnerProps) => (
  <div data-slot="loading" className={cx('flex min-h-40 items-center justify-center text-primary', className)}>
    <Spinner label={label} className="size-6" />
  </div>
)
