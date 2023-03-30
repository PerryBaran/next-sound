import { Inter } from "@next/font/google"
import { getAlbums } from "../requests/albums"
import Album from "../components/album/Album"
import css from "./home.module.css"
import Albums from "../interfaces/albums"

const inter = Inter({ subsets: ["latin"] })

export const revalidate = 30

export default async function Home() {
  const albums: Albums[] = await getAlbums()

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
            profile={false}
          />
        )
      })}
    </main>
  )
}
