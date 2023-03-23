import {
  postSongs,
  getSongs,
  patchSong,
  deleteSong
} from "../../src/requests/songs"
import * as requestHelpers from "../../src/requests/helpers"

describe("albums requests", () => {
  const mockData = {
    name: "name",
    audio: new File([], "audii"),
    position: 1,
    AlbumId: "album-id"
  }
  const mockId = "test-id"
  let mockRequest = jest.fn()
  const resolve = "resolve"

  beforeEach(() => mockRequest = jest.fn())

  test("postSongs calls postRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "postRequest")
      .mockImplementation((string: any, data: any) => {
        mockRequest(string, data)
        return Promise.resolve(resolve)
      })

    const response = await postSongs(mockData)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("songs", mockData)
    expect(response).toEqual(resolve)
  })
  
  test("getSongs calls getRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "getRequest")
      .mockImplementation((string: any, query: any) => {
        mockRequest(string, query)
        return Promise.resolve(resolve)
      })

    const mockQuery = {
      name: "name",
      exact: true,
      limit: 50
    }
    const response = await getSongs(mockQuery)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("songs", mockQuery)
    expect(response).toEqual(resolve)
  })

  test("patchSongs calls patchRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "patchRequest")
      .mockImplementation((string: any, id: any, data: any) => {
        mockRequest(string, id, data)
        return Promise.resolve(resolve)
      })
    
    const response = await patchSong(mockId, mockData)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("songs", mockId, mockData)
    expect(response).toEqual(resolve)
  })

  test("deleteSongs calls deleteRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockImplementation((string: any, id: any) => {
        mockRequest(string, id)
        return Promise.resolve(resolve)
      })

    const response = await deleteSong(mockId)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("songs", mockId)
    expect(response).toEqual(resolve)
  })
})
