import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'

global.crypto.randomUUID = () => {
  return Math.random()
}