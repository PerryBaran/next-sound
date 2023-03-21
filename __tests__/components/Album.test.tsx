import { render, screen } from "@testing-library/react"
import Album from "../../src/components/album/Album"
import * as AlbumSongs from "../../src/components/album/albumSongs/AlbumSongs"
import * as SongMenu from "../../src/components/songMenu/SongMenu"
import * as EditAlbumButton from "../../src/components/album/EditAlbumButton/EditAlbumButton"

describe("Album", () => {
  const props = {
    artistName: "artist-name",
    albumName: "album-name",
    albumArt: "/album-art",
    songs: [
      {
        name: "song-name-1",
        url: "audio-1",
        id: "song-id-1"
      },
      {
        name: "song-name-2",
        url: "audio-2",
        id: "song-id-2"
      }
    ],
    albumUserId: "album-user-id",
    albumId: "album-id",
    profile: true
  }

  let mockedAlbumSongs = jest.fn()
  let mockedSongMenu = jest.fn()
  let mockedEditAlbumButton = jest.fn()

  jest.spyOn(SongMenu, "default").mockImplementation((props: any) => {
    mockedSongMenu(props)
    return <div />
  })

  jest.spyOn(AlbumSongs, "default").mockImplementation((props: any) => {
    mockedAlbumSongs(props)
    return <div />
  })

  jest.spyOn(EditAlbumButton, "default").mockImplementation((props: any) => {
    mockedEditAlbumButton(props)
    return <div />
  })

  test("if songs array length is 0 and profile is false, returns null", () => {
    const { container } = render(
      <Album
        artistName={props.artistName}
        albumName={props.albumName}
        albumArt={props.albumArt}
        songs={[]}
        albumUserId={props.albumUserId}
        albumId={props.albumId}
        profile={false}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test("renders correctly", () => {
    render(<Album {...props} />)

    expect(screen.getByAltText(`${props.albumName} cover art`)).toHaveAttribute(
      "src",
      `/_next/image?url=%2F${props.albumArt.substring(
        1,
        props.albumArt.length
      )}&w=256&q=75`
    )
    expect(screen.getByText(props.artistName)).toHaveAttribute(
      "href",
      `/profile/${props.artistName}`
    )
    expect(screen.getByText(props.albumName)).toBeTruthy()
    expect(screen.getByRole("list")).toBeTruthy()

    expect(mockedSongMenu).toBeCalledWith({ songs: props.songs.map((song) => {
      return {
        songName: song.name,
        audio: song.url,
        image: props.albumArt,
        artistName: props.artistName,
        albumName: props.albumName
      }
    })})
    expect(mockedEditAlbumButton).toBeCalledWith({
      albumId: props.albumId,
      albumUserId: props.albumUserId,
      profile: props.profile
    })
    expect(mockedAlbumSongs).toBeCalledTimes(props.songs.length)
    props.songs.forEach((song) => {
      expect(mockedAlbumSongs).toHaveBeenCalledWith({
        songName: song.name,
        audio: song.url,
        image: props.albumArt,
        artistName: props.artistName,
        albumName: props.albumName
      })
    })
  })

  describe("snapshots", () => {
    test("if songs array length is 0 and profile is false", () => {
      const { asFragment } = render(
        <Album
          artistName={props.artistName}
          albumName={props.albumName}
          albumArt={props.albumArt}
          songs={[]}
          albumUserId={props.albumUserId}
          albumId={props.albumId}
          profile={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("if songs array length is greater than 0 and profile is truthy", () => {
      const { asFragment } = render(<Album {...props} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
