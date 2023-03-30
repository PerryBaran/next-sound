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
  let AlbumSongSpy: jest.SpyInstance
  let SongMenuSpy: jest.SpyInstance
  let EditAlbumButtonSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    AlbumSongSpy = jest.spyOn(AlbumSongs, "default").mockReturnValue(<div />)
    SongMenuSpy = jest.spyOn(SongMenu, "default").mockReturnValue(<div />)
    EditAlbumButtonSpy = jest
      .spyOn(EditAlbumButton, "default")
      .mockReturnValue(<div />)
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
    expect(screen.getByText(props.albumName)).toBeInTheDocument()
    expect(screen.getByRole("list")).toBeInTheDocument()

    expect(SongMenuSpy).toBeCalledTimes(1)
    expect(EditAlbumButtonSpy).toBeCalledTimes(1)
    expect(AlbumSongSpy).toBeCalledTimes(props.songs.length)
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
