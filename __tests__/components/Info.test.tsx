import { render, screen } from "@testing-library/react"
import Info from "../../src/components/musicPlayer/info/Info"

describe("Info", () => {
  const props = {
    albumArt: "/art",
    artistName: "artist-name",
    songName: "song-name",
    albumName: "album-name"
  }

  test("renders correctly with defined props", () => {
    render(<Info {...props}/>)

    expect(screen.getByAltText(`${props.albumName} cover art`)).toHaveAttribute("src", `/_next/image?url=%2F${props.albumArt.substring(1, props.albumArt.length)}&w=256&q=75`)
    expect(screen.getByText(props.artistName)).toBeInstanceOf(HTMLHeadingElement)
    expect(screen.getByText(props.songName)).toBeInstanceOf(HTMLParagraphElement)
  })

  test("renders correctly with undefined props", () => {
    render(<Info />)

    expect(screen.getByAltText(/default cover art/i)).toBeInTheDocument()
  })

  describe("snapshots", () => {
    test("defined props", () => {
      const { asFragment } = render(<Info {...props}/>)

      expect(asFragment()).toMatchSnapshot()
    })

    test("undefined props", () => {
      const { asFragment } = render(<Info />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})