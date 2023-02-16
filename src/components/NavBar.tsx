import Link from 'next/link';
import SearchBar from './SearchBar';

export default function NavBar() {

  return (
    <nav>
      <ul>
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