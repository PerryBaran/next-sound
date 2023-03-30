import {
  postSongs,
  getSongs,
  patchSong,
  deleteSong
} from "../../src/requests/songs"
import * as requestHelpers from "../../src/requests/helpers/requestHelpers"

describe("songs requests", () => {
  const mockData = {
    name: "name",
    audio: new File([], "audio"),
    position: 1,
    AlbumId: "album-id"
  }
  const mockId = "test-id"
  const mockResolve = "resolve"

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("postSongs calls postRequest and returns response", async () => {
    const postSpy = jest
      .spyOn(requestHelpers, "postRequest")
      .mockResolvedValue(mockResolve)

    const response = await postSongs(mockData)

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith("songs", mockData)
    expect(response).toEqual(mockResolve)
  })

  test("getSongs calls getRequest and returns response", async () => {
    const getSpy = jest
      .spyOn(requestHelpers, "getRequest")
      .mockResolvedValue(mockResolve)

    const mockQuery = {
      name: "name",
      exact: true,
      limit: 50
    }
    const response = await getSongs(mockQuery)

    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(getSpy).toHaveBeenCalledWith("songs", mockQuery)
    expect(response).toEqual(mockResolve)
  })

  test("patchSongs calls patchRequest and returns response", async () => {
    const patchSpy = jest
      .spyOn(requestHelpers, "patchRequest")
      .mockResolvedValue(mockResolve)

    const response = await patchSong(mockId, mockData)

    expect(patchSpy).toHaveBeenCalledTimes(1)
    expect(patchSpy).toHaveBeenCalledWith("songs", mockId, mockData)
    expect(response).toEqual(mockResolve)
  })

  test("deleteSongs calls deleteRequest and returns response", async () => {
    const deleteSpy = jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockResolvedValue(mockResolve)

    const response = await deleteSong(mockId)

    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith("songs", mockId)
    expect(response).toEqual(mockResolve)
  })
})
