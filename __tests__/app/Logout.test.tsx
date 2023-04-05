import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import LogOut from "../../src/app/logout/page"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"

describe("Logout", () => {
  let mockPush = jest.fn()
  let mockHandleLogin = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(navigation, "useRouter").mockReturnValue({
      back: jest.fn(),
      forward: jest.fn(),
      push: mockPush,
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    })

    mockHandleLogin = jest.fn()
    const mockContext = createContext({
      user: { name: "", id: "" },
      handleLogin: mockHandleLogin
    })
    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  describe("tests", () => {
    beforeEach(() => {
      render(<LogOut />)
    })

    test("renders as expected", () => {
      expect(screen.getByText(/are you sure/i)).toBeInstanceOf(
        HTMLHeadingElement
      )
      expect(screen.getByText(/logout/i)).toBeInstanceOf(HTMLButtonElement)
    })

    test("logout click", () => {
      expect(mockHandleLogin).toBeCalledTimes(0)
      expect(mockPush).toBeCalledTimes(0)

      fireEvent.click(screen.getByText(/logout/i))

      expect(mockHandleLogin).toBeCalledWith()
      expect(mockPush).toBeCalledWith("/")
    })
  })

  test("snapshot", () => {
    const { asFragment } = render(<LogOut />)

    expect(asFragment()).toMatchSnapshot()
  })
})
