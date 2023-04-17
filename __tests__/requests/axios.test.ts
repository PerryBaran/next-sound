import { instance, config } from "../../src/requests/helpers/axios"
import Cookies from "js-cookie"

describe("axios", () => {
  test("instance", () => {
    expect(instance.defaults.withCredentials).toEqual(true)
    expect(instance.defaults.baseURL).toEqual(
      "https://soundcloud-clone-api-production.up.railway.app/"
    )
  })

  test("config", () => {
    const token = { userToken: "token" }
    jest.spyOn(Cookies, "get").mockReturnValue(token)
    const response = config()

    expect(response).toEqual({
      headers: {
        userToken: token
      }
    })
  })
})
