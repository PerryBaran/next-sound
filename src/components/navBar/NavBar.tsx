'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { useUserContext } from '@/context/UserContext'
import css from './navbar.module.css'
import { search } from '@/media/icons'
import Image from 'next/image'

export default function NavBar() {
  const router = useRouter()
  const {
    user: { name }
  } = useUserContext()
  const pathname = usePathname()
  const searchRef = useRef<HTMLInputElement>(null)

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchRef?.current?.value
    if (query) {
      router.push(`search/${query}`)
    }
  }

  return (
    <nav className={css.container}>
      <ul>
        <li>
          <Link href="/">
            <h1>Next-Sound</h1>
          </Link>
        </li>
        <li className={pathname === '/' ? css.active : ''}>
          <Link href="/">Home</Link>
        </li>
        <li>
          <form onSubmit={submitHandler} className={css.search}>
            <input type="text" ref={searchRef} placeholder="Search" />
            <button type="submit">
              <Image src={search} alt="search" height={15} width={15} />
            </button>
          </form>
        </li>
        {name ? (
          <>
            <li className={pathname === `/profile/${name}` ? css.active : ''}>
              <Link href={`/profile/${name}`}>Profile</Link>
            </li>
            <li className={pathname === '/upload' ? css.active : ''}>
              <Link href="/upload">Upload</Link>
            </li>
            <li className={pathname === '/logout' ? css.active : ''}>
              <Link href="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <li className={pathname === '/login' ? css.active : ''}>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
