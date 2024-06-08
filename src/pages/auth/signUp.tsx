import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { RegisterRestaurantFn } from '@/api/registerRestaurant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Constants } from '@/constants'

const signUpForm = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>()

  const { mutateAsync: registerRestaurant } = useMutation({
    mutationFn: RegisterRestaurantFn,
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerRestaurant({
        restaurantName: data.restaurantName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
      })
      toast.success(Constants.MESSAGES.SIGN_UP_SUCCESS, {
        action: {
          label: 'Login',
          onClick: () =>
            navigate(`${Constants.URLS.SIGN_IN}?email=${data.email}`),
        },
      })
    } catch (err) {
      toast.error(Constants.MESSAGES.SIGN_UP_ERROR)
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <Button variant="outline" asChild className="absolute right-8 top-8">
          <Link className="" to={Constants.URLS.SIGN_IN}>
            Fazer Login
          </Link>
        </Button>
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece suas vendas!
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-3">
            <div className="">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input
                id="restaurantName"
                type="text"
                {...register('restaurantName')}
              />
            </div>

            <div className="">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                id="managerName"
                type="text"
                {...register('managerName')}
              />
            </div>

            <div className="">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="">
              <Label htmlFor="phone">Seu celular</Label>
              <Input
                className="mb-2"
                id="phone"
                type="tell"
                {...register('phone')}
              />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Cadastro
            </Button>
            <p className="whitespace-nowrap p-1 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos <br />
              <a href="" className="underline underline-offset-4">
                termos de serviço
              </a>{' '}
              e{' '}
              <a href="" className="underline underline-offset-4">
                políticas de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
