'use client'

import Link from 'next/link'
import { useUserContext } from '@/context/UserContext'

export default function CondtionalNav() {
  const {
    user: { name }
  } = useUserContext()

  return (
    <>
      {name ? (
        <>
          <li>
            <Link href={`/profile/${name}`}>Profile</Link>
          </li>
          <li>
            <Link href="/upload">Upload</Link>
          </li>
          <li>
            <Link href="/logout">Logout</Link>
          </li>
        </>
      ) : (
        <li>
          <Link href="/login">Login</Link>
        </li>
      )}
    </>
  )
}
