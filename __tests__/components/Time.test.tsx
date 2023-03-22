import { render, screen } from "@testing-library/react"
import Time from "../../src/components/musicPlayer/time/Time"

describe("Time", () => {
  test("renders correctly when time is less than 10", () => {
    render(<Time time={9} />)

    expect(screen.getByText("0:09")).toBeInTheDocument()
  })

  test("renders correctly when time is greater than 10", () => {
    render(<Time time={11} />)

    expect(screen.getByText("0:11")).toBeInTheDocument()
  })

  test("renders correctly when time is greater than 60", () => {
    render(<Time time={61} />)

    expect(screen.getByText("1:01")).toBeInTheDocument()
  })

  test("renders correctly when time is greater than 600", () => {
    render(<Time time={601} />)

    expect(screen.getByText("10:01")).toBeInTheDocument()
  })

  test("snapshot", () => {
    const { asFragment } = render(<Time time={601} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
