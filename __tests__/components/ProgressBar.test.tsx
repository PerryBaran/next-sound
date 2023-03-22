import { fireEvent, render, screen } from "@testing-library/react"
import ProgressBar from "../../src/components/musicPlayer/progressbar/ProgresssBar"

describe("ProgressBar", () => {
  const props = {
    handleAudioTime: jest.fn(),
    time: 10,
    duration: 100
  }

  test("renders correctly", () => {
    render(<ProgressBar {...props} />)
    const input = screen.getByDisplayValue(props.time)

    expect(input).toHaveAttribute("type", "range")
    expect(input).toHaveAttribute("name", "time")
    expect(input).toHaveAttribute("min", "0")
    expect(input).toHaveAttribute("max", `${props.duration}`)
  })

  test("input change", () => {
    render(<ProgressBar {...props} />)

    expect(props.handleAudioTime).toBeCalledTimes(0)

    const newValue = 20
    fireEvent.change(screen.getByDisplayValue(props.time), {
      target: { value: newValue.toString() }
    })

    expect(props.handleAudioTime).toBeCalledTimes(1)
    expect(props.handleAudioTime).toBeCalledWith(newValue)
  })

  test("snapshot", () => {
    const { asFragment } = render(<ProgressBar {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
