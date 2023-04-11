import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createContext, useContext } from "react"
import EditProfileForm from "../../src/components/editProfileForm/EditProfileForm"
import * as userRequests from "../../src/requests/users"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"

describe("EditProfile", () => {
  let deleteUserSpy: jest.SpyInstance
  let patchUserSpy: jest.SpyInstance
  let mockPush = jest.fn()
  let mockBack = jest.fn()
  const mockData = {
    name: "user-name",
    email: "email@email.com"
  }
  let mockHandleLogin = jest.fn()
  const mockUser = {
    name: mockData.name,
    id: "user-id"
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockPush = jest.fn()
    mockBack = jest.fn()
    jest.spyOn(navigation, "useRouter").mockReturnValue({
      back: mockBack,
      forward: jest.fn(),
      push: mockPush,
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    })

    deleteUserSpy = jest.spyOn(userRequests, "deleteUser").mockResolvedValue("")
    patchUserSpy = jest.spyOn(userRequests, "patchUser")

    mockHandleLogin = jest.fn()
    const mockContext = createContext({
      user: mockUser,
      handleLogin: mockHandleLogin
    })
    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  describe("tests", () => {
    beforeEach(() => {
      render(<EditProfileForm data={mockData} userId={mockUser.id} />)
    })

    test("renders correctly", () => {
      expect(screen.getByText(/edit profile/i)).toBeInstanceOf(
        HTMLHeadingElement
      )
      expect(screen.getByLabelText(/name/i)).toHaveAttribute("type", "text")
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "text")
      expect(screen.getByLabelText(/^new password$/i)).toHaveAttribute(
        "type",
        "password"
      )
      expect(screen.getByLabelText(/confirm new password/i)).toHaveAttribute(
        "type",
        "password"
      )
      expect(screen.getByText(/save changes/i)).toHaveAttribute(
        "type",
        "submit"
      )
      expect(screen.getByText(/delete account/i)).toHaveAttribute(
        "type",
        "button"
      )
      expect(screen.getByText(/cancel/i)).toHaveAttribute("type", "button")
    })

    test("cancel button", () => {
      expect(mockBack).toBeCalledTimes(0)

      fireEvent.click(screen.getByText(/cancel/i))
      fireEvent.click(screen.getByText(/yes/i))

      expect(mockBack).toBeCalledTimes(1)
    })

    test("delete button", async () => {
      expect(deleteUserSpy).toBeCalledTimes(0)
      expect(mockHandleLogin).toBeCalledTimes(0)
      expect(mockPush).toBeCalledTimes(0)

      const password = "password"

      fireEvent.click(screen.getByText(/delete account/i))
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: password }
      })
      fireEvent.click(screen.getByText(/^confirm$/i))

      await waitFor(() => {
        expect(deleteUserSpy).toBeCalledWith(mockUser.id, password)
        expect(mockHandleLogin).toBeCalledWith()
        expect(mockPush).toBeCalledWith("/")
      })
    })

    describe("submit button", () => {
      test("no changes", () => {
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        expect(screen.getByText(/no changes requested/i)).toBeInTheDocument()
      })

      test("empty name", () => {
        fireEvent.change(screen.getByLabelText(/name/i), {
          target: { value: "" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        expect(screen.getByText(/name cannot be empty/i)).toBeInTheDocument()
      })

      test("invalid email", () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: "1234" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        expect(screen.getByText(/email must be valid/i)).toBeInTheDocument()
      })

      test("password too short", () => {
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
          target: { value: "1234" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        expect(
          screen.getByText(/Password must be atleast 8 characters long/i)
        ).toBeInTheDocument()
      })

      test("new passwords don't match", () => {
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
          target: { value: "12345678" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })

      test("succesfully updates", async () => {
        const data = {
          name: "new-name",
          email: "new-email@email.com",
          password: "new-password"
        }
        patchUserSpy.mockResolvedValue(data)

        expect(patchUserSpy).toBeCalledTimes(0)
        expect(mockHandleLogin).toBeCalledTimes(0)
        expect(mockPush).toBeCalledTimes(0)

        fireEvent.change(screen.getByLabelText(/name/i), {
          target: { value: data.name }
        })
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: data.email }
        })
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
          target: { value: data.password }
        })
        fireEvent.change(screen.getByLabelText(/confirm new password/i), {
          target: { value: data.password }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        await waitFor(() => {
          expect(patchUserSpy).toBeCalledWith(mockUser.id, data)
          expect(mockHandleLogin).toBeCalledWith({ name: data.name })
          expect(mockPush).toBeCalledWith(`/profile/${data.name}`)
        })
      })

      test("throws expected error", async () => {
        const error = "error"
        patchUserSpy.mockRejectedValue({ message: error })

        fireEvent.change(screen.getByLabelText(/name/i), {
          target: { value: "new-name" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        await waitFor(() => {
          expect(screen.getByText(error)).toBeInTheDocument()
        })
      })

      test("throws unexpected error", async () => {
        patchUserSpy.mockRejectedValue("")

        fireEvent.change(screen.getByLabelText(/name/i), {
          target: { value: "new-name" }
        })
        fireEvent.click(screen.getByText(/save changes/i))
        fireEvent.click(screen.getByText(/yes/i))

        await waitFor(() => {
          expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
        })
      })
    })
  })

  test("snapshot", () => {
    const { asFragment } = render(
      <EditProfileForm data={mockData} userId={mockUser.id} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
