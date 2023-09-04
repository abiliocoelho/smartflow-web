import { ReactNode, createContext, useEffect, useState } from 'react'
import { UserDTO } from '../dto/UserDTO'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '../storage/UserStorage'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'

type Props = {
  children: ReactNode
}

type AuthProps = {
  user: UserDTO | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

export const AuthContext = createContext({} as AuthProps)

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const navigate = useNavigate()

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      if (userLogged) {
        setUser(userLogged)
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/session', {
        email,
        password,
      })
      setUser(response.data as UserDTO)
      storageUserSave(response.data)
      navigate('/dashboard')
    } catch (error) {}
  }
  async function signOut() {
    setIsLoadingUserStorageData(true)
    storageUserRemove()
    setUser(null)
    setIsLoadingUserStorageData(false)
  }
  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoadingUserStorageData }}
    >
      {children}
    </AuthContext.Provider>
  )
}
