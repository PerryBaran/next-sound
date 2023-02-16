import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  const res = await fetch(`https://soundcloud-clone-api.onrender.com/albums`);
  const data = await res.json();

  return (
    <main>
      <h1>Home</h1>
    </main>
  )
}
