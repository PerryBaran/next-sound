import { getAlbums } from "@/requests/albums"
import { getSongs } from "@/requests/songs"
import { getUsers } from "@/requests/users"
import Albums from "@/interfaces/albums"
import Users from "@/interfaces/users"
import Songs from "@/interfaces/songs"
import Song from "@/components/song/Song"
import Album from "@/components/album/Album"
import Artist from "@/components/artist/Artist"

interface Props {
  params: { search: string }
}

export default async function Search(props: Props) {
  const { search } = props.params

  const albums: Albums[] = await getAlbums({ name: search })
  const songs: Songs[] = await getSongs({ name: search })
  const artists: Users[] = await getUsers({ name: search })

  const searchResults: any = [...albums, ...songs, ...artists].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )

  return (
    <div>
      {searchResults.length === 0 ? (
        <h2>{"No results"}</h2>
      ) : (
        searchResults.map((data: any) => {
          if (data.AlbumId) {
            return (
              <Song
                artistName={data.Album.User.name}
                albumName={data.Album.name}
                albumArt={data.Album.url}
                songName={data.name}
                songAudio={data.url}
                key={`${data.id}${data.name}`}
              />
            )
          }
          if (data.UserId) {
            return (
              <Album
                artistName={data.User.name}
                albumName={data.name}
                albumArt={data.url}
                songs={data.Songs}
                albumUserId={data.User.id}
                key={`${data.id}${data.name}`}
                albumId={data.id}
                profile={false}
              />
            )
          }
          if (data.email) {
            return (
              <Artist
                name={data.name}
                image={data.Albums[0]?.url}
                key={`${data.id}${data.name}`}
              />
            )
          }
          return null
        })
      )}
    </div>
  )
}
