import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import UploadAlbum from "../../src/app/upload/page"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"
import * as albumRequests from "../../src/requests/albums"
import * as songRequests from "../../src/requests/songs"

describe("Upload", () => {
  let mockPush = jest.fn()
  const mockName = "mock-name"

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

    const mockContext = createContext({
      user: { name: mockName, id: "" },
      handleLogin: jest.fn()
    })
    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("renders correctly", () => {
    render(<UploadAlbum />)
    const nameInputs = screen.getAllByLabelText(/name/i)

    expect(screen.getByText(/create album/i)).toBeInstanceOf(HTMLHeadingElement)
    expect(nameInputs).toHaveLength(2)
    nameInputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "text")
    })
    expect(screen.getByLabelText(/cover art/i)).toHaveAttribute("type", "file")
    expect(screen.getByText(/upload songs/i)).toBeInstanceOf(HTMLHeadingElement)
    expect(screen.getByText(/song 1/i)).toBeInstanceOf(HTMLHeadingElement)
    expect(screen.getByLabelText(/audio/i)).toHaveAttribute("type", "file")
    expect(screen.getByText(/x/i)).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByText("+")).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByText(/upload album/i)).toHaveAttribute("type", "submit")
  })

  test("remove button", () => {
    render(<UploadAlbum />)

    expect(screen.getAllByLabelText(/name/i)).toHaveLength(2)

    fireEvent.click(screen.getByText(/x/i))

    expect(screen.getAllByLabelText(/name/i)).toHaveLength(1)
  })

  test("add button", () => {
    render(<UploadAlbum />)

    expect(screen.getAllByLabelText(/audio/i)).toHaveLength(1)

    fireEvent.click(screen.getByText("+"))

    expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)
  })

  describe("submit", () => {
    const mockId = "mock-id"
    let postAlbumSpy: jest.SpyInstance
    let postSongsSpy: jest.SpyInstance

    beforeEach(() => {
      postAlbumSpy = jest.spyOn(albumRequests, "postAlbums")
      postSongsSpy = jest.spyOn(songRequests, "postSongs")
    })

    xtest("album doesn't contain a name", () => {
      render(<UploadAlbum />)

      fireEvent.click(screen.getByText(/upload album/i))

      expect(screen.getByText(/must provide a name/i)).toBeInTheDocument()
    })

    xtest("album contains no songs", () => {
      render(<UploadAlbum />)
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: "album-name" }
      })
      fireEvent.click(screen.getByText(/x/i))

      fireEvent.click(screen.getByText(/upload album/i))

      expect(
        screen.getByText(/album must contain atleast one song/i)
      ).toBeInTheDocument()
    })

    xtest("atleast one song doesn't contain a name", () => {
      render(<UploadAlbum />)
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: "album-name" }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      expect(
        screen.getByText(/all songs must contain a name/i)
      ).toBeInTheDocument()
    })

    xtest("atleast one song doesn't contain audio", () => {
      render(<UploadAlbum />)
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: "album-name" }
      })
      fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
        target: { value: "song-name" }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      expect(
        screen.getByText(/all songs must contain audio/i)
      ).toBeInTheDocument()
    })

    test("all data is correct", () => {
      render(<UploadAlbum />)
      postAlbumSpy.mockResolvedValue({ id: mockId })

      const albumName = "album-name"
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: albumName }
      })
      const songData = {
        name: "song-name",
        audio: new File([], "audio"),
        position: 0
      }
      fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
        target: { value: songData.name }
      })
      fireEvent.change(screen.getByLabelText(/audio/i), { target: { files: [songData.audio] }})
    
      fireEvent.click(screen.getByText(/upload album/i))
      
      expect(postAlbumSpy).toBeCalledWith({ name: "album-name" })
      expect(postSongsSpy).toBeCalledWith({ ...songData, AlbumId: mockId})
    })
  })
})
