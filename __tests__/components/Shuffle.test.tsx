import { fireEvent, render, screen } from "@testing-library/react"
import Shuffle from "../../src/components/musicPlayer/shuffle/Shuffle"

describe("Shuffle", () => {
  const props = {
    handleShuffle: jest.fn()
  }

  test("rendes correctly", () => {
    render(<Shuffle {...props} />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByAltText("shuffle")).toBeInTheDocument()
  })

  test("shuffle click", () => {
    render(<Shuffle {...props} />)
    const shuffle = screen.getByAltText("shuffle")

    expect(props.handleShuffle).toBeCalledTimes(0)

    fireEvent.click(shuffle)

    expect(props.handleShuffle).toBeCalledTimes(1)
    expect(props.handleShuffle).toHaveBeenLastCalledWith(true)

    fireEvent.click(shuffle)

    expect(props.handleShuffle).toBeCalledTimes(2)
    expect(props.handleShuffle).toHaveBeenLastCalledWith(false)
  })

  test("snapshot", () => {
    const { asFragment } = render(<Shuffle {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
