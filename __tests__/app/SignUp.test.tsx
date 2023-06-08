import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createContext, useContext } from "react"
import SignUp from "../../src/app/signup/page"
import * as userRequests from "../../src/requests/users"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"

describe("SignUp", () => {
  let signupSpy: jest.SpyInstance
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

    signupSpy = jest.spyOn(userRequests, "signup")

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
      signupSpy.mockResolvedValue(mockUser)

      render(<SignUp />)
    })

    test("renders correctly", () => {
      expect(screen.getByLabelText(/username/i)).toHaveAttribute("type", "text")
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "text")
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
        "type",
        "password"
      )
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
        "type",
        "password"
      )
      expect(screen.getByText(/signup/i)).toHaveAttribute("type", "submit")
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
      expect(screen.getByText(/login here/i)).toHaveAttribute("href", "/login")
    })

    test("handleSubmit - no username", () => {
      fireEvent.click(screen.getByText(/signup/i))

      expect(screen.getByText(/please provide a username/i)).toBeInTheDocument()
    })

    test("handleSubmit - no email", () => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "user-name" }
      })
      fireEvent.click(screen.getByText(/signup/i))

      expect(
        screen.getByText(/please provide your email address/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - invalid email", () => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "user-name" }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email" }
      })
      fireEvent.click(screen.getByText(/signup/i))

      expect(
        screen.getByText(/please provide a valid email/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - no password", () => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "user-name" }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email@mail.com" }
      })
      fireEvent.click(screen.getByText(/signup/i))

      expect(
        screen.getByText(/please insert your password/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - passwords less than 8 characters long", () => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "user-name" }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email@mail.com" }
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: "1234567" }
      })
      fireEvent.click(screen.getByText(/signup/i))

      expect(
        screen.getByText(/password must be atleast 8 characters long/i)
      ).toBeInTheDocument()
    })

    test("handleSubmit - passwords don't match", () => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "user-name" }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "email@mail.com" }
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: "12345678" }
      })
      fireEvent.click(screen.getByText(/signup/i))

      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument()
    })

    test("handleSubmit - success", async () => {
      const mockData = {
        name: mockUser.name,
        email: "email@email.com",
        password: "12345678"
      }
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: mockData.name }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockData.email }
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: mockData.password }
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: mockData.password }
      })
      fireEvent.click(screen.getByText(/signup/i))
    })
  })

  describe("errors", () => {
    beforeEach(() => {
      render(<SignUp />)
    })

    test("handleSubmit throws expected error", async () => {
      const error = "error"
      signupSpy.mockRejectedValue({ message: error })
      const mockData = {
        name: "user-name",
        email: "email@email.com",
        password: "12345678"
      }
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: mockData.name }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockData.email }
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: mockData.password }
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: mockData.password }
      })
      fireEvent.click(screen.getByText(/signup/i))

      await waitFor(() => {
        expect(screen.getByText(error)).toBeInTheDocument()
      })
    })

    test("handleSubmit throws unexpected error", async () => {
      signupSpy.mockRejectedValue("")
      const mockData = {
        name: "user-name",
        email: "email@email.com",
        password: "12345678"
      }
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: mockData.name }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockData.email }
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: mockData.password }
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: mockData.password }
      })
      fireEvent.click(screen.getByText(/signup/i))

      await waitFor(() => {
        expect(screen.getByText(/unexpected Error/i)).toBeInTheDocument()
      })
    })
  })

  test("snapshot", () => {
    const { asFragment } = render(<SignUp />)

    expect(asFragment()).toMatchSnapshot()
  })
})
