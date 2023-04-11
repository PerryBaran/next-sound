import { render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import EditProfile from "../../src/app/edit/profile/page"
import * as UserContext from "../../src/context/UserContext"

describe("EditProfile", () => {
  describe("no user", () => {
    beforeEach(() => {
      const mockContext = createContext({
        user: { id: "", name: "" },
        handleLogin: jest.fn()
      })
      jest
        .spyOn(UserContext, "useUserContext")
        .mockImplementation(() => useContext(mockContext))
    })

    test("empty DOM", () => {
      const { container } = render(<EditProfile />)

      expect(container).toBeEmptyDOMElement()
    })

    test("snapshot", () => {
      const { asFragment } = render(<EditProfile />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
