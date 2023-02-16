import './globals.css'
import NavBar from "../components/NavBar"
import UserContext from '../context/UserContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserContext>
          <NavBar />
          {children}
        </UserContext>
      </body>
    </html>
  )
}
