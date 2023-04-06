import updateAlbum from "../../src/components/uploadAlbumForm/helpers/updateAlbum"
import * as albumRequests from "../../src/requests/albums"
import * as songRequests from "../../src/requests/songs"

describe("updateAlbum", () => {
  let patchAlbumSpy: jest.SpyInstance
  let patchSongSpy: jest.SpyInstance
  let deleteSongSpy: jest.SpyInstance
  let postSongSpy: jest.SpyInstance
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
  const mockData = {
    name: "album-data-name",
    id: "album-id"
  }

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

    patchAlbumSpy = jest.spyOn(albumRequests, "patchAlbum")
    patchSongSpy = jest.spyOn(songRequests, "patchSong").mockResolvedValue("")
    deleteSongSpy = jest.spyOn(songRequests, "deleteSong").mockResolvedValue("")
    postSongSpy = jest.spyOn(songRequests, "postSongs").mockResolvedValue("")
  })

  describe("no errors", () => {
    beforeEach(() => {
      patchAlbumSpy.mockResolvedValue("")
    })

    test("no album name", async () => {
      const mockAlbum = {
        name: "",
        id: mockData.id
      }
      const mockSongs = [
        {
          current: {
            name: "song-1-name"
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        },
        {
          current: {
            name: "song-2-name",
            audio: new File([], "audio")
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(mockSetAlert).toBeCalledWith("Album must have a name")
    })

    test("update song doesn't have a name", async () => {
      const mockAlbum = {
        name: "album-name",
        id: mockData.id
      }
      const mockSongs = [
        {
          current: {
            name: ""
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        },
        {
          current: {
            name: "song-2-name",
            audio: new File([], "audio")
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(mockSetAlert).toBeCalledWith("All songs must have a name")
    })

    test("post song doesn't have a name", async () => {
      const mockAlbum = {
        name: "album-name",
        id: mockData.id
      }
      const mockSongs = [
        {
          current: {
            name: "song-1-name"
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        },
        {
          current: {
            name: "",
            audio: new File([], "audio")
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(mockSetAlert).toBeCalledWith("All songs must have a name")
    })

    test("post song doesn't have audio", async () => {
      const mockAlbum = {
        name: "album-name",
        id: mockData.id
      }
      const mockSongs = [
        {
          current: {
            name: "song-1-name"
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        },
        {
          current: {
            name: "song-2-name",
            audio: undefined
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(mockSetAlert).toBeCalledWith("All songs must have audio")
    })

    test("patchAlbum", async () => {
      const mockAlbum = {
        name: "album-name",
        image: new File([], "image"),
        id: mockData.id
      }
      const mockSongs = [
        {
          current: {
            name: "song-1-name"
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(patchAlbumSpy).toBeCalledWith(mockData.id, {
        name: mockAlbum.name,
        image: mockAlbum.image
      })
      expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
    })

    test("deleteSong", async () => {
      const mockAlbum = mockData
      const mockSongs = [
        {
          current: {
            name: "song-1-name",
            delete: true
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        },
        {
          current: {
            name: "song-2-name"
          },
          original: {
            name: "song-2-name",
            position: 1,
            id: "song-2-id"
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(deleteSongSpy).toBeCalledWith(mockSongs[0].original.id)
      expect(patchSongSpy).toBeCalledWith(mockSongs[1].original.id, {
        position: 0
      })
      expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
    })

    test("patchSong", async () => {
      const mockAlbum = mockData
      const mockSongs = [
        {
          current: {
            name: "song-1-new-name",
            audio: new File([], "audio")
          },
          original: {
            name: "song-1-name",
            position: 0,
            id: "song-1-id"
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(patchSongSpy).toBeCalledWith(
        mockSongs[0].original.id,
        mockSongs[0].current
      )
      expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
    })

    test("postSongs", async () => {
      const mockAlbum = mockData
      const mockSongs = [
        {
          current: {
            name: "song-1-name",
            audio: new File([], "audio")
          }
        }
      ]
      await updateAlbum(
        mockData,
        mockAlbum,
        mockSongs,
        mockSetAlert,
        mockRouter,
        mockName
      )

      expect(postSongSpy).toBeCalledWith({
        ...mockSongs[0].current,
        position: 0,
        AlbumId: mockData.id
      })
      expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
    })
  })

  test("expected error thrown", async () => {
    const error = "error"
    patchAlbumSpy.mockRejectedValue({ message: error })
    const mockAlbum = {
      name: "album-name",
      id: mockData.id
    }
    const mockSongs = [
      {
        current: {
          name: "song-1-name"
        },
        original: {
          name: "song-1-name",
          position: 0,
          id: "song-1-id"
        }
      }
    ]
    await updateAlbum(
      mockData,
      mockAlbum,
      mockSongs,
      mockSetAlert,
      mockRouter,
      mockName
    )

    expect(mockSetAlert).toBeCalledWith(error)
  })

  test("unexpected error thrown", async () => {
    patchAlbumSpy.mockRejectedValue("")
    const mockAlbum = {
      name: "album-name",
      id: mockData.id
    }
    const mockSongs = [
      {
        current: {
          name: "song-1-name"
        },
        original: {
          name: "song-1-name",
          position: 0,
          id: "song-1-id"
        }
      }
    ]
    await updateAlbum(
      mockData,
      mockAlbum,
      mockSongs,
      mockSetAlert,
      mockRouter,
      mockName
    )

    expect(mockSetAlert).toBeCalledWith("Unexpected Error")
  })
})
