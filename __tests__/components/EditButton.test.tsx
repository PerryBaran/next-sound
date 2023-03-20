import { render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import EditButton from "../../src/components/album/EditButton/EditButton"
import * as userContext from "../../src/context/UserContext"

describe("EditButton", () => {
  const props = {
    profile: true,
    albumId: "test-album-id",
    albumUserId: "test-user-id"
  }

  beforeEach(() => {
    const mockContext = createContext({
      user: {
        id: props.albumUserId,
        name: "test-name"
      },
      handleLogin: () => {}
    })
    jest
      .spyOn(userContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("returns null if profile is falsey", () => {
    const { container } = render(
      <EditButton
        profile={false}
        albumId={props.albumId}
        albumUserId={props.albumUserId}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test("returns null if albumUserId doesn't equal the id from userContext", () => {
    const { container } = render(
      <EditButton profile albumId={props.albumId} albumUserId="fail" />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test("returns a link if profile is truthy and albumUserId is equal to id in userContext", () => {
    render(<EditButton {...props} />)

    const link = screen.getByRole("link")

    expect(link).toHaveTextContent(/edit album/i)
    expect(link).toHaveAttribute("href", `/edit/album/${props.albumId}`)
  })

  describe("snapshot", () => {
    test("profile is falsey", () => {
      const { asFragment } = render(
        <EditButton
          profile={false}
          albumId={props.albumId}
          albumUserId={props.albumUserId}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("albumUserId doesn't match user id in userContext", () => {
      const { asFragment } = render(
        <EditButton profile albumId={props.albumId} albumUserId="fail" />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("profile is truthy and albumuserId matches id in userContext", () => {
      const { asFragment } = render(<EditButton {...props} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
