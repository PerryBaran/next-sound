import createForm from "../../src/requests/helpers/createForm";

describe("createForm", () => {
  test("songs", () => {
    const data = {
      name: "name",
      audio: new File([], "audio"),
      position: 0,
      AlbumId: "albumId"
    }
    const response = createForm("songs", data)

    const form = new FormData()
    form.append("name", data.name)
    form.append("audio", data.audio)
    form.append("position", `${data.position}`)
    form.append("AlbumId", data.AlbumId)

    expect(response).toEqual(form)
  })

  test("albums", () => {
    const data = {
      name: "name",
      image: new File([], "image")
    }
    const response = createForm("albums", data)

    const form = new FormData()
    form.append("name", data.name)
    form.append("image", data.image)

    expect(response).toEqual(form)
  })

  test("model doesn't equal users or albums", () => {
    const data = {
      test: "test"
    }
    const response = createForm("test", data)

    expect(response).toBe(data)
  })
})