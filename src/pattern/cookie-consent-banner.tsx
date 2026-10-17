import { useLingui } from '@lingui/react/macro'
import { useConsentStore } from '@core/cookies/consent-store'
import { Button } from '@ui/button'

export const CookieConsentBanner = () => {
  const consent = useConsentStore((state) => state.consent)
  const setConsent = useConsentStore((state) => state.setConsent)
  const { t } = useLingui()

  if (consent !== 'pending') return null

  return (
    <section
      aria-label={t`Preferências de cookies`}
      className="fixed bottom-4 left-4 z-40 flex max-w-md flex-col gap-3 rounded-card border border-border bg-surface p-4 text-sm shadow-popup"
    >
      <p className="text-muted">{t`Usamos cookies para entender como a aplicação é usada. Você aceita?`}</p>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setConsent('denied')
          }}
        >
          {t`Recusar`}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setConsent('granted')
          }}
        >
          {t`Aceitar`}
        </Button>
      </div>
    </section>
  )
}
