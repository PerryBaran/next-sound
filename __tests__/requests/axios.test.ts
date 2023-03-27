import { instance, config } from "../../src/requests/helpers/axios"
import Cookies from "js-cookie"

describe("axios", () => {
  test("instance", () => {
    expect(instance.defaults.withCredentials).toEqual(true)
    expect(instance.defaults.baseURL).toEqual(
      "https://soundcloud-clone-api.onrender.com"
    )
  })

  test("config", () => {
    const mockCookie = jest.fn()
    const token = { userToken: "token" }

    jest.spyOn(Cookies, "get").mockImplementation(() => {
      mockCookie()
      return token
    })
    const response = config()

    expect(response).toEqual({
      headers: {
        userToken: token
      }
    })
  })
})
