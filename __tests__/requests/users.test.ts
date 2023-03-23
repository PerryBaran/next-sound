import {
  login,
  signup,
  getUsers,
  getUserById,
  patchUser,
  deleteUser
} from "../../src/requests/users"
import * as requestHelpers from "../../src/requests/helpers"
import Cookies, { CookieAttributes } from "js-cookie"

describe("albums requests", () => {
  let mockRequest = jest.fn()
  const resolve = {
    userToken: "string"
  }
  const mockId = "test-id"

  beforeEach(() => (mockRequest = jest.fn()))

  describe("postRequests", () => {
    let mockCookiesSet = jest.fn()

    beforeEach(() => {
      mockCookiesSet = jest.fn()

      jest
        .spyOn(requestHelpers, "postRequest")
        .mockImplementation((string: any, data: any) => {
          mockRequest(string, data)
          return Promise.resolve(resolve)
        })

      jest
        .spyOn(Cookies, "set")
        .mockImplementation(
          (
            name: string,
            token: string,
            options: CookieAttributes | undefined
          ) => {
            mockCookiesSet(name, token, options)
            return undefined
          }
        )
    })

    test("login calls postRequest return the response and set a cookie", async () => {
      const mockData = { email: "email", password: "password" }
      const response = await login(mockData)

      expect(mockRequest).toBeCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith("users/login", mockData)
      expect(mockCookiesSet).toBeCalledTimes(1)
      expect(mockCookiesSet).toBeCalledWith("userToken", resolve.userToken, {
        expires: 5
      })
      expect(response).toEqual(resolve)
    })

    test("signup calls postRequest return the response and set a cookie", async () => {
      const mockData = { name: "name", email: "email", password: "password" }
      const response = await signup(mockData)

      expect(mockRequest).toBeCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith("users/signup", mockData)
      expect(mockCookiesSet).toBeCalledTimes(1)
      expect(mockCookiesSet).toBeCalledWith("userToken", resolve.userToken, {
        expires: 5
      })
      expect(response).toEqual(resolve)
    })
  })

  test("getUsers calls getRequest and returns the response", async () => {
    jest
      .spyOn(requestHelpers, "getRequest")
      .mockImplementation((string: any, query: any) => {
        mockRequest(string, query)
        return Promise.resolve(resolve)
      })

    const mockQuery = { name: "name", exact: true, limit: 50 }
    const response = await getUsers(mockQuery)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("users", mockQuery)
    expect(response).toEqual(resolve)
  })

  test("getUserById calls getByIdRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "getByIdRequest")
      .mockImplementation((string: any, id: any) => {
        mockRequest(string, id)
        return Promise.resolve(resolve)
      })
    const response = await getUserById(mockId)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("users", mockId)
    expect(response).toEqual(resolve)
  })

  test("patchUser calls patchRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "patchRequest")
      .mockImplementation((string: any, id: any, data: any) => {
        mockRequest(string, id, data)
        return Promise.resolve(resolve)
      })

    const mockData = { email: "email", password: "password" }
    const response = await patchUser(mockId, mockData)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("users", mockId, mockData)
    expect(response).toEqual(resolve)
  })

  test("deleteUser calls deleteRequest and returns response", async () => {
    jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockImplementation((string: any, id: any) => {
        mockRequest(string, id)
        return Promise.resolve(resolve)
      })

    const password = "password"
    const response = await deleteUser(mockId, password)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith("users", `${mockId}/${password}`)
    expect(response).toEqual(resolve)
  })
})
