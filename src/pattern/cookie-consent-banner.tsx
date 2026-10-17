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
      className="fixed inset-x-4 bottom-4 z-40 flex flex-col gap-3 rounded-xl border bg-popover p-4 text-sm text-popover-foreground shadow-lg sm:right-auto sm:max-w-md"
    >
      <p className="text-muted-foreground">{t`Usamos cookies para entender como a aplicação é usada. Você aceita?`}</p>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setConsent('denied')
          }}
        >
          {t`Recusar`}
        </Button>
        <Button
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
