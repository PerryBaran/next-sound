import Link from 'next/link';
import SearchBar from './searchBar/SearchBar';
import css from './navbar.module.css';

export default function NavBar() {

  return (
    <nav className={css.container}>
      <ul>
        <li>
          <Link href="/">
            <h1>Next-Sound</h1>
          </Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <SearchBar />
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  )
}