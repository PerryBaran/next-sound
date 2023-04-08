import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createContext, useContext } from "react"
import Login from "../../src/app/login/page"
import * as userRequests from "../../src/requests/users"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"

describe("SignUp", () => {
  let loginSpy: jest.SpyInstance
  let mockPush = jest.fn()
  let mockHandleLogin = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockPush = jest.fn()
    jest.spyOn(navigation, "useRouter").mockReturnValue({
      back: jest.fn(),
      forward: jest.fn(),
      push: mockPush,
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    })

    loginSpy = jest.spyOn(userRequests, "login")

    mockHandleLogin = jest.fn()
    const mockContext = createContext({
      user: { name: "", id: "" },
      handleLogin: mockHandleLogin
    })
    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  describe("no errors", () => {
    const mockUser = {
      name: "name",
      id: "id"
    }

    beforeEach(() => {
      loginSpy.mockResolvedValue(mockUser)

      render(<Login />)
    })

    test("renders correctly", () => {
      expect(screen.getAllByText(/login/i)[0]).toBeInstanceOf(
        HTMLHeadingElement
      )
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "text")
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        "type",
        "password"
      )
      expect(screen.getAllByText(/login/i)[1]).toHaveAttribute("type", "submit")
      expect(screen.getByText(/don't have an account\n?/i)).toBeInTheDocument()
      expect(screen.getByText(/signup here/i)).toHaveAttribute(
        "href",
        "/signup"
      )
    })

    test("handleSubmit - no email provided", () => {
      fireEvent.click(screen.getAllByText(/login/i)[1])

      expect(
        screen.getByText(/please provide your email address/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - no password provided", () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email" }
      })
      fireEvent.click(screen.getAllByText(/login/i)[1])

      expect(
        screen.getByText(/please provide your password/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - invalid email provided", () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email" }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "12345678" }
      })
      fireEvent.click(screen.getAllByText(/login/i)[1])

      expect(
        screen.getByText(/please provide a valid email/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - successfull", async () => {
      const mockData = {
        email: "email@email.com",
        password: "12345678"
      }
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockData.email }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockData.password }
      })
      fireEvent.click(screen.getAllByText(/login/i)[1])

      await waitFor(() => {
        expect(loginSpy).toBeCalledWith(mockData)
        expect(mockHandleLogin).toBeCalledWith(mockUser)
        expect(mockPush).toBeCalledWith(`profile/${mockUser.name}`)
      })
    })
  })

  describe("errors", () => {
    beforeEach(() => {
      render(<Login />)
    })

    test("handleSubmit throws expected error", async () => {
      const error = "error"
      loginSpy.mockRejectedValue({ message: error })

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email@email.com" }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "12345678" }
      })
      fireEvent.click(screen.getAllByText(/login/i)[1])

      await waitFor(() => {
        expect(screen.getByText(error)).toBeInTheDocument()
      })
    })

    test("handleSubmit throws unexpected error", async () => {
      loginSpy.mockRejectedValue("")

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email@email.com" }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "12345678" }
      })
      fireEvent.click(screen.getAllByText(/login/i)[1])

      await waitFor(() => {
        expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
      })
    })
  })

  test("snapshot", () => {
    const { asFragment } = render(<Login />)

    expect(asFragment()).toMatchSnapshot()
  })
})
