import {
  postRequest,
  getRequest,
  getByIdRequest,
  patchRequest,
  deleteRequest
} from "../../src/requests/helpers/requestHelpers"
import * as axios from "../../src/requests/helpers/axios"
import * as createForm from "../../src/requests/helpers/createForm"

describe("request helper functions", () => {
  let mockCreateForm: jest.SpyInstance
  let mockConfig: jest.SpyInstance
  const mockData = "data"
  const mockId = "id"
  const mockHeader = {
    headers: {
      userToken: "mockHeader"
    }
  }
  const mockModel = "users"

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockConfig = jest.spyOn(axios, "config").mockReturnValue(mockHeader)
    mockCreateForm = jest
      .spyOn(createForm, "default")
      .mockImplementation((model: any, data: any) => {
        return data
      })
  })

  describe("postRequest", () => {
    let instancePostSpy: jest.SpyInstance

    beforeEach(() => {
      instancePostSpy = jest.spyOn(axios.instance, "post")
    })

    test("returns data", async () => {
      instancePostSpy.mockResolvedValue({ data: mockData })

      const response = await postRequest(mockModel, mockData)

      expect(mockCreateForm).toHaveBeenCalledTimes(1)
      expect(mockCreateForm).toHaveBeenCalledWith(mockModel, mockData)
      expect(instancePostSpy).toHaveBeenCalledTimes(1)
      expect(instancePostSpy).toHaveBeenCalledWith(
        `/${mockModel}`,
        mockData,
        mockHeader
      )
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      instancePostSpy.mockRejectedValue({
        response: { data: { message: error } }
      })

      expect(postRequest(mockModel, mockData)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      instancePostSpy.mockRejectedValue("")

      expect(postRequest(mockModel, mockData)).rejects.toThrow(
        "Unexpected Error"
      )
    })
  })

  describe("getRequest", () => {
    let instanceGetSpy: jest.SpyInstance

    beforeEach(() => {
      instanceGetSpy = jest.spyOn(axios.instance, "get")
    })

    describe("succesfull response", () => {
      beforeEach(() => {
        instanceGetSpy.mockResolvedValue({ data: mockData })
      })

      test("returns data", async () => {
        const response = await getRequest(mockModel)

        expect(instanceGetSpy).toHaveBeenCalledTimes(1)
        expect(instanceGetSpy).toHaveBeenCalledWith(`/${mockModel}`, mockHeader)
        expect(response).toEqual(mockData)
      })

      test("can add optional query params", async () => {
        const query = { name: "name" }
        await getRequest(mockModel, query)

        expect(instanceGetSpy).toHaveBeenCalledTimes(1)
        expect(instanceGetSpy).toHaveBeenCalledWith(
          `/${mockModel}?name=${query.name}`,
          mockHeader
        )
      })

      test("can add multiple query params", async () => {
        const query = { name: "name", exact: true, limit: 50 }
        await getRequest(mockModel, query)

        expect(instanceGetSpy).toHaveBeenCalledTimes(1)
        expect(instanceGetSpy).toHaveBeenCalledWith(
          `/${mockModel}?name=${query.name}&exact=true&limit=${query.limit}`,
          mockHeader
        )
      })
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      instanceGetSpy.mockRejectedValue({
        response: { data: { message: error } }
      })

      expect(getRequest(mockModel)).rejects.toThrow("error")
    })

    test("throws unexpected error if unexpected error occurs", () => {
      instanceGetSpy.mockRejectedValue("")

      expect(getRequest(mockModel)).rejects.toThrow("Unexpected Error")
    })
  })

  describe("getByIdRequest", () => {
    let instanceGetByIdSpy: jest.SpyInstance

    beforeEach(() => {
      instanceGetByIdSpy = jest.spyOn(axios.instance, "get")
    })

    test("returns data", async () => {
      instanceGetByIdSpy.mockResolvedValue({ data: mockData })

      const response = await getByIdRequest(mockModel, mockId)

      expect(instanceGetByIdSpy).toHaveBeenCalledTimes(1)
      expect(instanceGetByIdSpy).toHaveBeenCalledWith(
        `/${mockModel}/${mockId}`,
        mockHeader
      )
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      instanceGetByIdSpy.mockRejectedValue({
        response: { data: { message: error } }
      })

      expect(getByIdRequest(mockModel, mockId)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      instanceGetByIdSpy.mockRejectedValue("")

      expect(getByIdRequest(mockModel, mockId)).rejects.toThrow(
        "Unexpected Error"
      )
    })
  })

  describe("patchRequest", () => {
    let instancePatchSpy: jest.SpyInstance

    beforeEach(() => {
      instancePatchSpy = jest.spyOn(axios.instance, "patch")
    })

    test("returns data", async () => {
      instancePatchSpy.mockResolvedValue({ data: mockData })

      const response = await patchRequest(mockModel, mockId, mockData)

      expect(mockCreateForm).toHaveBeenCalledTimes(1)
      expect(mockCreateForm).toHaveBeenCalledWith(mockModel, mockData)
      expect(instancePatchSpy).toHaveBeenCalledTimes(1)
      expect(instancePatchSpy).toHaveBeenCalledWith(
        `/${mockModel}/${mockId}`,
        mockData,
        mockHeader
      )
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      instancePatchSpy.mockRejectedValue({
        response: { data: { message: error } }
      })

      expect(patchRequest(mockModel, mockId, mockData)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      instancePatchSpy.mockRejectedValue("")

      expect(patchRequest(mockModel, mockId, mockData)).rejects.toThrow(
        "Unexpected Error"
      )
    })
  })

  describe("deleteRequest", () => {
    let instanceDeleteSpy: jest.SpyInstance

    beforeEach(() => {
      instanceDeleteSpy = jest.spyOn(axios.instance, "delete")
    })

    test("returns data", async () => {
      instanceDeleteSpy.mockResolvedValue({ data: mockData })
      const response = await deleteRequest(mockModel, mockId)

      expect(instanceDeleteSpy).toHaveBeenCalledTimes(1)
      expect(instanceDeleteSpy).toHaveBeenCalledWith(
        `/${mockModel}/${mockId}`,
        mockHeader
      )
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      instanceDeleteSpy.mockRejectedValue({
        response: { data: { message: error } }
      })

      expect(deleteRequest(mockModel, mockId)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      instanceDeleteSpy.mockRejectedValue("")

      expect(deleteRequest(mockModel, mockId)).rejects.toThrow(
        "Unexpected Error"
      )
    })
  })
})
