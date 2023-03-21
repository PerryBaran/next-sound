import { fireEvent, render, screen } from "@testing-library/react"
import Confirm from "../../src/components/confirm/Confirm"

describe("Confirm", () => {
  let props = {
    callback: jest.fn(),
    setConfirm: jest.fn()
  }

  beforeEach(() => {
    props = {
      callback: jest.fn(),
      setConfirm: jest.fn()
    }
  })

  test("renders correctly", () => {
    render(<Confirm {...props} />)

    expect(screen.getByRole("heading")).toHaveTextContent(/are you sure?/i)
    expect(screen.getByText(/yes/i)).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByText(/no/i)).toBeInstanceOf(HTMLButtonElement)
  })

  test("yes button click", () => {
    render(<Confirm {...props} />)

    expect(props.callback).toBeCalledTimes(0)
    expect(props.setConfirm).toBeCalledTimes(0)

    fireEvent.click(screen.getByText(/yes/i))

    expect(props.callback).toBeCalledTimes(1)
    expect(props.setConfirm).toBeCalledTimes(1)
    expect(props.setConfirm).toBeCalledWith("")
  })

  test("no button click", () => {
    render(<Confirm {...props} />)

    expect(props.callback).toBeCalledTimes(0)
    expect(props.setConfirm).toBeCalledTimes(0)

    fireEvent.click(screen.getByText(/no/i))

    expect(props.callback).toBeCalledTimes(0)
    expect(props.setConfirm).toBeCalledTimes(1)
    expect(props.setConfirm).toBeCalledWith("")
  })

  test("snapshot", () => {
    const { asFragment } = render(<Confirm {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
