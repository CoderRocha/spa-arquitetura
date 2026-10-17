import type { ReactNode } from 'react'
import { Card, CardContent } from '@ui/card'

type OnboardingLayoutProps = {
  children: ReactNode
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => (
  <div className="flex min-h-svh flex-col items-center bg-muted/40 px-4 py-10 sm:px-6 sm:py-12">
    <div className="flex w-full max-w-lg flex-col gap-8">
      <span className="text-lg font-semibold tracking-tight">Workspace</span>
      <main>
        <Card>
          <CardContent className="sm:p-4">{children}</CardContent>
        </Card>
      </main>
    </div>
  </div>
)
