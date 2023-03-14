"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { useUserContext } from "@/context/UserContext"
import css from "./navbar.module.css"
import { home, login, logout, profile, search, upload } from "@/media/icons"
import Image from "next/image"

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

  const classes = (linkPath: string) => {
    return `${pathname === linkPath ? css.active : ""} ${css.link}`
  }

  return (
    <nav className={css.container}>
      <ul>
        <li>
          <Link href="/">
            <h1>Next-Sound</h1>
          </Link>
        </li>
        <li className={classes("/")}>
          <Link href="/">
            <Image src={home} alt="home" height={30} width={30} />
            <span>Home</span>
          </Link>
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
            <li className={classes(`/profile/${name}`)}>
              <Link href={`/profile/${name}`}>
                <Image src={profile} alt="Profile" height={30} width={30} />
                <span>Profile</span>
              </Link>
            </li>
            <li className={classes("/upload")}>
              <Link href="/upload">
                <Image src={upload} alt="upload" height={30} width={30} />
                <span>Upload</span>
              </Link>
            </li>
            <li className={classes("/logout")}>
              <Link href="/logout">
                <Image src={logout} alt="logout" height={30} width={30} />
                <span>Logout</span>
              </Link>
            </li>
          </>
        ) : (
          <li className={classes("/login")}>
            <Link href="/login">
              <Image src={login} alt="login" height={30} width={30} />
              <span>Login</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
