import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import SongMenu from "../../src/components/songMenu/SongMenu"
import * as PlaylistContext from "../../src/context/PlaylistContext"

describe("SongMenu", () => {
  const props = {
    songs: [
      {
        songName: "song-1",
        audio: "audio-1",
        image: "/image-1",
        artistName: "artist-1",
        albumName: "album-1"
      },
      {
        songName: "song-2",
        audio: "audio-2",
        image: "/image-2",
        artistName: "artist-2",
        albumName: "album-2"
      }
    ]
  }
  let mockHandleAddToPlaylist = jest.fn()

  beforeEach(() => {
    mockHandleAddToPlaylist = jest.fn()
    const mockContext = createContext({
      playlist: [],
      playlistIndex: 0,
      skipSong: jest.fn(),
      handleAddToPlaylist: mockHandleAddToPlaylist,
      removeFromPlaylist: jest.fn(),
      playing: false,
      handlePlaying: jest.fn(),
      handleShuffle: jest.fn()
    })

    jest
      .spyOn(PlaylistContext, "usePlaylistContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("renders correctly", () => {
    render(<SongMenu {...props} />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("...")).toBeInTheDocument()
  })

  test("on button click shows more options, on second click hides options", () => {
    render(<SongMenu {...props} />)

    fireEvent.click(screen.getByAltText("..."))

    expect(screen.getAllByRole("button")).toHaveLength(4)
    expect(screen.getByText(/play now/i)).toBeInTheDocument()
    expect(screen.getByText(/play next/i)).toBeInTheDocument()
    expect(screen.getByText(/add to queue/i)).toBeInTheDocument()

    fireEvent.click(screen.getByAltText("..."))

    expect(screen.getAllByRole("button")).toHaveLength(1)
  })

  test("on container blur hides options", () => {
    render(<SongMenu {...props} />)

    fireEvent.click(screen.getByAltText("..."))

    expect(screen.getAllByRole("button")).toHaveLength(4)

    const container = screen.getByAltText("...").parentElement
    if (!container) throw new Error("missing container")
    fireEvent.blur(container)

    expect(screen.getAllByRole("button")).toHaveLength(1)
  })

  test("play now mouseDown", () => {
    render(<SongMenu {...props} />)

    fireEvent.click(screen.getByAltText("..."))
    fireEvent.mouseDown(screen.getByText(/play now/i))

    expect(mockHandleAddToPlaylist).toBeCalledTimes(1)
    expect(mockHandleAddToPlaylist).toBeCalledWith(props.songs, true, true)
  })

  test("play next mouseDown", () => {
    render(<SongMenu {...props} />)

    fireEvent.click(screen.getByAltText("..."))
    fireEvent.mouseDown(screen.getByText(/play next/i))

    expect(mockHandleAddToPlaylist).toBeCalledTimes(1)
    expect(mockHandleAddToPlaylist).toBeCalledWith(props.songs, true, false)
  })

  test("add to queue mouseDown", () => {
    render(<SongMenu {...props} />)

    fireEvent.click(screen.getByAltText("..."))
    fireEvent.mouseDown(screen.getByText(/add to queue/i))

    expect(mockHandleAddToPlaylist).toBeCalledTimes(1)
    expect(mockHandleAddToPlaylist).toBeCalledWith(props.songs, false, false)
  })

  test("snapshot", () => {
    const { asFragment } = render(<SongMenu {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
