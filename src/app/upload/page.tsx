'use client'

import Alert from "@/components/alert/Alert"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { postAlbums } from "@/requests/albums"

export default function UploadAlbum() {
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | undefined>()
  const [alert, setAlert] = useState("")
  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return
  
    setImage(files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setAlert('Must provide a name')
    } else {
      const album = {
        name,
        image
      }
      try {
        const { id } = await postAlbums(album)
        router.push(`/upload/${id}`)
      } catch (err) {

      }
    }
  }

  return (
    <div>
      <Alert message={alert} />
      <form onSubmit={handleSubmit}>
        <h2>Create Album</h2>
        <label htmlFor='name'>
          <span>Name</span>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <label htmlFor='image'>
          <span>Cover Art</span>
          <input
            type='file'
            name='image'
            id='image'
            onChange={handleImageChange}
          />
        </label>
        <button type='submit'>Create Album</button>
      </form>
    </div>
  )
}
