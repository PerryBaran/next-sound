import {
  postAlbums,
  getAlbums,
  getAlbumById,
  patchAlbum,
  deleteAlbum
} from "../../src/requests/albums"
import * as requestHelpers from "../../src/requests/helpers"

describe("albums requests", () => {
  const mockData = {
    name: "name",
    image: new File([], "image")
  }
  const mockId = "test-id"
  const resolve = "resolve"
  let mockRequest = jest.fn()

  beforeEach(() => (mockRequest = jest.fn()))

  test("postAlbums calls postRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "postRequest")
      .mockImplementation((string: any, data: any) => {
        mockRequest(string, data)
        return Promise.resolve(resolve)
      })

    const response = await postAlbums(mockData)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("albums", mockData)
    expect(response).toEqual(resolve)
  })

  test("getAlbums calls getRequest and returns response", async () => {
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
    const response = await getAlbums(mockQuery)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("albums", mockQuery)
    expect(response).toEqual(resolve)
  })

  test("getAlbumById calls getByIdRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "getByIdRequest")
      .mockImplementation((string: any, id: any) => {
        mockRequest(string, id)
        return Promise.resolve(resolve)
      })
    const response = await getAlbumById(mockId)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("albums", mockId)
    expect(response).toEqual(resolve)
  })

  test("patchAlbum calls patchRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "patchRequest")
      .mockImplementation((string: any, id: any, data: any) => {
        mockRequest(string, id, data)
        return Promise.resolve(resolve)
      })

    const response = await patchAlbum(mockId, mockData)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("albums", mockId, mockData)
    expect(response).toEqual(resolve)
  })

  test("deleteAlbums calls deleteRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockImplementation((string: any, id: any) => {
        mockRequest(string, id)
        return Promise.resolve(resolve)
      })

    const response = await deleteAlbum(mockId)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("albums", mockId)
    expect(response).toEqual(resolve)
  })
})
