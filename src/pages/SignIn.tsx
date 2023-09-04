import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
export function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  return (
    <div>
      <h1>SignIn</h1>
      <button
        onClick={() => {
          signIn('abiliocoelho@gmail.com', 'secret')
          navigate('/dashboard')
        }}
      >
        Entrar
      </button>
    </div>
  )
}
