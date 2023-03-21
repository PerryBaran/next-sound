import { render, screen } from "@testing-library/react"
import Artist from "../../src/components/artist/Artist"

describe("Artist", () => {
  const props = {
    name: "name",
    image: "/image"
  }

  test("renders correctly", () => {
    render(<Artist {...props} />)

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/profile/${props.name}`
    )
    expect(screen.getByAltText(`album by ${props.name}`)).toHaveAttribute(
      "src",
      `/_next/image?url=%2F${props.image.substring(
        1,
        props.image.length
      )}&w=256&q=75`
    )
    expect(screen.getByRole("heading")).toHaveTextContent(props.name)
  })

  test("snapshot", () => {
    const { asFragment } = render(<Artist {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
