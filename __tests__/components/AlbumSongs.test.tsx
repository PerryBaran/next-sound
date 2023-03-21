import { render, screen } from "@testing-library/react"
import AlbumSongs from "../../src/components/album/albumSongs/AlbumSongs"
import * as SongMenu from "../../src/components/songMenu/SongMenu"

describe("AlbumSongs", () => {
  const props = {
    songName: "song-name",
    audio: "song-audio",
    image: "album-image",
    artistName: "artist-name",
    albumName: "albumName"
  }

  const mockedSongMenu = jest.fn()

  jest.spyOn(SongMenu, "default").mockImplementation((props: any) => {
    mockedSongMenu(props)
    return <div />
  })

  test("renders correctly", () => {
    render(<AlbumSongs {...props} />)

    expect(screen.getByRole("listitem")).toBeInTheDocument()
    expect(screen.getByRole("heading")).toHaveTextContent(props.songName)
    expect(mockedSongMenu).toHaveBeenCalledWith({ songs: [props] })
  })

  test("snapshot", () => {
    const { asFragment } = render(<AlbumSongs {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
