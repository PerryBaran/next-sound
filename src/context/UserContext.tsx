'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserById } from '@/requests/users'
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'


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

const useUserContext = () => useContext(UserContext);

function UserProvider({ 
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

  useEffect(() => {
    (async () => {
      const token = Cookie.get("userToken");
      if (!token) return;
      const { id }: { id: number | string } = jwtDecode(token);
      const response = await getUserById(id);
      handleLogin({
        name: response.name,
        id: response.id,
      });
    })();
  }, []);  

  return (
    <UserContext.Provider value={{user, handleLogin}}>
      {children}
    </UserContext.Provider>
  )
}

export { useUserContext, UserProvider};