import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import Volume from "../../src/components/musicPlayer/volume/Volume"

describe("Volume", () => {
  let props = {
    volume: 0.5,
    handleVolume: jest.fn()
  }

  beforeEach(() => {
    props.handleVolume = jest.fn()
  })

  test("renders button", () => {
    render(<Volume {...props} />)

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  test("renders correctly when volume is equal to 0", () => {
    const volume = 0
    render(<Volume {...props} volume={volume} />)

    expect(screen.getByAltText("volume muted")).toBeInTheDocument()
    expect(screen.getByDisplayValue(volume * 100)).toBeInTheDocument()
  })

  test("renders correctly when volume is less than 0.5 but greater than 0", () => {
    const volume = 0.3
    render(<Volume {...props} volume={volume} />)

    expect(screen.getByAltText("low volume")).toBeInTheDocument()
    expect(screen.getByDisplayValue(volume * 100)).toBeInTheDocument()
  })

  test("renders correctly when volume is greater than or equal to 0.5", () => {
    const volume = 0.5
    render(<Volume {...props} volume={volume} />)

    expect(screen.getByAltText("high volume")).toBeInTheDocument()
    expect(screen.getByDisplayValue(volume * 100)).toBeInTheDocument()
  })

  test("button click", () => {
    const TestVolumeToggle = ({
      volume,
      handleVolume
    }: {
      volume: number
      handleVolume: (value: number) => void
    }) => {
      const [mockVolume, setMockVolume] = useState(volume)

      const mockHandleVolume = (value: number) => {
        handleVolume(value)
        setMockVolume(value)
      }

      return <Volume volume={mockVolume} handleVolume={mockHandleVolume} />
    }
    render(<TestVolumeToggle {...props} />)
    const button = screen.getByRole("button")

    expect(props.handleVolume).toBeCalledTimes(0)

    fireEvent.click(button)

    expect(props.handleVolume).toBeCalledTimes(1)
    expect(props.handleVolume).toHaveBeenCalledWith(0)

    fireEvent.click(button)

    expect(props.handleVolume).toBeCalledTimes(2)
    expect(props.handleVolume).toHaveBeenCalledWith(props.volume)
  })

  test("input change", () => {
    render(<Volume {...props} />)

    expect(props.handleVolume).toBeCalledTimes(0)

    const newValue = 20
    fireEvent.change(screen.getByDisplayValue(props.volume * 100), {
      target: { value: newValue }
    })

    expect(props.handleVolume).toBeCalledTimes(1)
    expect(props.handleVolume).toHaveBeenCalledWith(newValue / 100)
  })

  test("snapshot", () => {
    const { asFragment } = render(<Volume {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
