'use client'

import { createContext, useState } from 'react'

interface User {
  name?: string,
  id?: string,
}

const emptyUser = {
  name: '',
  id: '',
}

const UserContext = createContext({
  user: emptyUser,
  handleLogin: (data: User | undefined) => {},
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