import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import Logo from '../assets/logo.png'

const userSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine((email) => {
      return email.endsWith('@gmail.com')
    }, 'O e-mail precisa ser do Google'),
  password: z.string().min(6, 'A senha de no mínimo 6 caracteres'),
})

type UserData = z.infer<typeof userSchema>

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(userSchema),
  })

  const { signIn, isLoadingUserStorageData } = useAuth()

  function createUser(data: UserData) {
    signIn(data.email, data.password)
  }

  return (
    <>
      {!isLoadingUserStorageData && (
        <main className="flex justify-center items-center flex-col gap-7 min-h-screen bg-zinc-950">
          <img src={Logo} alt="Logomarca" className="h-auto max-w-xs" />
          <form
            onSubmit={handleSubmit(createUser)}
            className="flex flex-col gap-3 w-full max-w-xs"
          >
            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 text-xl" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                title="Email"
                placeholder="E-mail"
                id="email"
                className="h-10 px-2 rounded bg-zinc-800 text-zinc-200"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-sm text-red-400">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-300 text-xl" htmlFor="password">
                Senha
              </label>
              <input
                type="password"
                title="Email"
                placeholder="Senha"
                id="password"
                className="h-10 px-2 rounded bg-zinc-800 text-zinc-200"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-sm text-red-400">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              className="h-10 bg-emerald-700 rounded hover:bg-emerald-800 text-zinc-200 font-semibold"
              type="submit"
            >
              Entrar
            </button>
          </form>
        </main>
      )}
    </>
  )
}
