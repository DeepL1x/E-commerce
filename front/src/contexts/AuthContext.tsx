import { createContext, useState } from "react"
import { postData } from "utils/requests"

const API_URL = import.meta.env.VITE_API_URL

export type User = {
  userId?: number | null
  username?: string | null
  email?: string | null
  isAuthenticated: boolean
  role?: string | null
}

type AuthContextType = {
  user: User
  signUp: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

type AuthContextProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>({
  user: { isAuthenticated: false },
  signUp: (_email: string, _username: string, _password: string) => {
    return Promise.resolve(false)
  },
  signIn: (_email: string, _password: string) => {
    return Promise.resolve(false)
  },
  signOut: () => {},
})

const checkAuth = () => {
  const user = localStorage.getItem("user")
  if (user) {
    if (user) {
      const res = JSON.parse(user)
      res.isAuthenticated = true
      return res
    }
  } else {
    return { isAuthenticated: false }
  }
}

const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>(checkAuth())

  const signUp = async (email: string, username: string, password: string) => {
    const requestBody = { email, username, password }
    return new Promise<boolean>((resolve, _reject) => {
      postData(`${API_URL}/auth/signup`, requestBody)
        .then((response) => {
          if (response) {
            const user: User = response
            localStorage.setItem("user", JSON.stringify(user))
            setUser({ ...user, isAuthenticated: true })
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((error) => {
          console.error(error)
          resolve(false)
        })
    })
  }

  const signIn = async (email: string, password: string) => {
    const requestBody = { email, password }
    return new Promise<boolean>((resolve, _reject) => {
      postData(`${API_URL}/auth/signin`, requestBody)
        .then((response) => {
          if (response) {
            const user: User = response
            localStorage.setItem("user", JSON.stringify(user))
            setUser({ ...user, isAuthenticated: true })
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((error) => {
          console.error(error)
          resolve(false)
        })
    })
  }

  const signOut = () => {
    setUser({
      isAuthenticated: false,
    })
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
