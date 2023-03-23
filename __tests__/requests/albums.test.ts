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

  describe("postAlbums", () => {
    const mock = jest.fn()
    const resolve = "post"

    jest
      .spyOn(requestHelpers, "postRequest")
      .mockImplementation((string: any, data: any) => {
        mock(string, data)
        return Promise.resolve(resolve)
      })

    test("calls postRequest and returns response", async () => {
      const response = await postAlbums(mockData)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith("albums", mockData)
      expect(response).toEqual(resolve)
    })
  })

  describe("getAlbums", () => {
    const mock = jest.fn()
    const resolve = "get"

    jest
      .spyOn(requestHelpers, "getRequest")
      .mockImplementation((string: any, query: any) => {
        mock(string, query)
        return Promise.resolve(resolve)
      })

    test("calls getRequest and returns response", async () => {
      const mockQuery = {
        name: "name",
        exact: true,
        limit: 50
      }
      const response = await getAlbums(mockQuery)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith("albums", mockQuery)
      expect(response).toEqual(resolve)
    })
  })

  describe("getAlbumsById", () => {
    const mock = jest.fn()
    const resolve = "getById"

    jest
      .spyOn(requestHelpers, "getByIdRequest")
      .mockImplementation((string: any, id: any) => {
        mock(string, id)
        return Promise.resolve(resolve)
      })

    test("calls getByIdRequest and returns response", async () => {
      const id = "teset-id"
      const response = await getAlbumById(id)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith("albums", id)
      expect(response).toEqual(resolve)
    })
  })

  describe("patchAlbum", () => {
    const mock = jest.fn()
    const resolve = "patchAlbum"

    jest
      .spyOn(requestHelpers, "patchRequest")
      .mockImplementation((string: any, id: any, data: any) => {
        mock(string, id, data)
        return Promise.resolve(resolve)
      })

    test("calls patchRequest and returns response", async () => {
      const response = await patchAlbum(mockId, mockData)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith("albums", mockId, mockData)
      expect(response).toEqual(resolve)
    })
  })

  describe("deleteAlbum", () => {
    const mock = jest.fn()
    const resolve = "deleteAlbum"

    jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockImplementation((string: any, id: any) => {
        mock(string, id)
        return Promise.resolve(resolve)
      })

    test("calls deleteRequest and returns response", async () => {
      const response = await deleteAlbum(mockId)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith("albums", mockId)
      expect(response).toEqual(resolve)
    })
  })
})
