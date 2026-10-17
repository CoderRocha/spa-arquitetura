import { useLingui } from '@lingui/react/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { cn } from 'cn'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import * as v from 'valibot'
import { profileQuery } from '@core/queries'
import { buttonVariants } from '@ui/button'
import { Spinner } from '@ui/spinner'
import { ProfileAvatar } from '@features/profile/avatar'
import { useUploadAvatar } from '@features/profile/hooks'
import { avatarFileSchema } from '@features/profile/schemas'

export const AvatarUpload = () => {
  const { t } = useLingui()
  const inputId = useId()
  const { data: profile } = useSuspenseQuery(profileQuery())
  const upload = useUploadAvatar()
  const [validationError, setValidationError] = useState<string | null>(null)
  const error = validationError ?? upload.error?.title

  return (
    <div className="flex items-center gap-4">
      <ProfileAvatar profile={profile} className="size-16 text-lg" />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={buttonVariants({ variant: 'outline', className: 'w-fit cursor-pointer has-disabled:opacity-50' })}
        >
          {upload.isPending && <Spinner aria-label={t`Enviando`} />}
          {t`Trocar foto`}
          <input
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            disabled={upload.isPending}
            onChange={(event) => {
              const result = v.safeParse(avatarFileSchema, event.currentTarget.files?.[0])
              event.currentTarget.value = ''
              setValidationError(result.success ? null : result.issues[0].message)
              if (result.success) {
                upload.mutate(result.output, {
                  onSuccess: () => toast.success(t`Foto atualizada`),
                })
              }
            }}
          />
        </label>
        <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')} role={error ? 'alert' : undefined}>
          {error ?? t`PNG, JPG ou WebP com até 2 MB.`}
        </p>
      </div>
    </div>
  )
}
