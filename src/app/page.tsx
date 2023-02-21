import { Inter } from '@next/font/google'
import { getAlbums } from '@/requests/albums'
import Album from '@/components/album/Album'
import css from './home.module.css'

const inter = Inter({ subsets: ['latin'] })

export const revalidate = 100

interface Songs {
  name: string
  url: string
  id: string
}

interface Albums {
  User: { name: string; id: string }
  name: string
  url: string
  id: string
  Songs: Songs[]
}

export default async function Home() {
  const albums: Albums[] = await getAlbums(undefined)

  return (
    <main className={css.container}>
      {albums.map((album) => {
        return (
          <Album
            key={album.id}
            artistName={album.User.name}
            albumUserId={album.User.id}
            albumName={album.name}
            albumArt={album.url}
            songs={album.Songs}
            albumId={album.id}
          />
        )
      })}
    </main>
  )
}
