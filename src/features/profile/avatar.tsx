import type { Profile } from '@contracts/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

type ProfileAvatarProps = {
  profile: Pick<Profile, 'name' | 'avatarUrl'>
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export const ProfileAvatar = ({ profile, size, className }: ProfileAvatarProps) => (
  <Avatar size={size} className={className}>
    {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt="" />}
    <AvatarFallback className="bg-primary/15 font-semibold text-primary">{initialsOf(profile.name)}</AvatarFallback>
  </Avatar>
)
