import { Inter } from "@next/font/google"
import { getAlbums } from "../requests/albums"
import Album from "../components/album/Album"
import Song from "../components/song/Song"
import css from "./home.module.css"
import Albums from "../interfaces/albums"

const inter = Inter({ subsets: ["latin"] })

export const revalidate = 30

export default async function Home() {
  const albums: Albums[] = await getAlbums()

  return (
    <main className={css["container"]}>
      {albums.map((album) => {
        if (album.Songs.length === 1 && album.Songs[0].name === album.name) {
          return (
          <Song 
            key={album.id}
            artistName={album.User.name}
            albumName={album.name}
            albumArt={album.url}
            songName={album.Songs[0].name}
            songAudio={album.Songs[0].url}
          />
          )
        }
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
