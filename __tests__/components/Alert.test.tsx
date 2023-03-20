import { render, screen } from "@testing-library/react"
import Alert from "../../src/components/alert/Alert"

describe("Alert", () => {
  test("if passed a truthy message, message is rendered to screen", () => {
    const message = "test"
    render(<Alert message={message} />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  test("if passed a falsey message, returns null", () => {
    const { container } = render(<Alert message="" />)

    expect(container).toBeEmptyDOMElement()
  })

  describe("snapshots", () => {
    test("truthy message snapshot", () => {
      const { asFragment } = render(<Alert message="test" />)

      expect(asFragment()).toMatchSnapshot()
    })

    test("falsey message snapshot", () => {
      const { asFragment } = render(<Alert message="" />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
