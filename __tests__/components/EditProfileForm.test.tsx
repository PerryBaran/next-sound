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
  const mockData = {
    name: "user-name",
    email: "email@email.com"
  }
  let mockHandleLogin = jest.fn()
  const mockUser = {
    name: "user-name",
    id: "user-id"
  }

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
    })
  })
})
