import { renderToHTML } from "next/dist/server/render"
import { render, screen } from "@testing-library/react"
import Home from "../../src/app/page"
import * as albumRequests from "../../src/requests/albums"

describe("Home", () => {
  const mockData = [
    {
      name: "album-1-name",
      url: "album-1-url",
      id: "album-1-id",
      UserId: "album-1-UserId",
      createdAt: "album-1-createdAt",
      User: {
        name: "album-1-user-name",
        id: "album-1-user-id",
        createdAt: "album-1-user-createdAt"
      },
      Songs: [
        {
          name: "album-1-song-1-name",
          url: "album-1-song-1-url",
          id: "album-1-song-1-id",
          createdAt: "album-1-song-1-createdAt"
        },
        {
          name: "album-1-song-1-name",
          url: "album-1-song-1-url",
          id: "album-1-song-1-id",
          createdAt: "album-1-song-1-createdAt"
        }
      ]
    },
    {
      name: "album-2-name",
      url: "album-2-url",
      id: "album-2-id",
      UserId: "album-2-UserId",
      createdAt: "album-2-createdAt",
      User: {
        name: "album-2-user-name",
        id: "album-2-user-id",
        createdAt: "album-2-user-createdAt"
      },
      Songs: [
        {
          name: "album-2-song-1-name",
          url: "album-2-song-1-url",
          id: "album-2-song-1-id",
          createdAt: "album-2-song-1-createdAt"
        },
        {
          name: "album-2-song-1-name",
          url: "album-2-song-1-url",
          id: "album-2-song-1-id",
          createdAt: "album-2-song-1-createdAt"
        }
      ]
    }
  ]
  let getAlbumsSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    getAlbumsSpy = jest
      .spyOn(albumRequests, "getAlbums")
      .mockResolvedValue(mockData)
  })

  test("renders correctly", () => {})
})
