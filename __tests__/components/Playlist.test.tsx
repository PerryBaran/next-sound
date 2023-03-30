import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import Playlist from "../../src/components/musicPlayer/playlist/Playlist"
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
  let mockRemoveFromPlaylist = jest.fn()
  let mockHandlePlaying = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockSkipSong = jest.fn()
    mockRemoveFromPlaylist = jest.fn()
    mockHandlePlaying = jest.fn()
  })

  describe("playlist not empty", () => {
    beforeEach(() => {
      const mockContext = createContext({
        playlist: mockPlaylist,
        playlistIndex: 0,
        skipSong: mockSkipSong,
        handleAddToPlaylist: jest.fn(),
        removeFromPlaylist: mockRemoveFromPlaylist,
        playing: false,
        handlePlaying: mockHandlePlaying,
        handleShuffle: jest.fn()
      })

      jest
        .spyOn(PlaylistContext, "usePlaylistContext")
        .mockImplementation(() => useContext(mockContext))
    })

    test("renders correctly", () => {
      render(<Playlist />)

      expect(screen.getByRole("button")).toBeInTheDocument()
      expect(screen.getByAltText("playlist")).toBeInTheDocument()
    })

    test("button click renders playlist", () => {
      render(<Playlist />)
      fireEvent.click(screen.getByAltText("playlist"))

      expect(screen.getAllByText(/x/i)).toHaveLength(mockPlaylist.length)
      expect(screen.getAllByAltText(/play now/i)).toHaveLength(
        mockPlaylist.length
      )

      mockPlaylist.forEach((song) => {
        expect(
          screen.getByAltText(`${song.albumName} cover art`)
        ).toBeInTheDocument()
        expect(screen.getByText(song.artistName)).toBeInTheDocument()
        expect(screen.getByText(song.artistName)).toBeInTheDocument()
      })
    })

    test("play now click", () => {
      render(<Playlist />)
      fireEvent.click(screen.getByAltText("playlist"))

      mockPlaylist.forEach((song, i) => {
        fireEvent.click(screen.getAllByAltText("play now")[i])

        expect(mockHandlePlaying).toBeCalledTimes(i + 1)
        expect(mockHandlePlaying).toHaveBeenLastCalledWith(true)
        expect(mockSkipSong).toBeCalledTimes(i + 1)
        expect(mockSkipSong).toHaveBeenLastCalledWith(i)
      })
    })

    test("x click", () => {
      render(<Playlist />)
      fireEvent.click(screen.getByAltText("playlist"))

      mockPlaylist.forEach((song, i) => {
        fireEvent.click(screen.getAllByText("x")[i])

        expect(mockRemoveFromPlaylist).toBeCalledTimes(i + 1)
        expect(mockRemoveFromPlaylist).toHaveBeenLastCalledWith(i)
      })
    })

    test("snapshot", () => {
      const { asFragment } = render(<Playlist />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  test("empty playlist renders correctly", () => {
    const mockContext = createContext({
      playlist: [],
      playlistIndex: 0,
      skipSong: mockSkipSong,
      handleAddToPlaylist: jest.fn(),
      removeFromPlaylist: mockRemoveFromPlaylist,
      playing: false,
      handlePlaying: mockHandlePlaying,
      handleShuffle: jest.fn()
    })

    jest
      .spyOn(PlaylistContext, "usePlaylistContext")
      .mockImplementation(() => useContext(mockContext))

    render(<Playlist />)
    fireEvent.click(screen.getByAltText("playlist"))

    expect(screen.getByText("Playlist Empty")).toBeInTheDocument()
  })
})
