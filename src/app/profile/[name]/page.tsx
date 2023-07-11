import { getUsers } from "@/requests/users"
import Album from "@/components/album/Album"
import css from "./profile.module.css"
import User from "@/interfaces/users"
import EditProfileButton from "@/components/editProfileButton/EditProfileButton"

interface Props {
  params: { name: string }
}

export default async function Profile(props: Props) {
  const { name } = props.params

  const [user]: User[] = await getUsers({ name, exact: true })

  return (
    <div className={css["container"]}>
      {!user?.name ? (
        <h2>No User Found</h2>
      ) : (
        <div>
          <h2>{user.name}</h2>
          <EditProfileButton userId={user.id} />
        </div>
      )}
      <div>
        {user?.Albums &&
          user.Albums.map((album) => {
            return (
              <Album
                key={album.id}
                artistName={user.name}
                albumName={album.name}
                albumArt={album.url}
                songs={album.Songs}
                albumId={album.id}
                albumUserId={user.id}
                profile={true}
              />
            )
          })}        
      </div>
    </div>
  )
}
