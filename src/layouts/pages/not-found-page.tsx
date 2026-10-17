import { useLingui } from '@lingui/react/macro'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@ui/button.variants'

export const NotFoundPage = () => {
  const { t } = useLingui()
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t`Página não encontrada`}</h1>
      <p className="max-w-sm text-muted">{t`O endereço acessado não existe ou foi movido.`}</p>
      <Link to="/" className={buttonVariants({ variant: 'secondary' })}>
        {t`Voltar ao início`}
      </Link>
    </main>
  )
}
