import { useLingui } from '@lingui/react/macro'
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  appVersion: string
  children: ReactNode
}

export const AuthLayout = ({ appVersion, children }: AuthLayoutProps) => {
  const { t } = useLingui()
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <span className="text-lg font-semibold tracking-tight">Boilerplate SPA</span>
        <p className="max-w-sm text-3xl leading-tight font-medium text-balance">
          {t`Uma base sólida para construir a sua próxima aplicação.`}
        </p>
        <span className="text-xs opacity-70">v{appVersion}</span>
      </aside>
      <main className="flex items-center justify-center px-4 py-10 sm:p-6">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
