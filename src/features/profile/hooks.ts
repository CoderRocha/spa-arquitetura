import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, uploadAvatar, type Profile } from '@core/api/profile'
import { profileQuery } from '@core/queries'

const useSetProfile = () => {
  const queryClient = useQueryClient()
  return (profile: Profile) => {
    queryClient.setQueryData(profileQuery().queryKey, profile)
  }
}

export const useUpdateProfile = () => {
  const setProfile = useSetProfile()
  return useMutation({ mutationFn: updateProfile, onSuccess: setProfile })
}

export const useUploadAvatar = () => {
  const setProfile = useSetProfile()
  return useMutation({ mutationFn: uploadAvatar, onSuccess: setProfile })
}
