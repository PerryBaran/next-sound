import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import {
  PlaylistProvider,
  usePlaylistContext
} from "../../src/context/PlaylistContext"

const Test = ({
  skipForwards = true,
  loop = true,
  songs = [],
  addNext = false,
  playNow = false,
  play
}: {
  skipForwards?: boolean
  loop?: boolean
  songs?: {
    image?: string
    artistName: string
    albumName: string
    songName: string
    audio: string
  }[]
  addNext?: boolean
  playNow?: boolean
  play?: boolean
}) => {
  const {
    playlist,
    playlistIndex,
    playing,
    skipSong,
    handleAddToPlaylist,
    removeFromPlaylist,
    handlePlaying,
    handleShuffle
  } = usePlaylistContext()
  const [shuffled, setShuffled] = useState(false)

  const shuffle = () => {
    handleShuffle(!shuffled)
    setShuffled((prev) => !prev)
  }

  return (
    <div>
      <p>playlist index: {playlistIndex}</p>
      <p>{playing ? "playing" : "paused"}</p>
      <p>playlist length: {playlist.length}</p>
      <div>
        {playlist.map((song, i) => {
          return (
            <div key={song.key}>
              <p>
                song {i}: {song.songName}
              </p>
              <button onClick={() => skipSong(i)}>skipSong - {i}</button>
              <button onClick={() => removeFromPlaylist(i)}>
                removeFromPlaylist - {i}
              </button>
            </div>
          )
        })}
      </div>
      <button onClick={() => skipSong(skipForwards, loop)}>
        skipSong - forwards
      </button>
      <button onClick={() => handleAddToPlaylist(songs, addNext, playNow)}>
        handleAddToPlaylist
      </button>
      <button onClick={() => handlePlaying(play)}>handlePlaying</button>
      <button onClick={() => shuffle()}>handleShuffle</button>
    </div>
  )
}

