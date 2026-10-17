import { useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { useAuth } from '@core/auth-context'
import { profileQuery } from '@core/queries'
import { buttonVariants } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
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
        className={buttonVariants({ variant: 'ghost', size: 'lg', className: 'gap-2 px-1.5' })}
      >
        <ProfileAvatar profile={profile} size="sm" />
        <span className="hidden max-w-40 truncate sm:inline">{profile.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{profile.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link to="/settings" />}>
          <SettingsIcon />
          {t`Configurações`}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
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
