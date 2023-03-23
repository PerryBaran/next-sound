import {
  postRequest,
  getRequest,
  getByIdRequest,
  patchRequest,
  deleteRequest,
} from "../../src/requests/helpers/requestHelpers"
import * as axios from "../../src/requests/helpers/axios"
import * as createForm from '../../src/requests/helpers/createForm'

describe("request helper functions", () => {
  let instanceMock = jest.fn()
  let mockCreateForm = jest.fn()
  let mockConfig = jest.fn()
  const mockData = "data"
  const mockId = "id"
  const mockHeader = {
    headers: {
      userToken: "mockHeader"
    }
  }
  const mockModel = "users"

  beforeEach(() => {
    instanceMock = jest.fn()
    mockCreateForm = jest.fn()
    mockConfig = jest.fn()

    jest.spyOn(axios, "config").mockImplementation(() => {
      mockConfig()
      return mockHeader
    })
  })

  describe("postRequest", () => {
    beforeEach(() => {
      jest.spyOn(createForm, "default").mockImplementation((model: any, data: any) => {
        mockCreateForm(model, data)
        return data
      })
    })

    test("returns data", async () => {
      jest.spyOn(axios.instance, "post").mockImplementation((string: any, data: any, config: any) => {
        instanceMock(string, data, config)
        return Promise.resolve({ data: mockData})
      })
      const response = await postRequest(mockModel, mockData)
      
      expect(mockCreateForm).toHaveBeenCalledTimes(1)
      expect(mockCreateForm).toHaveBeenCalledWith(mockModel, mockData)
      expect(instanceMock).toHaveBeenCalledTimes(1)
      expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}`, mockData, mockHeader)
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      jest.spyOn(axios.instance, "post").mockImplementation(() => {
        throw { response: { data: { message: error }}}
      })

      expect(postRequest(mockModel, mockData)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      jest.spyOn(axios.instance, "post").mockImplementation(() => {
        throw new Error()
      })

      expect(postRequest(mockModel, mockData)).rejects.toThrow("Unexpected Error")
    })
  })

  describe("getRequest", () => {
    describe("succesfull response", () => {
      beforeEach(() => {
        jest.spyOn(axios.instance, "get").mockImplementation((string: any, config: any) => {
          instanceMock(string, config)
          return Promise.resolve({ data: mockData})
        })
      })

      test("returns data", async () => {
        const response = await getRequest(mockModel)
      
        expect(instanceMock).toHaveBeenCalledTimes(1)
        expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}`, mockHeader)
        expect(response).toEqual(mockData)
      })

      test("can add optional query params", async () => {
        const query = { name: "name" }
        await getRequest(mockModel, query)
      
        expect(instanceMock).toHaveBeenCalledTimes(1)
        expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}?name=${query.name}`, mockHeader)
      })

      test("can add multiple query params", async () => {
        const query = { name: "name", exact: true, limit: 50 }
        await getRequest(mockModel, query)
      
        expect(instanceMock).toHaveBeenCalledTimes(1)
        expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}?name=${query.name}&exact=true&limit=${query.limit}`, mockHeader)
      })
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      jest.spyOn(axios.instance, "get").mockImplementation(() => {
        throw { response: { data: { message: error }}}
      })

      expect(getRequest(mockModel)).rejects.toThrow("error")
    })

    test("throws unexpected error if unexpected error occurs", () => {
      jest.spyOn(axios.instance, "get").mockImplementation(() => {
        throw new Error()
      })

      expect(getRequest(mockModel)).rejects.toThrow("Unexpected Error")
    })
  })

  describe("getByIdRequest", () => {
    test("returns data", async () => {
      jest.spyOn(axios.instance, "get").mockImplementation((string: any, config: any) => {
        instanceMock(string, config)
        return Promise.resolve({ data: mockData})
      })
      const response = await getByIdRequest(mockModel, mockId)
      
      expect(instanceMock).toHaveBeenCalledTimes(1)
      expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}/${mockId}`, mockHeader)
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      jest.spyOn(axios.instance, "get").mockImplementation(() => {
        throw { response: { data: { message: error }}}
      })

      expect(getByIdRequest(mockModel, mockId)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      jest.spyOn(axios.instance, "get").mockImplementation(() => {
        throw new Error()
      })

      expect(getByIdRequest(mockModel, mockId)).rejects.toThrow("Unexpected Error")
    })
  })

  describe("patchRequest", () => {
    beforeEach(() => {
      jest.spyOn(createForm, "default").mockImplementation((model: any, data: any) => {
        mockCreateForm(model, data)
        return data
      })
    })

    test("returns data", async () => {
      jest.spyOn(axios.instance, "patch").mockImplementation((string: any, data: any, config: any) => {
        instanceMock(string, data, config)
        return Promise.resolve({ data: mockData})
      })
      const response = await patchRequest(mockModel, mockId, mockData)
      
      expect(mockCreateForm).toHaveBeenCalledTimes(1)
      expect(mockCreateForm).toHaveBeenCalledWith(mockModel, mockData)
      expect(instanceMock).toHaveBeenCalledTimes(1)
      expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}/${mockId}`, mockData, mockHeader)
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      jest.spyOn(axios.instance, "patch").mockImplementation(() => {
        throw { response: { data: { message: error }}}
      })

      expect(patchRequest(mockModel, mockId, mockData)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      jest.spyOn(axios.instance, "patch").mockImplementation(() => {
        throw new Error()
      })

      expect(patchRequest(mockModel, mockId, mockData)).rejects.toThrow("Unexpected Error")
    })
  })

  describe("deleteRequest", () => {
    test("returns data", async () => {
      jest.spyOn(axios.instance, "delete").mockImplementation((string: any, config: any) => {
        instanceMock(string, config)
        return Promise.resolve({ data: mockData})
      })
      const response = await deleteRequest(mockModel, mockId)
      
      expect(instanceMock).toHaveBeenCalledTimes(1)
      expect(instanceMock).toHaveBeenCalledWith(`/${mockModel}/${mockId}`, mockHeader)
      expect(response).toEqual(mockData)
    })

    test("throws an error with message if it matches expected error from post request", () => {
      const error = "error"
      jest.spyOn(axios.instance, "delete").mockImplementation(() => {
        throw { response: { data: { message: error }}}
      })

      expect(deleteRequest(mockModel, mockId)).rejects.toThrow(error)
    })

    test("throws unexpected error if unexpected error occurs", () => {
      jest.spyOn(axios.instance, "delete").mockImplementation(() => {
        throw new Error()
      })

      expect(deleteRequest(mockModel, mockId)).rejects.toThrow("Unexpected Error")
    })
  })
})