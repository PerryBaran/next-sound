import { fireEvent, render, screen } from "@testing-library/react"
import { createContext, useContext } from "react"
import MediaControls from "../../src/components/musicPlayer/mediaControls/MediaControls"
import * as PlaylistContext from "../../src/context/PlaylistContext"

describe("MediaControls", () => {
  let props = {
    playing: true,
    skipSong: jest.fn()
  }
  let mockHandlePlaying = jest.fn()

  beforeEach(() => {
    props.skipSong = jest.fn()
    mockHandlePlaying = jest.fn()

    const mockContext = createContext({
      playlist: [],
      playlistIndex: 0,
      skipSong: jest.fn(),
      handleAddToPlaylist: jest.fn(),
      removeFromPlaylist: jest.fn(),
      playing: false,
      handlePlaying: mockHandlePlaying,
      handleShuffle: jest.fn()
    })

    jest
      .spyOn(PlaylistContext, "usePlaylistContext")
      .mockImplementation(() => useContext(mockContext))
  })

  test("renders correctly when playing is true", () => {
    render(<MediaControls {...props} />)

    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(screen.getByAltText("skip backwards")).toBeInTheDocument()
    expect(screen.getByAltText("pause")).toBeInTheDocument()
    expect(screen.getByAltText("skip forwards")).toBeInTheDocument()
  })

  test("renders correctly when playing is false", () => {
    render(<MediaControls {...props} playing={false} />)

    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(screen.getByAltText("skip backwards")).toBeInTheDocument()
    expect(screen.getByAltText("play")).toBeInTheDocument()
    expect(screen.getByAltText("skip forwards")).toBeInTheDocument()
  })

  test("skip backwards click", () => {
    render(<MediaControls {...props} />)

    expect(props.skipSong).not.toBeCalled()

    fireEvent.click(screen.getByAltText("skip backwards"))

    expect(props.skipSong).toBeCalledTimes(1)
    expect(props.skipSong).toBeCalledWith(false)
  })

  test("skip forwards click", () => {
    render(<MediaControls {...props} />)

    expect(props.skipSong).not.toBeCalled()

    fireEvent.click(screen.getByAltText("skip forwards"))

    expect(props.skipSong).toBeCalledTimes(1)
    expect(props.skipSong).toBeCalledWith(true)
  })

  test("play click", () => {
    render(<MediaControls {...props} />)

    expect(mockHandlePlaying).toBeCalledTimes(0)

    fireEvent.click(screen.getByAltText("pause"))

    expect(mockHandlePlaying).toBeCalledTimes(1)
  })

  test("pause click", () => {
    render(<MediaControls {...props} playing={false} />)

    expect(mockHandlePlaying).toBeCalledTimes(0)

    fireEvent.click(screen.getByAltText("play"))

    expect(mockHandlePlaying).toBeCalledTimes(1)
  })

  describe("snapshot", () => {
    test("playing is true", () => {
      const { asFragment } = render(<MediaControls {...props} />)

      expect(asFragment()).toMatchSnapshot()
    })

    test("playing is false", () => {
      const { asFragment } = render(
        <MediaControls {...props} playing={false} />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
