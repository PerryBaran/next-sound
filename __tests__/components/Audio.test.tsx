import { fireEvent, render, screen } from "@testing-library/react"
import Audio from "../../src/components/musicPlayer/audio/Audio"
import { useRef } from "react"

interface Props {
  playing: boolean
  source: string | undefined
  setDuration: (value: number) => void
  skipSong: (value: number | boolean) => void
}

const RenderWithRef = (props: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  return <Audio {...props} audioRef={audioRef} />
}

describe("Audio", () => {
  const props = {
    playing: true,
    source: "",
    setDuration: jest.fn(),
    skipSong: jest.fn()
  }
  let playSpy: jest.SpyInstance
  let pauseSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    playSpy = jest
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(jest.fn())
    pauseSpy = jest
      .spyOn(window.HTMLMediaElement.prototype, "pause")
      .mockImplementation(jest.fn())
  })

  test("renders correctly", () => {
    render(<RenderWithRef {...props} />)

    expect(screen.getByTestId("audio")).toHaveAttribute("src", props.source)
  })

  test("plays audioElement if playing is truthy", () => {
    render(<RenderWithRef {...props} />)

    expect(playSpy).toHaveBeenCalled()
    expect(pauseSpy).not.toHaveBeenCalled()
  })

  test("pauses audio element if playing is falsey", () => {
    render(<RenderWithRef {...props} playing={false} />)

    expect(playSpy).not.toHaveBeenCalled()
    expect(pauseSpy).toHaveBeenCalled()
  })

  test("on loaded meta data, sets duration", () => {
    render(<RenderWithRef {...props} playing={false} />)

    expect(props.setDuration).not.toHaveBeenCalled()

    fireEvent.loadedMetadata(screen.getByTestId("audio"))

    expect(props.setDuration).toHaveBeenCalled()
  })

  test("plays song on load meta data if playing is true", () => {
    render(<RenderWithRef {...props} />)

    expect(playSpy).toBeCalledTimes(1)

    fireEvent.loadedMetadata(screen.getByTestId("audio"))

    expect(playSpy).toBeCalledTimes(2)
  })

  test("calls skip song on song end", () => {
    render(<RenderWithRef {...props} />)

    expect(props.skipSong).not.toHaveBeenCalled()

    fireEvent.ended(screen.getByTestId("audio"))

    expect(props.skipSong).toHaveBeenCalledWith(true)
  })

  test("snapshot", () => {
    const { asFragment } = render(<RenderWithRef {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
