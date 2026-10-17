import type { Profile } from '@core/api/profile'
import { cx } from '@ui/variants'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

type ProfileAvatarProps = {
  profile: Pick<Profile, 'name' | 'avatarUrl'>
  className?: string
}

export const ProfileAvatar = ({ profile, className }: ProfileAvatarProps) => (
  <span
    className={cx(
      'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-semibold text-primary',
      className,
    )}
  >
    {profile.avatarUrl ? (
      <img src={profile.avatarUrl} alt="" className="size-full object-cover" />
    ) : (
      initialsOf(profile.name)
    )}
  </span>
)
