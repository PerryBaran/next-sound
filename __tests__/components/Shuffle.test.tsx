import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import Shuffle from "../../src/components/musicPlayer/shuffle/Shuffle"
import * as PlaylistContext from "../../src/context/PlaylistContext"

describe("Shuffle", () => {
  let mockHandleShuffle = jest.fn()

  beforeEach(() => {
    mockHandleShuffle = jest.fn()

    const mockContext = createContext({
      playlist: [],
      playlistIndex: 0,
      skipSong: jest.fn(),
      handleAddToPlaylist: jest.fn(),
      removeFromPlaylist: jest.fn(),
      playing: false,
      handlePlaying: jest.fn(),
      handleShuffle: mockHandleShuffle
    })

    jest
      .spyOn(PlaylistContext, "usePlaylistContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("rendes correctly", () => {
    render(<Shuffle />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("shuffle")).toBeInTheDocument()
  })

  test("shuffle click", () => {
    render(<Shuffle />)
    const shuffle = screen.getByAltText("shuffle")

    expect(mockHandleShuffle).toBeCalledTimes(0)

    fireEvent.click(shuffle)

    expect(mockHandleShuffle).toBeCalledTimes(1)
    expect(mockHandleShuffle).toHaveBeenLastCalledWith(true)

    fireEvent.click(shuffle)

    expect(mockHandleShuffle).toBeCalledTimes(2)
    expect(mockHandleShuffle).toHaveBeenLastCalledWith(false)
  })

  test("snapshot", () => {
    const { asFragment } = render(<Shuffle />)

    expect(asFragment()).toMatchSnapshot()
  })
})
