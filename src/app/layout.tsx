import "./globals.css"
import NavBar from "../components/navBar/NavBar"
import MusicPlayer from "@/components/musicPlayer/MusicPlayer"
import { UserProvider } from "../context/UserContext"
import { PlaylistProvider } from "../context/PlaylistContext"

export const revalidate = 30

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
          <NavBar />
          <PlaylistProvider>
            {children}
            <MusicPlayer />
          </PlaylistProvider>
        </UserProvider>
      </body>
    </html>
  )
}
