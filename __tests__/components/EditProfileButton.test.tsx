import { render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import EditProfileButton from "../../src/components/editProfileButton/EditProfileButton"
import * as UserContext from "../../src/context/UserContext"

describe("EditProfileButton", () => {
  const props = {
    userId: "user-id"
  }

  beforeEach(() => {
    const mockContext = createContext({
      user: {
        id: props.userId,
        name: "test-name"
      },
      handleLogin: () => {}
    })

    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("if id in context doesn't equal userId, return null", () => {
    const { container } = render(<EditProfileButton userId="different" />)

    expect(container).toBeEmptyDOMElement()
  })

  test("if id in context is equal to userId, renders a link", () => {
    render(<EditProfileButton {...props} />)

    expect(screen.getByText(/edit profile/i)).toHaveAttribute(
      "href",
      "/edit/profile"
    )
  })

  describe("snapshots", () => {
    test("id in context doesn't equal userId", () => {
      const { asFragment } = render(<EditProfileButton userId="different" />)

      expect(asFragment()).toMatchSnapshot()
    })

    test("id in context equals userId", () => {
      const { asFragment } = render(<EditProfileButton {...props} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
