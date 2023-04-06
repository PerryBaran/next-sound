import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createContext, useContext } from "react"
import UploadAlbumForm from "../../src/components/uploadAlbumForm/UploadAlbumForm"
import * as navigation from "next/navigation"
import * as UserContext from "../../src/context/UserContext"
import * as updateAlbum from "../../src/components/uploadAlbumForm/helpers/updateAlbum"
import * as uploadAlbum from "../../src/components/uploadAlbumForm/helpers/uploadAlbum"
import * as albumRequests from "../../src/requests/albums"

describe("UploadAlbumForm", () => {
  let mockRouter = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }
  const mockName = "mock-name"
  let updateAlbumSpy: jest.SpyInstance
  let uploadAlbumSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockRouter = {
      back: jest.fn(),
      forward: jest.fn(),
      push: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }

    jest.spyOn(navigation, "useRouter").mockReturnValue(mockRouter)

    const mockContext = createContext({
      user: { name: mockName, id: "" },
      handleLogin: jest.fn()
    })
    jest
      .spyOn(UserContext, "useUserContext")
      .mockImplementation(() => useContext(mockContext))

    updateAlbumSpy = jest.spyOn(updateAlbum, "default").mockResolvedValue()
    uploadAlbumSpy = jest.spyOn(uploadAlbum, "default").mockResolvedValue()
  })

  describe("upload - no data", () => {
    describe("tests", () => {
      beforeEach(() => {
        render(<UploadAlbumForm />)
      })

      test("renders correctly", () => {
        const nameInputs = screen.getAllByLabelText(/name/i)

        expect(screen.getByText(/upload album/i)).toBeInstanceOf(
          HTMLHeadingElement
        )
        expect(nameInputs).toHaveLength(2)
        nameInputs.forEach((input) => {
          expect(input).toHaveAttribute("type", "text")
        })
        expect(screen.getByLabelText(/cover art/i)).toHaveAttribute(
          "type",
          "file"
        )
        expect(screen.getByText(/upload songs/i)).toBeInstanceOf(
          HTMLHeadingElement
        )
        expect(screen.getByText(/song 1/i)).toBeInstanceOf(HTMLHeadingElement)
        expect(screen.getByLabelText(/audio/i)).toHaveAttribute("type", "file")
        expect(screen.getByText(/x/i)).toBeInstanceOf(HTMLButtonElement)
        expect(screen.getByText("+")).toBeInstanceOf(HTMLButtonElement)
        expect(screen.getByText(/submit/i)).toHaveAttribute("type", "submit")
        expect(screen.getByText(/cancel/i)).toBeInstanceOf(HTMLButtonElement)
      })

      test("remove button", () => {
        expect(screen.getAllByLabelText(/name/i)).toHaveLength(2)

        fireEvent.click(screen.getByText(/x/i))

        expect(screen.getAllByLabelText(/name/i)).toHaveLength(1)
      })

      test("add button", () => {
        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(1)

        fireEvent.click(screen.getByText("+"))

        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)
      })

      test("drag and drop", () => {
        fireEvent.click(screen.getByText("+"))

        const name = "name"
        fireEvent.change(screen.getAllByLabelText(/name/i)[1], {
          target: { value: name }
        })

        fireEvent.dragEnter(screen.getAllByLabelText(/name/i)[2])
        fireEvent.dragEnd(screen.getAllByLabelText(/name/i)[1])

        expect(screen.getAllByLabelText(/name/i)[2]).toHaveValue(name)
      })

      test("submit", () => {
        fireEvent.click(screen.getByText(/submit/i))

        expect(uploadAlbumSpy).toBeCalledTimes(0)

        fireEvent.click(screen.getByText(/yes/i))

        expect(uploadAlbumSpy).toBeCalledTimes(1)
        expect(updateAlbumSpy).toBeCalledTimes(0)
      })

      test("cancel", () => {
        fireEvent.click(screen.getByText(/cancel/i))

        expect(mockRouter.back).toBeCalledTimes(0)

        fireEvent.click(screen.getByText(/yes/i))

        expect(mockRouter.back).toBeCalledTimes(1)
      })
    })

    test("snapshot", () => {
      const { asFragment } = render(<UploadAlbumForm />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe("update - with data", () => {
    const mockData = {
      name: "album-name",
      id: "album-id",
      Songs: [
        {
          name: "song-1-name",
          position: 0,
          id: "song-1-id"
        },
        {
          name: "song-2-name",
          position: 1,
          id: "song-2-id"
        }
      ]
    }

    describe("tests", () => {
      beforeEach(() => {
        render(<UploadAlbumForm data={mockData} />)
      })

      test("renders correctly", () => {
        const nameInputs = screen.getAllByLabelText(/name/i)

        expect(screen.getByText(/edit album/i)).toBeInstanceOf(
          HTMLHeadingElement
        )
        expect(nameInputs).toHaveLength(3)
        nameInputs.forEach((input, i) => {
          if (i === 0) {
            expect(input).toHaveValue(mockData.name)
          } else {
            expect(input).toHaveValue(mockData.Songs[i - 1].name)
          }
        })
        expect(screen.getByLabelText(/cover art/i)).toHaveAttribute(
          "type",
          "file"
        )
        expect(screen.getByText(/edit songs/i)).toBeInstanceOf(
          HTMLHeadingElement
        )
        expect(screen.getByText(/song 1/i)).toBeInstanceOf(HTMLHeadingElement)
        expect(screen.getAllByLabelText(/audio/i)[0]).toHaveAttribute(
          "type",
          "file"
        )
        expect(screen.getAllByLabelText(/x/i)[0]).toBeInstanceOf(
          HTMLInputElement
        )
        expect(screen.getByText("+")).toBeInstanceOf(HTMLButtonElement)
        expect(screen.getByText(/save changes/i)).toHaveAttribute(
          "type",
          "submit"
        )
        expect(screen.getByText(/delete album/i)).toBeInstanceOf(
          HTMLButtonElement
        )
        expect(screen.getByText(/cancel/i)).toBeInstanceOf(HTMLButtonElement)
      })

      test("remove input", () => {
        const remove = screen.getAllByLabelText(/x/i)[0]

        expect(remove).not.toBeChecked()

        fireEvent.click(remove)

        expect(remove).toBeChecked()
      })

      test("add button", () => {
        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)

        fireEvent.click(screen.getByText("+"))

        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(3)
      })

      test("remove button", () => {
        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)

        fireEvent.click(screen.getByText("+"))

        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(3)

        const removeButtons = screen.getAllByText(/x/i)
        fireEvent.click(removeButtons[removeButtons.length - 1])

        expect(screen.getAllByLabelText(/audio/i)).toHaveLength(2)
      })

      test("drag and drop", () => {
        const names = screen.getAllByLabelText(/name/i)

        expect(names[1]).toHaveValue(mockData.Songs[0].name)

        fireEvent.dragEnter(names[2])
        fireEvent.dragEnd(names[1])

        expect(screen.getAllByLabelText(/name/i)[2]).toHaveValue(
          mockData.Songs[0].name
        )
      })

      test("submit", () => {
        fireEvent.click(screen.getByText(/save changes/i))

        expect(updateAlbumSpy).toBeCalledTimes(0)

        fireEvent.click(screen.getByText(/yes/i))

        expect(updateAlbumSpy).toBeCalledTimes(1)
        expect(uploadAlbumSpy).toBeCalledTimes(0)
      })

      test("cancel", () => {
        fireEvent.click(screen.getByText(/cancel/i))

        expect(mockRouter.back).toBeCalledTimes(0)

        fireEvent.click(screen.getByText(/yes/i))

        expect(mockRouter.back).toBeCalledTimes(1)
      })

      describe("delete", () => {
        let deleteAlbumSpy: jest.SpyInstance
        beforeEach(() => {
          deleteAlbumSpy = jest.spyOn(albumRequests, "deleteAlbum")
        })

        test("succesfully deletes", async () => {
          deleteAlbumSpy.mockResolvedValue("")
          fireEvent.click(screen.getByText(/delete/i))

          expect(mockRouter.push).toBeCalledTimes(0)
          expect(deleteAlbumSpy).toBeCalledTimes(0)

          fireEvent.click(screen.getByText(/yes/i))

          await waitFor(() => {
            expect(deleteAlbumSpy).toBeCalledWith(mockData.id)
            expect(mockRouter.push).toBeCalledWith(`profile/${mockName}`)
          })
        })

        test("throws expected error", async () => {
          const error = "error"
          deleteAlbumSpy.mockRejectedValue({ message: error })

          fireEvent.click(screen.getByText(/delete/i))

          fireEvent.click(screen.getByText(/yes/i))

          await waitFor(() => {
            expect(screen.getByText(error)).toBeInTheDocument()
          })
        })

        test("throws unexpected error", async () => {
          deleteAlbumSpy.mockRejectedValue("")

          fireEvent.click(screen.getByText(/delete/i))

          fireEvent.click(screen.getByText(/yes/i))

          await waitFor(() => {
            expect(screen.getByText("Unexpected Error")).toBeInTheDocument()
          })
        })
      })
    })

    test("snapshot", () => {
      const { asFragment } = render(<UploadAlbumForm data={mockData} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
