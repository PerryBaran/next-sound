import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

    render(<UploadAlbum />)
  })

  test("renders correctly", () => {
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
    expect(screen.getAllByLabelText(/name/i)).toHaveLength(2)

    fireEvent.click(screen.getByText(/x/i))

    expect(screen.getAllByLabelText(/name/i)).toHaveLength(1)
  })

  test("add button", () => {
    expect(screen.getAllByLabelText(/audio/i)).toHaveLength(1)

    fireEvent.click(screen.getByText("+"))

    expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)
  })

  test("drag and drop", () => {
    fireEvent.click(screen.getByText("+"))

    const name = "name"
    fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
      target: { value: name }
    })

    fireEvent.dragEnter(screen.getAllByLabelText(/name/i)[2])
    fireEvent.dragEnd(screen.getAllByLabelText(/name/i)[1])

    expect(screen.getAllByLabelText(/name/i)[2]).toHaveValue(name)
  })

  describe("submit", () => {
    const mockId = "mock-id"
    let postAlbumSpy: jest.SpyInstance
    let postSongsSpy: jest.SpyInstance

    beforeEach(() => {
      postAlbumSpy = jest.spyOn(albumRequests, "postAlbums")
      postSongsSpy = jest.spyOn(songRequests, "postSongs").mockResolvedValue("")
    })

    test("album doesn't contain a name", () => {
      fireEvent.click(screen.getByText(/upload album/i))

      expect(screen.getByText(/must provide a name/i)).toBeInTheDocument()
    })

    test("album contains no songs", () => {
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: "album-name" }
      })
      fireEvent.click(screen.getByText(/x/i))

      fireEvent.click(screen.getByText(/upload album/i))

      expect(
        screen.getByText(/album must contain atleast one song/i)
      ).toBeInTheDocument()
    })

    test("atleast one song doesn't contain a name", () => {
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: "album-name" }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      expect(
        screen.getByText(/all songs must contain a name/i)
      ).toBeInTheDocument()
    })

    test("atleast one song doesn't contain audio", () => {
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

    test("all data is correct", async () => {
      postAlbumSpy.mockResolvedValue({ id: mockId })

      const albumData = {
        name: "album-name"
      }
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: albumData.name }
      })

      const songData = {
        name: "song-name",
        audio: new File([], "audio"),
        position: 0
      }
      fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
        target: { value: songData.name }
      })
      fireEvent.change(screen.getByLabelText(/audio/i), {
        target: { files: [songData.audio] }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      await waitFor(() => {
        expect(postAlbumSpy).toBeCalledWith(albumData)
        expect(postSongsSpy).toBeCalledWith({ ...songData, AlbumId: mockId })
        expect(mockPush).toBeCalledWith(`profile/${mockName}`)
      })
    })

    test("accepts optional image", async () => {
      postAlbumSpy.mockResolvedValue({ id: mockId })

      const albumData = {
        name: "album-name",
        image: new File([], "image")
      }
      fireEvent.change(screen.getAllByLabelText(/name/i)[0], {
        target: { value: albumData.name }
      })
      fireEvent.change(screen.getByLabelText(/cover art/i), {
        target: { files: [albumData.image] }
      })

      const songData = {
        name: "song-name",
        audio: new File([], "audio"),
        position: 0
      }
      fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
        target: { value: songData.name }
      })
      fireEvent.change(screen.getByLabelText(/audio/i), {
        target: { files: [songData.audio] }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      await waitFor(() => {
        expect(postAlbumSpy).toBeCalledWith(albumData)
        expect(postSongsSpy).toBeCalledWith({ ...songData, AlbumId: mockId })
        expect(mockPush).toBeCalledWith(`profile/${mockName}`)
      })
    })

    test("request throws expected error", async () => {
      const error = "error"
      postAlbumSpy.mockRejectedValue({ message: error })

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
      fireEvent.change(screen.getByLabelText(/audio/i), {
        target: { files: [songData.audio] }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      await waitFor(() => {
        expect(screen.getByText(error)).toBeInTheDocument()
      })
    })

    test("request throws unexpected error", async () => {
      postAlbumSpy.mockRejectedValue("")

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
      fireEvent.change(screen.getByLabelText(/audio/i), {
        target: { files: [songData.audio] }
      })

      fireEvent.click(screen.getByText(/upload album/i))

      await waitFor(() => {
        expect(screen.getByText("Unexpected Error")).toBeInTheDocument()
      })
    })
  })
})
