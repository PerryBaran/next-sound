import { render, screen } from "@testing-library/react"
import Song from "../../src/components/song/Song"
import * as SongMenu from "../../src/components/songMenu/SongMenu"

describe("Song", () => {
  const props = {
    artistName: "artist-name",
    albumName: "album-name",
    albumArt: "/album-art",
    songName: "song-name",
    songAudio: "song-audio"
  }

  const mockedSongMenu = jest.fn()

  jest.spyOn(SongMenu, "default").mockImplementation((props: any) => {
    mockedSongMenu(props)
    return <div />
  })

  test("renders correctly", () => {
    render(<Song {...props} />)

    expect(screen.getByAltText(`${props.albumName} cover art`)).toHaveAttribute("src", `/_next/image?url=%2F${props.albumArt.substring(
      1,
      props.albumArt.length
    )}&w=256&q=75`)
    expect(screen.getByText(props.artistName)).toHaveAttribute("href", `/profile/${props.artistName}`)
    expect(screen.getByText(props.songName)).toBeInTheDocument()
    expect(mockedSongMenu).toBeCalledTimes(1)
    expect(mockedSongMenu).toBeCalledWith({ songs: [{
      songName: props.songName,
      audio: props.songAudio,
      image: props.albumArt,
      artistName: props.artistName,
      albumName: props.albumName
    }]})
  })

  test("snapshot", () => {
    const { asFragment } = render(<Song {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})