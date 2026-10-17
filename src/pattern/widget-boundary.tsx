import { useLingui } from '@lingui/react/macro'
import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from '@tanstack/react-query'
import { CatchBoundary, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { Suspense, type ReactNode } from 'react'
import { isFriendlyError } from '@core/http-resource'
import { Alert, AlertDescription, AlertTitle } from '@ui/alert'
import { Button } from '@ui/button'
import { Loading } from '@ui/loading'

export const PendingFallback = () => {
  const { t } = useLingui()
  return <Loading label={t`Carregando`} />
}

export const ErrorFallback = ({ error, reset }: ErrorComponentProps) => {
  const { t } = useLingui()
  const router = useRouter()
  const { reset: resetQueries } = useQueryErrorResetBoundary()
  const title = isFriendlyError(error) ? error.title : t`Algo deu errado`
  const detail = isFriendlyError(error) ? error.detail : t`Não foi possível carregar este conteúdo.`

  return (
    <Alert tone="danger">
      <AlertTitle>{title}</AlertTitle>
      {detail && <AlertDescription>{detail}</AlertDescription>}
      <div className="mt-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            resetQueries()
            reset()
            void router.invalidate()
          }}
        >
          {t`Tentar novamente`}
        </Button>
      </div>
    </Alert>
  )
}

type WidgetBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

export const WidgetBoundary = ({ fallback, children }: WidgetBoundaryProps) => (
  <QueryErrorResetBoundary>
    <CatchBoundary getResetKey={() => 'widget'} errorComponent={ErrorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </CatchBoundary>
  </QueryErrorResetBoundary>
)
