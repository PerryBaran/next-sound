import uploadAlbum from "../../src/components/uploadAlbumForm/helpers/uploadAlbum"
import * as albumRequests from "../../src/requests/albums"
import * as songRequests from "../../src/requests/songs"

describe("uploadAlbum", () => {
  let postAlbumsSpy: jest.SpyInstance
  let postSongsSpy: jest.SpyInstance
  let mockRouter = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }
  let mockSetAlert = jest.fn()

  const mockName = "user-name"
  const mockId = "album-id"

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockRouter = {
      back: jest.fn(),
      forward: jest.fn(),
      push: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }
    mockSetAlert = jest.fn()

    postAlbumsSpy = jest.spyOn(albumRequests, "postAlbums")
    postSongsSpy = jest.spyOn(songRequests, "postSongs").mockResolvedValue("")
  })

  describe("no errors", () => {
    beforeEach(() => {
      postAlbumsSpy.mockResolvedValue({ id: mockId })
    })

    test("no album name", async () => {
      const album = {
        name: ""
      }
      const songs = [
        {
          name: "song-1-name",
          audio: new File([], "audio-1")
        }
      ]
      await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

      expect(mockSetAlert).toBeCalledWith("Album must have a name")
    })

    test("no songs", async () => {
      const album = {
        name: "album-name"
      }
      const songs: {
        name: string
        audio?: File
      }[] = []
      await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

      expect(mockSetAlert).toBeCalledWith("Album must contain atleast one song")
    })

    test("song has no name", async () => {
      const album = {
        name: "album-name"
      }
      const songs = [
        {
          name: "",
          audio: new File([], "audio-1")
        }
      ]
      await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

      expect(mockSetAlert).toBeCalledWith("All songs must contain a name")
    })

    test("song has no audio", async () => {
      const album = {
        name: "album-name"
      }
      const songs = [
        {
          name: "song-1-name",
          audio: undefined
        }
      ]
      await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

      expect(mockSetAlert).toBeCalledWith("All songs must contain audio")
    })

    test("postAlbums and postSongs", async () => {
      const album = {
        name: "album-name",
        image: new File([], "image")
      }
      const songs = [
        {
          name: "song-1-name",
          audio: new File([], "audio-1")
        }
      ]
      await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

      expect(postAlbumsSpy).toBeCalledWith(album)
      expect(postSongsSpy).toBeCalledWith({
        ...songs[0],
        position: 0,
        AlbumId: mockId
      })
      expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
    })
  })

  test("throws expected error", async () => {
    const error = "error"
    postAlbumsSpy.mockRejectedValue({ message: error })
    const album = {
      name: "album-name"
    }
    const songs = [
      {
        name: "song-1-name",
        audio: new File([], "audio-1")
      }
    ]
    await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

    expect(mockSetAlert).toBeCalledWith(error)
  })

  test("throws unexpected error", async () => {
    postAlbumsSpy.mockRejectedValue("")
    const album = {
      name: "album-name"
    }
    const songs = [
      {
        name: "song-1-name",
        audio: new File([], "audio-1")
      }
    ]
    await uploadAlbum(album, songs, mockSetAlert, mockRouter, mockName)

    expect(mockSetAlert).toBeCalledWith("Unexpected Error")
  })
})
