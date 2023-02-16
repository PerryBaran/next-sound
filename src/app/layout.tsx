import './globals.css'
import NavBar from "../components/NavBar"
import UserContext from '../context/UserContext'
import PlaylistContext from '../context/PlaylistContext'

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
          <PlaylistContext>
            <NavBar />
            {children}
          </PlaylistContext>
        </UserContext>
      </body>
    </html>
  )
}
