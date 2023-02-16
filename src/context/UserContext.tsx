'use client'

import { createContext, useState } from 'react'

interface User {
  name?: string,
  id?: string,
}

interface Context {
  user: User,
  handleLogin: (data: User | undefined) => void,
}

const emptyUser = {
  name: '',
  id: '',
}

const UserContext = createContext<Context>({
  user: emptyUser,
  handleLogin: () => {},
})

export default function UserProvider({ 
  children 
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(emptyUser)

  const handleLogin = (data: User | undefined) => {
    if (data === undefined) {
      setUser(emptyUser);
    } else {
      setUser((prev) => {
        return {...prev, ...data };
      })
    }
  }

  return (
    <UserContext.Provider value={{user, handleLogin}}>
      {children}
    </UserContext.Provider>
  )
}