import type { ReactNode } from 'react'

type OnboardingLayoutProps = {
  children: ReactNode
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => (
  <div className="flex min-h-dvh flex-col items-center bg-surface-muted/40 px-6 py-12">
    <div className="flex w-full max-w-lg flex-col gap-8">
      <span className="text-lg font-semibold tracking-tight">Workspace</span>
      <main className="rounded-card border border-border bg-surface p-8 shadow-xs">{children}</main>
    </div>
  </div>
)
