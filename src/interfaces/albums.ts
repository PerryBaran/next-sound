interface Songs {
  name: string
  url: string
  id: string
  createdAt: string
}

interface Users {
  name: string
  id: string
  createdAt: string
}

export default interface Albums {
  name: string
  url: string
  id: string
  User: Users
  Songs: Songs[]
  UserId: string
  createdAt: string
}
