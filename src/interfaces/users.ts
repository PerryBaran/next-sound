interface Songs {
  name: string
  url: string
  id: string
  createdAt: string
}

interface Albums {
  id: string
  name: string
  url: string
  UserId: string
  Songs: Songs[]
  createdAt: string
}

export default interface Users {
  id: string
  name: string
  email: string
  Albums: Albums[]
  createdAt: string
}
