"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { useUserContext } from "../../context/UserContext"
import css from "./navbar.module.css"
import { home, login, logout, profile, search, upload, searchSVG } from "../../media/icons"
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
        <li className={css.heading}>
          <Link href="/">
            <h1>Next-Sound</h1>
          </Link>
        </li>
        <li className={`${classes("/")} ${css.icon}`}>
          <Link href="/">
            <Image src={home} alt="home" height={30} width={30} />
            <span>Home</span>
          </Link>
        </li>
        <li className={css.search}>
          <form
            onSubmit={submitHandler}
            className={css.searchForm}
            aria-label="form"
          >
            <input type="text" ref={searchRef} placeholder="Search" />
            <button type="submit">
              <Image src={searchSVG} alt="search" height={15} width={15} />
            </button>
          </form>
        </li>
        {name ? (
          <>
            <li className={`${classes(`/profile/${name}`)} ${css.icon}`}>
              <Link href={`/profile/${name}`}>
                <Image src={profile} alt="profile" height={30} width={30} />
                <span>profile</span>
              </Link>
            </li>
            <li className={`${classes("/upload")} ${css.icon}`}>
              <Link href="/upload">
                <Image src={upload} alt="upload" height={30} width={30} />
                <span>upload</span>
              </Link>
            </li>
            <li className={`${classes("/logout")} ${css.icon}`}>
              <Link href="/logout">
                <Image src={logout} alt="logout" height={30} width={30} />
                <span>logout</span>
              </Link>
            </li>
          </>
        ) : (
          <li className={`${classes("/login")} ${css.icon}`}>
            <Link href="/login">
              <Image src={login} alt="login" height={30} width={30} />
              <span>login</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
