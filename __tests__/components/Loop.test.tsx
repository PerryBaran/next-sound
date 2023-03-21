import { fireEvent, render, screen } from "@testing-library/react"
import Loop from "../../src/components/musicPlayer/loop/Loop"

describe("Loop", () => {
  const props = {
    handleLoop: jest.fn()
  }

  test("renders correctly when loop equals 'song'", () => {
    render(<Loop handleLoop={props.handleLoop} loop="song" />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("loop song")).toBeInTheDocument()
  })

  test("renders correctly when loop equals ''", () => {
    render(<Loop handleLoop={props.handleLoop} loop="" />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("loop")).toBeInTheDocument()
  })

  test("render corretly when loop equal 'playlist'", () => {
    render(<Loop handleLoop={props.handleLoop} loop="playlist" />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("loop playlist")).toBeInTheDocument()
  })

  test("button click", () => {
    render(<Loop handleLoop={props.handleLoop} loop="" />)

    expect(props.handleLoop).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button"))

    expect(props.handleLoop).toHaveBeenCalledTimes(1)
  })

  describe("snapshots", () => {
    test("loop equal ''", () => {
      const { asFragment } = render(
        <Loop handleLoop={props.handleLoop} loop="" />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("loop equal 'song'", () => {
      const { asFragment } = render(
        <Loop handleLoop={props.handleLoop} loop="song" />
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test("loop equal 'playlist'", () => {
      const { asFragment } = render(
        <Loop handleLoop={props.handleLoop} loop="playlist" />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
