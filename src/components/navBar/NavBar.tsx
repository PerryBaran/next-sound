import Link from 'next/link';
import SearchBar from './searchBar/SearchBar';
import CondtionalNav from './conditionalNav/CondtionalNav';
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
        <CondtionalNav />
      </ul>
    </nav>
  )
}