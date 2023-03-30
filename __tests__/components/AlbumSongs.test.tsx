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
  let SongMenuSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    SongMenuSpy = jest.spyOn(SongMenu, "default").mockReturnValue(<div />)
  })

  test("renders correctly", () => {
    render(<AlbumSongs {...props} />)

    expect(screen.getByRole("listitem")).toBeInTheDocument()
    expect(screen.getByRole("heading")).toHaveTextContent(props.songName)
    expect(SongMenuSpy).toHaveBeenCalledTimes(1)
  })

  test("snapshot", () => {
    const { asFragment } = render(<AlbumSongs {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
