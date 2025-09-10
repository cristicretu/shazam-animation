import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

// Sample song data
const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: "2:54",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center"
  }
]

function SongItem({ song }: { song: typeof songs[0] }) {
  return (
    <div className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors duration-200">
      {/* Album Cover */}
      <img 
        src={song.image} 
        alt={`${song.title} album cover`}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      
      {/* Song Info */}
      <div className="flex-1 ml-4 min-w-0">
        <h3 className="font-medium text-white truncate">{song.title}</h3>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
      </div>
      
      {/* Duration */}
      <div className="text-gray-500 text-sm font-mono ml-4">
        {song.duration}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-3">
        {songs.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    </div>
  )
}
