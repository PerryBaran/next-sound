import './globals.css'
import NavBar from '../components/navBar/NavBar'
import { UserProvider } from '../context/UserContext'
import { PlaylistProvider } from '../context/PlaylistContext'

export const revalidate = 100

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserProvider>
          <PlaylistProvider>
            <NavBar />
            {children}
          </PlaylistProvider>
        </UserProvider>
      </body>
    </html>
  )
}
