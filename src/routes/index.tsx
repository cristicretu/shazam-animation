import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AudioLines } from 'lucide-react'
import { AudioLines as AnimatedAudioLines } from '@/components/animate-ui/icons/audio-lines'
import { motion, AnimatePresence } from 'motion/react'

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
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: "2:54",
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
  }
]

type SongState = 'idle' | 'listening' | 'revealed'

function SongButton({ songNumber, song }: { songNumber: number, song: typeof songs[0] }) {
  const [state, setState] = useState<SongState>('idle')

  const handleClick = () => {
    if (state !== 'idle') return
    
    setState('listening')
    
    const randomDelay = Math.random() < 0.5 ? 1000 : 3000
    const totalDelay = 3000 + randomDelay
    
    setTimeout(() => {
      setState('revealed')
    }, totalDelay)
  }

  return (
    <motion.div 
      className="p-6 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800/70 transition-colors duration-200"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-4"
          >
            <AudioLines className="w-8 h-8 text-neutral-400" />
            <span className="text-white text-lg font-medium">SONG {songNumber}</span>
          </motion.div>
        )}
        
        {state === 'listening' && (
          <motion.div
            key="listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-4"
          >
            <AnimatedAudioLines 
              className="w-8 h-8 text-blue-400" 
              size={32}
              animate
            />
            <span className="text-blue-400 text-lg font-medium">Listening...</span>
          </motion.div>
        )}
        
        {state === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <AudioLines className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-medium">{song.title}</h3>
                <p className="text-neutral-400 text-sm">{song.artist}</p>
              </div>
            </div>
            <div className="text-neutral-500 text-sm font-mono">
              {song.duration}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        {songs.map((song, index) => (
          <SongButton key={song.id} songNumber={index + 1} song={song} />
        ))}
      </div>
    </div>
  )
}