describe("PlaylistContext", () => {
  const songs = [
    {
      image: "image-1",
      artistName: "artist-name-1",
      albumName: "album-name-1",
      songName: "song-name-1",
      audio: "audio-1"
    },
    {
      image: "image-2",
      artistName: "artist-name-2",
      albumName: "album-name-2",
      songName: "song-name-2",
      audio: "audio-2"
    }
  ]

  test("playlist is empty, playIndex is 0 and playing is false by default", () => {
    render(
      <PlaylistProvider>
        <Test />
      </PlaylistProvider>
    )

    expect(screen.getByText(/playlist index/)).toHaveTextContent(
      "playlist index: 0"
    )
    expect(screen.getByText(/paused/)).toBeInTheDocument()
    expect(screen.getByText(/playlist length/)).toHaveTextContent(
      "playlist length: 0"
    )
  })

  test("handlePlaying click undefined", () => {
    render(
      <PlaylistProvider>
        <Test />
      </PlaylistProvider>
    )
    const handlePlaying = screen.getByText(/handlePlaying/)
    fireEvent.click(handlePlaying)

    expect(screen.getByText(/playing/)).toBeInTheDocument()

    fireEvent.click(handlePlaying)

    expect(screen.getByText(/paused/)).toBeInTheDocument()
  })

  test("handlePlaying click play = true", () => {
    render(
      <PlaylistProvider>
        <Test play />
      </PlaylistProvider>
    )
    const handlePlaying = screen.getByText(/handlePlaying/)
    fireEvent.click(handlePlaying)

    expect(screen.getByText(/playing/)).toBeInTheDocument()

    fireEvent.click(handlePlaying)

    expect(screen.getByText(/playing/)).toBeInTheDocument()
  })

  test("handlePlaying click play = false", () => {
    render(
      <PlaylistProvider>
        <Test play={false} />
      </PlaylistProvider>
    )
    const handlePlaying = screen.getByText(/handlePlaying/)
    fireEvent.click(handlePlaying)

    expect(screen.getByText(/pause/)).toBeInTheDocument()
  })

  test("handleAddToPlaylist, playNow = false, addNext = false", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} playNow={false} addNext={false} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)

    let songsDOM = screen.getAllByText(/song/)

    expect(songsDOM).toHaveLength(songs.length)
    songsDOM.forEach((_, i) => {
      expect(
        screen.getByText(`song ${i}: ${songs[i].songName}`)
      ).toBeInTheDocument()
    })

    fireEvent.click(handleAddToPlaylist)
    songsDOM = screen.getAllByText(/song/)

    expect(songsDOM).toHaveLength(songs.length * 2)
    songsDOM.forEach((_, i) => {
      expect(
        screen.getByText(`song ${i}: ${songs[i > 1 ? i - 2 : i].songName}`)
      ).toBeInTheDocument()
    })
  })

  test("handleAddToPlaylist, playNow = false, addNext = true", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} playNow={false} addNext={true} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)

    let songsDOM = screen.getAllByText(/song/)

    expect(songsDOM).toHaveLength(songs.length)
    songsDOM.forEach((_, i) => {
      expect(
        screen.getByText(`song ${i}: ${songs[i].songName}`)
      ).toBeInTheDocument()
    })

    fireEvent.click(handleAddToPlaylist)
    songsDOM = screen.getAllByText(/song/)

    expect(songsDOM).toHaveLength(songs.length * 2)
    expect(screen.getByText(`song 0: ${songs[0].songName}`)).toBeInTheDocument()
    expect(screen.getByText(`song 1: ${songs[0].songName}`)).toBeInTheDocument()
  })

  test("handleAddToPlaylist, playNow = true", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} playNow={true} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText(/playing/)).toBeInTheDocument()
  })

  test("removeFromPlaylist", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} />
      </PlaylistProvider>
    )
    fireEvent.click(screen.getByText(/handleAddToPlaylist/))

    expect(
      screen.getByText(`playlist length: ${songs.length}`)
    ).toBeInTheDocument()
    expect(screen.getByText(`song 0: ${songs[0].songName}`)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/removeFromPlaylist - 0/))

    expect(
      screen.getByText(`playlist length: ${songs.length - 1}`)
    ).toBeInTheDocument()
    expect(screen.getByText(`song 0: ${songs[1].songName}`)).toBeInTheDocument()
  })

  test("handleShuffle shuffles and unshuffled array", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} />
      </PlaylistProvider>
    )
    fireEvent.click(screen.getByText(/handleAddToPlaylist/))

    jest.spyOn(Math, "random").mockImplementationOnce(() => {
      return 0
    })
    jest.spyOn(Math, "random").mockImplementationOnce(() => {
      return 0
    })

    const shuffle = screen.getByText(/handleShuffle/)
    fireEvent.click(shuffle)

    expect(screen.getByText(`song 1: ${songs[0].songName}`)).toBeInTheDocument()

    fireEvent.click(shuffle)

    expect(screen.getByText(`song 0: ${songs[0].songName}`)).toBeInTheDocument()
  })

  test("skipSong, skipForwards = true, loop = false", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} loop={false} skipForwards />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText(`playlist index: 0`)).toBeInTheDocument()

    const skipSong = screen.getByText("skipSong - forwards")
    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 1")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 2")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 3")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 3")).toBeInTheDocument()
  })

  test("skipSong, skipForwards = true, loop = true", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} loop skipForwards />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()

    const skipSong = screen.getByText("skipSong - forwards")
    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 1")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 2")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 3")).toBeInTheDocument()

    fireEvent.click(skipSong)

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()
  })

  test("skipSong, skipForwards = false, loop = false", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} loop={false} skipForwards={false} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()

    fireEvent.click(screen.getByText("skipSong - forwards"))

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()
  })

  test("skipSong, skipForwards = false, loop = true", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} loop skipForwards={false} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()

    fireEvent.click(screen.getByText("skipSong - forwards"))

    expect(screen.getByText("playlist index: 1")).toBeInTheDocument()
  })

  test("skipSong to index", () => {
    render(
      <PlaylistProvider>
        <Test songs={songs} />
      </PlaylistProvider>
    )
    const handleAddToPlaylist = screen.getByText(/handleAddToPlaylist/)
    fireEvent.click(handleAddToPlaylist)
    fireEvent.click(handleAddToPlaylist)

    expect(screen.getByText("playlist index: 0")).toBeInTheDocument()

    const skipTo = 3
    fireEvent.click(screen.getByText(`skipSong - ${skipTo}`))

    expect(screen.getByText(`playlist index: ${skipTo}`)).toBeInTheDocument()
  })
})
