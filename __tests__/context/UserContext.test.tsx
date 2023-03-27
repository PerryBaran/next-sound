import { fireEvent, render, screen, waitFor, act } from "@testing-library/react"
import { UserProvider, useUserContext } from "../../src/context/UserContext"
import * as userRequests from "../../src/requests/users"
import Cookie from "js-cookie"

const Test = ({ data }: { data?: { name?: string, id?: string }}) => {
  const { user, handleLogin } = useUserContext()

  return (
    <div>
      <p>{user.name || "no-name"}</p>
      <p>{user.id || "no-id"}</p>
      <button onClick={() => handleLogin(data)}>click</button>
    </div>
  )
}

//has to be mocked before describe block or it doesn't work
let mockJwtDecode = jest.fn()
const mockData = {
  name: "name",
  id: "id"
}
jest.mock('jwt-decode', () => (value: any) => {
  mockJwtDecode(value)
  return mockData
});

describe("UserContext", () => {
  let mockCookie = jest.fn()
  let mockGetUserById = jest.fn()
  const token = { token: "token" }
  
  beforeEach(() => {
    mockCookie = jest.fn()
    mockJwtDecode = jest.fn()
    mockGetUserById = jest.fn()

    jest.spyOn(Cookie, "get").mockImplementation(() => {
      mockCookie()
      return token
    })
    jest.spyOn(userRequests, "getUserById").mockImplementation((data: string) => {
      mockGetUserById(data)
      return Promise.resolve(mockData)
    })
  })

  test("gets cookie, decodes it and stores that value in state on start", async () => {
    render(<UserProvider><Test/></UserProvider>)

    await waitFor(() => {
      expect(mockJwtDecode).toBeCalledTimes(1)
      expect(mockJwtDecode).toBeCalledWith(token)
      expect(mockGetUserById).toBeCalledTimes(1)
      expect(mockGetUserById).toBeCalledWith(mockData.id)      
      expect(screen.getByText(mockData.name)).toBeInTheDocument()
      expect(screen.getByText(mockData.id)).toBeInTheDocument()
    })
  })

  test("handleLogin with data", async () => {
    const mockLogin = { name: "mock-name", id: "mock-id"}
    await waitFor(() => render(<UserProvider><Test data={mockLogin}/></UserProvider>))

    fireEvent.click(screen.getByText("click"))
    
    expect(screen.getByText(mockLogin.name)).toBeInTheDocument()
    expect(screen.getByText(mockLogin.id)).toBeInTheDocument()
  })

  test("handleLogin with undefined data", async () => {
    await waitFor(() => render(<UserProvider><Test/></UserProvider>))

    fireEvent.click(screen.getByText("click"))

    expect(screen.getByText("no-name")).toBeInTheDocument()
    expect(screen.getByText("no-id")).toBeInTheDocument()
  })
})