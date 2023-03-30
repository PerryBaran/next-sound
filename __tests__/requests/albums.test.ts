import {
  postAlbums,
  getAlbums,
  getAlbumById,
  patchAlbum,
  deleteAlbum
} from "../../src/requests/albums"
import * as requestHelpers from "../../src/requests/helpers/requestHelpers"

describe("albums requests", () => {
  const mockData = {
    name: "name",
    image: new File([], "image")
  }
  const mockId = "test-id"
  const mockResolve = "resolve"

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("postAlbums calls postRequest and returns response", async () => {
    const postSpy = jest
      .spyOn(requestHelpers, "postRequest")
      .mockResolvedValue(mockResolve)

    const response = await postAlbums(mockData)

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith("albums", mockData)
    expect(response).toEqual(mockResolve)
  })

  test("getAlbums calls getRequest and returns response", async () => {
    const getSpy = jest
      .spyOn(requestHelpers, "getRequest")
      .mockResolvedValue(mockResolve)

    const mockQuery = {
      name: "name",
      exact: true,
      limit: 50
    }
    const response = await getAlbums(mockQuery)

    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(getSpy).toHaveBeenCalledWith("albums", mockQuery)
    expect(response).toEqual(mockResolve)
  })

  test("getAlbumById calls getByIdRequest and returns response", async () => {
    const getByIdSpy = jest
      .spyOn(requestHelpers, "getByIdRequest")
      .mockResolvedValue(mockResolve)

    const response = await getAlbumById(mockId)

    expect(getByIdSpy).toHaveBeenCalledTimes(1)
    expect(getByIdSpy).toHaveBeenCalledWith("albums", mockId)
    expect(response).toEqual(mockResolve)
  })

  test("patchAlbum calls patchRequest and returns response", async () => {
    const patchSpy = jest
      .spyOn(requestHelpers, "patchRequest")
      .mockResolvedValue(mockResolve)

    const response = await patchAlbum(mockId, mockData)

    expect(patchSpy).toHaveBeenCalledTimes(1)
    expect(patchSpy).toHaveBeenCalledWith("albums", mockId, mockData)
    expect(response).toEqual(mockResolve)
  })

  test("deleteAlbums calls deleteRequest and returns response", async () => {
    const deleteSpy = jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockResolvedValue(mockResolve)

    const response = await deleteAlbum(mockId)

    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith("albums", mockId)
    expect(response).toEqual(mockResolve)
  })
})
