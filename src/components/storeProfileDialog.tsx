import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  GetManagedRestaurant,
  GetManagedRestaurantResponse,
} from '@/api/getManagedRestaurant'
import { UpdateProfileFn } from '@/api/updateProfile'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const StoreProfileDialogSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
})

type StoreProfileDialogFormType = z.infer<typeof StoreProfileDialogSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  const { data: managedRestaurant } = useQuery({
    queryFn: GetManagedRestaurant,
    queryKey: ['managed-restaurant'],
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileDialogFormType>({
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
    resolver: zodResolver(StoreProfileDialogSchema),
  })

  function updateManagedRestaurantCache({
    name,
    description,
  }: StoreProfileDialogFormType) {
    const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
      'managed-restaurant',
    ])

    if (cached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        {
          ...cached,
          name,
          description,
        },
      )
    }

    return { cached }
  }

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: UpdateProfileFn,
    onMutate({ name, description }) {
      const { cached } = updateManagedRestaurantCache({ name, description })

      return { previusProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previusProfile) {
        updateManagedRestaurantCache(context.previusProfile)
      }
    },
  })

  async function handleUpdateProfile(data: StoreProfileDialogFormType) {
    try {
      await updateProfile({ name: data.name, description: data.description })
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Falha ao atualizar o perfil, tente novamente!')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
