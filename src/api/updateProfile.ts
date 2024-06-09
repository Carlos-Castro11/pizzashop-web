import { api } from '@/lib/axios'

interface UpdateProfileBody {
  name: string
  description: string | null
}

export async function UpdateProfileFn({
  description,
  name,
}: UpdateProfileBody) {
  await api.put('/profile', { description, name })
}
