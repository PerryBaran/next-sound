import { render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import EditAlbumButton from "../../src/components/album/EditAlbumButton/EditAlbumButton"
import * as UserContext from "../../src/context/UserContext"

describe("EditButton", () => {
  const props = {
    profile: true,
    albumId: "test-album-id",
    albumUserId: "test-user-id"
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    const mockContext = createContext({
      user: {
        id: props.albumUserId,
        name: "test-name"
      },
      handleLogin: () => {}
    })

    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("returns null if profile is falsey", () => {
    const { container } = render(
      <EditAlbumButton
        profile={false}
        albumId={props.albumId}
        albumUserId={props.albumUserId}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test("returns null if albumUserId doesn't equal the id from userContext", () => {
    const { container } = render(
      <EditAlbumButton profile albumId={props.albumId} albumUserId="fail" />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test("returns a link if profile is truthy and albumUserId is equal to id in userContext", () => {
    render(<EditAlbumButton {...props} />)

    const link = screen.getByRole("link")

    expect(link).toHaveTextContent(/edit album/i)
    expect(link).toHaveAttribute("href", `/edit/album/${props.albumId}`)
  })

  describe("snapshot", () => {
    test("profile is falsey", () => {
      const { asFragment } = render(
        <EditAlbumButton
          profile={false}
          albumId={props.albumId}
          albumUserId={props.albumUserId}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("albumUserId doesn't match user id in userContext", () => {
      const { asFragment } = render(
        <EditAlbumButton profile albumId={props.albumId} albumUserId="fail" />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("profile is truthy and albumuserId matches id in userContext", () => {
      const { asFragment } = render(<EditAlbumButton {...props} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
