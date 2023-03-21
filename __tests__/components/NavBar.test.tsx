import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import * as navigation from "next/navigation"
import NavBar from "../../src/components/navBar/NavBar"
import * as userContext from "../../src/context/UserContext"

describe("NavBar", () => {
  let mockNav = {
    back: jest.fn(),
    forward: jest.fn(),
    reset: jest.fn(),
    push: jest.fn(),
    pull: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }

  beforeEach(() => {
    mockNav = {
      back: jest.fn(),
      forward: jest.fn(),
      reset: jest.fn(),
      push: jest.fn(),
      pull: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }

    jest.spyOn(navigation, "useRouter").mockImplementation(() => mockNav)
  })

  describe("user logged out", () => {
    beforeEach(() => {
      const mockContext = createContext({
        user: {
          id: "",
          name: ""
        },
        handleLogin: () => {}
      })

      jest
        .spyOn(userContext, "useUserContext")
        .mockImplementation(() => useContext(mockContext))
    })

    test("renders correctly", () => {
      render(<NavBar />)

      expect(screen.getByRole("navigation")).toBeInTheDocument()
      expect(screen.getByRole("list")).toBeInTheDocument()
      expect(screen.getAllByRole("listitem")).toHaveLength(4)

      const heading = screen.getByRole("heading")
      expect(heading).toHaveTextContent(/next-sound/i)
      expect(heading.parentElement).toHaveAttribute("href", "/")

      const home = screen.getByText(/home/i)
      expect(home.parentElement).toHaveAttribute("href", "/")
      expect(home.previousSibling).toHaveAttribute("alt", "home")

      const formButton = screen.getByRole("button")
      expect(screen.getByRole("form")).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search/i)).toHaveAttribute(
        "type",
        "text"
      )
      expect(formButton).toHaveAttribute("type", "submit")
      expect(formButton.firstChild).toHaveAttribute("alt", "search")

      const login = screen.getByText(/login/i)
      expect(login.parentElement).toHaveAttribute("href", "/login")
      expect(login.previousSibling).toHaveAttribute("alt", "login")
    })

    test("search functionality", () => {
      render(<NavBar />)

      expect(mockNav.push).toBeCalledTimes(0)

      const search = "search text"
      fireEvent.change(screen.getByPlaceholderText(/search/i), {
        target: { value: search }
      })
      fireEvent.click(screen.getByRole("button"))

      expect(mockNav.push).toBeCalledTimes(1)
      expect(mockNav.push).toBeCalledWith(`search/${search}`)
    })

    test("snapshot", () => {
      const { asFragment } = render(<NavBar />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe("user logged in", () => {
    const userName = "test-name"

    beforeEach(() => {
      const mockContext = createContext({
        user: {
          id: "test-id",
          name: userName
        },
        handleLogin: () => {}
      })

      jest
        .spyOn(userContext, "useUserContext")
        .mockImplementation(() => useContext(mockContext))
    })

    test("renders correctly", () => {
      render(<NavBar />)

      expect(screen.getByRole("navigation")).toBeInTheDocument()
      expect(screen.getByRole("list")).toBeInTheDocument()
      expect(screen.getAllByRole("listitem")).toHaveLength(6)

      const heading = screen.getByRole("heading")
      expect(heading).toHaveTextContent(/next-sound/i)
      expect(heading.parentElement).toHaveAttribute("href", "/")

      const home = screen.getByText(/home/i)
      expect(home.parentElement).toHaveAttribute("href", "/")
      expect(home.previousSibling).toHaveAttribute("alt", "home")

      const formButton = screen.getByRole("button")
      expect(screen.getByRole("form")).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search/i)).toHaveAttribute(
        "type",
        "text"
      )
      expect(formButton).toHaveAttribute("type", "submit")
      expect(formButton.firstChild).toHaveAttribute("alt", "search")

      const profile = screen.getByText(/profile/i)
      expect(profile.parentElement).toHaveAttribute(
        "href",
        `/profile/${userName}`
      )
      expect(profile.previousSibling).toHaveAttribute("alt", "profile")

      const upload = screen.getByText(/upload/i)
      expect(upload.parentElement).toHaveAttribute("href", "/upload")
      expect(upload.previousSibling).toHaveAttribute("alt", "upload")

      const logout = screen.getByText(/logout/i)
      expect(logout.parentElement).toHaveAttribute("href", "/logout")
      expect(logout.previousSibling).toHaveAttribute("alt", "logout")
    })

    test("snapshot", () => {
      const { asFragment } = render(<NavBar />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
