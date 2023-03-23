export default function createForm(model: string, data: any) {
  const formData = new FormData()
  switch (model) {
    case "songs": {
      if (data.name) {
        formData.append("name", data.name)
      }
      if (data.audio) {
        formData.append("audio", data.audio)
      }
      if (data.position !== undefined) {
        formData.append("position", data.position)
      }
      if (data.AlbumId) {
        formData.append("AlbumId", data.AlbumId)
      }
      break
    }
    case "albums": {
      if (data.name) {
        formData.append("name", data.name)
      }
      if (data.image) {
        formData.append("image", data.image)
      }
      break
    }
    default: {
      return data
    }
  }
  return formData
}