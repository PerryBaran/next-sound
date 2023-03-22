import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createContext, useContext } from "react"
import MusicPlayer from "../../src/components/musicPlayer/MusicPlayer"
import * as PlaylistContext from "../../src/context/PlaylistContext"

describe("Playlist", () => {
  const mockPlaylist = [
    {
      image: "/image-1",
      artistName: "artist-1",
      albumName: "album-1",
      songName: "song-1",
      audio: "audio-1",
      key: "key-1"
    },
    {
      artistName: "artist-2",
      albumName: "album-2",
      songName: "song-2",
      audio: "audio-2",
      key: "key-2"
    }
  ]
  let mockSkipSong = jest.fn()
  let mockPlay = jest.fn()

  beforeEach(() => {
    mockSkipSong = jest.fn()
    mockPlay = jest.fn()

    const mockContext = createContext({
      playlist: mockPlaylist,
      playlistIndex: 0,
      skipSong: mockSkipSong,
      handleAddToPlaylist: jest.fn(),
      removeFromPlaylist: jest.fn(),
      playing: false,
      handlePlaying: jest.fn(),
      handleShuffle: jest.fn()
    })

    jest
      .spyOn(PlaylistContext, "usePlaylistContext")
      .mockImplementation(() => useContext(mockContext))
    jest
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(mockPlay)
    jest
      .spyOn(window.HTMLMediaElement.prototype, "pause")
      .mockImplementation(jest.fn())
  })

  test("renders correctly", () => {
    render(<MusicPlayer />)

    expect(screen.getByTestId("audio")).toBeInTheDocument()
    expect(screen.getByAltText(/cover art/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(0)).toBeInstanceOf(HTMLInputElement)
    expect(screen.getAllByText("0:00")).toHaveLength(2)
    expect(screen.getByAltText(/skip backwards/i)).toBeInTheDocument()
    expect(screen.getByAltText(/loop/i)).toBeInTheDocument()
    expect(screen.getByAltText(/shuffle/i)).toBeInTheDocument()
    expect(screen.getByAltText(/volume/i)).toBeInTheDocument()
    expect(screen.getByAltText(/playlist/i)).toBeInTheDocument()
  })

  test("handleVolume", () => {
    render(<MusicPlayer />)
    const volumeInput = screen.getByDisplayValue(50)

    fireEvent.change(volumeInput, { target: { value: 60 } })

    expect(volumeInput).toHaveDisplayValue("60")

    fireEvent.change(volumeInput, { target: { value: 1000 } })

    expect(volumeInput).toHaveDisplayValue("100")

    fireEvent.change(volumeInput, { target: { value: -10 } })

    expect(volumeInput).toHaveDisplayValue("0")
  })

  test("handleLoop", () => {
    render(<MusicPlayer />)
    const loopButton = screen.getByAltText(/loop/i)

    expect(loopButton).toBeInTheDocument()

    fireEvent.click(loopButton)

    expect(loopButton).toHaveAttribute("alt", "loop playlist")

    fireEvent.click(loopButton)

    expect(loopButton).toHaveAttribute("alt", "loop song")
  })

  test("handleSkip", () => {
    render(<MusicPlayer />)
    const skipForwards = screen.getByAltText(/skip forwards/i)
    const loopButton = screen.getByAltText(/loop/i)

    expect(mockPlay).toBeCalledTimes(0)
    expect(mockSkipSong).toBeCalledTimes(0)

    fireEvent.click(skipForwards)

    expect(mockPlay).toBeCalledTimes(0)
    expect(mockSkipSong).toBeCalledTimes(1)
    expect(mockSkipSong).toHaveBeenLastCalledWith(true, false)

    fireEvent.click(loopButton)
    fireEvent.click(skipForwards)

    expect(mockPlay).toBeCalledTimes(0)
    expect(mockSkipSong).toBeCalledTimes(2)
    expect(mockSkipSong).toHaveBeenLastCalledWith(true, true)

    fireEvent.click(loopButton)
    fireEvent.click(skipForwards)

    expect(mockPlay).toBeCalledTimes(1)
    expect(mockSkipSong).toBeCalledTimes(2)
  })

  test("snapshot", () => {
    const { asFragment } = render(<MusicPlayer />)

    expect(asFragment()).toMatchSnapshot()
  })
})
