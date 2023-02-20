'use client'

import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'

export default function LogOut() {
  const router = useRouter()
  const { handleLogin } = useUserContext()

  const handleLogout = () => {
    handleLogin(undefined)
    router.push('/')
  }

  return (
    <div>
      <h2>Are You Sure?</h2>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}
