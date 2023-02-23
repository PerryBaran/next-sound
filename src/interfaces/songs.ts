interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface Album {
  id: string
  name: string
  url: string
  user: User
  createdAt: string
}

export default interface Songs {
  id: string
  name: string
  url: string
  Albums: Album
  AlbumId: string
  createdAt: string
}
