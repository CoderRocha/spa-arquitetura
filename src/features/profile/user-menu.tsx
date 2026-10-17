import { useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@core/auth-context'
import { profileQuery } from '@core/queries'
import { buttonVariants } from '@ui/button.variants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@ui/dropdown-menu'
import { LogOutIcon, SettingsIcon } from '@ui/icons'
import { Skeleton } from '@ui/skeleton'
import { ProfileAvatar } from '@features/profile/avatar'

export const UserMenu = () => {
  const { t } = useLingui()
  const { signOut } = useAuth()
  const { data: profile } = useQuery(profileQuery())

  if (!profile) return <Skeleton className="size-8 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t`Menu da conta`}
        className={buttonVariants({ variant: 'ghost', className: 'gap-2 px-2' })}
      >
        <ProfileAvatar profile={profile} />
        <span className="hidden text-sm sm:inline">{profile.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{profile.email}</DropdownMenuLabel>
        <DropdownMenuItem render={<Link to="/settings" />}>
          <SettingsIcon />
          {t`Configurações`}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void signOut()
          }}
        >
          <LogOutIcon />
          {t`Sair`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
