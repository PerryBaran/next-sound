import { getUsers } from '@/requests/users'
import Album from '@/components/album/Album'
import css from './profile.module.css'

interface Props {
  params: { name: string }
}

interface Songs {
  name: string
  url: string
  id: string
}

interface Albums {
  id: string
  name: string
  url: string
  createdAt: string
  UserId: string
  Songs: Songs[]
}

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  Albums: Albums[]
}

export default async function Profile(props: Props) {
  const { name } = props.params

  const [user]: User[] = await getUsers({ name, exact: true })

  return (
    <div className={css.container}>
      {!user.name ? (
        <h2>No User Found</h2>
      ) : (
        <div>
          <h2>{user.name}</h2>
        </div>
      )}
      {user.Albums && user.Albums.map((album) => {
        return (
          <Album 
            key={album.id}
            artistName={user.name}
            albumName={album.name}
            albumArt={album.url}
            songs={album.Songs}
            albumId={album.id}
            albumUserId={user.id}
          />
        )
      })}
    </div>
  )
}
