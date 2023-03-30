import {
  login,
  signup,
  getUsers,
  getUserById,
  patchUser,
  deleteUser
} from "../../src/requests/users"
import * as requestHelpers from "../../src/requests/helpers/requestHelpers"
import Cookies from "js-cookie"

describe("albums requests", () => {
  const mockResolve = {
    userToken: "string"
  }
  const mockId = "test-id"

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("postRequests", () => {
    let setCookiesSpy: jest.SpyInstance
    let postSpy: jest.SpyInstance

    beforeEach(() => {
      postSpy = jest
        .spyOn(requestHelpers, "postRequest")
        .mockResolvedValue(mockResolve)

      setCookiesSpy = jest.spyOn(Cookies, "set").mockReturnValue("")
    })

    test("login calls postRequest return the response and set a cookie", async () => {
      const mockData = { email: "email", password: "password" }
      const response = await login(mockData)

      expect(postSpy).toBeCalledTimes(1)
      expect(postSpy).toHaveBeenCalledWith("users/login", mockData)
      expect(setCookiesSpy).toBeCalledTimes(1)
      expect(setCookiesSpy).toBeCalledWith("userToken", mockResolve.userToken, {
        expires: 5
      })
      expect(response).toEqual(mockResolve)
    })

    test("signup calls postRequest return the response and set a cookie", async () => {
      const mockData = { name: "name", email: "email", password: "password" }
      const response = await signup(mockData)

      expect(postSpy).toBeCalledTimes(1)
      expect(postSpy).toHaveBeenCalledWith("users/signup", mockData)
      expect(setCookiesSpy).toBeCalledTimes(1)
      expect(setCookiesSpy).toBeCalledWith("userToken", mockResolve.userToken, {
        expires: 5
      })
      expect(response).toEqual(mockResolve)
    })
  })

  test("getUsers calls getRequest and returns the response", async () => {
    const getSpy = jest
      .spyOn(requestHelpers, "getRequest")
      .mockResolvedValue(mockResolve)

    const mockQuery = { name: "name", exact: true, limit: 50 }
    const response = await getUsers(mockQuery)

    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(getSpy).toHaveBeenCalledWith("users", mockQuery)
    expect(response).toEqual(mockResolve)
  })

  test("getUserById calls getByIdRequest and returns response", async () => {
    const getByIdSpy = jest
      .spyOn(requestHelpers, "getByIdRequest")
      .mockResolvedValue(mockResolve)

    const response = await getUserById(mockId)

    expect(getByIdSpy).toHaveBeenCalledTimes(1)
    expect(getByIdSpy).toHaveBeenCalledWith("users", mockId)
    expect(response).toEqual(mockResolve)
  })

  test("patchUser calls patchRequest and returns response", async () => {
    const patchSpy = jest
      .spyOn(requestHelpers, "patchRequest")
      .mockResolvedValue(mockResolve)

    const mockData = { email: "email", password: "password" }
    const response = await patchUser(mockId, mockData)

    expect(patchSpy).toHaveBeenCalledTimes(1)
    expect(patchSpy).toHaveBeenCalledWith("users", mockId, mockData)
    expect(response).toEqual(mockResolve)
  })

  test("deleteUser calls deleteRequest and returns response", async () => {
    const deleteSpy = jest
      .spyOn(requestHelpers, "deleteRequest")
      .mockResolvedValue(mockResolve)

    const password = "password"
    const response = await deleteUser(mockId, password)

    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith("users", `${mockId}/${password}`)
    expect(response).toEqual(mockResolve)
  })
})
