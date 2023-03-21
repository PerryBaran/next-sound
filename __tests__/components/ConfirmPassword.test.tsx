import { fireEvent, render, screen } from "@testing-library/react"
import ConfirmPassword from "../../src/components/confirmPassword/ConfirmPassword"

describe("ConfirmPassword", () => {
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
    render(<ConfirmPassword {...props} />)

    expect(screen.getByRole("form")).toBeTruthy()
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute("type", "password")
    expect(screen.getByText(/^confirm$/i)).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByText(/cancel/i)).toBeInstanceOf(HTMLButtonElement)
  })

  test("confirm button", () => {
    render(<ConfirmPassword {...props} />)

    const confirmButton = screen.getByText(/^confirm$/i)

    expect(props.callback).toBeCalledTimes(0)

    fireEvent.click(confirmButton)

    expect(props.callback).toBeCalledTimes(1)
    expect(props.callback).toBeCalledWith("")

    const password = "test"
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: password }})
    fireEvent.click(confirmButton)

    expect(props.callback).toBeCalledTimes(2)
    expect(props.callback).toBeCalledWith(password)
  })

  test("cancel button", () => {
    render(<ConfirmPassword {...props} />)

    expect(props.setConfirm).toBeCalledTimes(0)

    fireEvent.click(screen.getByText(/cancel/i))

    expect(props.setConfirm).toBeCalledTimes(1)
    expect(props.setConfirm).toBeCalledWith("")
  })

  test("snapshot", () => {
    const { asFragment } = render(<ConfirmPassword {...props} />)

    expect(asFragment()).toMatchSnapshot()
  })
})