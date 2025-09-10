import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { AudioLines } from 'lucide-react'
import { AudioLines as AnimatedAudioLines } from '@/components/animate-ui/icons/audio-lines'
import { TextScramble } from '@/components/ui/text-scramble'
import { motion, AnimatePresence } from 'motion/react'
import { parseBlob } from 'music-metadata'

export const Route = createFileRoute('/')({
  component: App,
})

// Sample song data
const songs = [
  {
    id: 1,
    title: "Suffocation (Slowed)",
    artist: "Crystal Castles - Lewis",
    duration: "5:04",
    audioSrc: "/songs/Crystal Castles Suffocation _Slowed_ - Lewis - SoundLoadMate.com.mp3"
  },
  {
    id: 2,
    title: "ｉｎｇｌｅｓｉｄｅ",
    artist: "90sFlav",
    duration: "1:24",
    audioSrc: "/songs/ｉｎｇｌｅｓｉｄｅ - 90sFlav - SoundLoadMate.com.mp3"
  },
  {
    id: 3,
    title: "Kona",
    artist: "Alan Fitzpatrick & CamelPhat",
    duration: "6:22",
    audioSrc: "/songs/Premiere_ Alan Fitzpatrick _ CamelPhat _Kona_ - Mixmag - SoundLoadMate.com.mp3"
  }
]

// Function to extract album artwork from audio file
async function extractAlbumArt(audioSrc: string): Promise<string | null> {
  try {
    const response = await fetch(audioSrc)
    const blob = await response.blob()
    const metadata = await parseBlob(blob)
    
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0]
      const base64String = btoa(
        new Uint8Array(picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      return `data:${picture.format};base64,${base64String}`
    }
    return null
  } catch (error) {
    console.error('Error extracting album art:', error)
    return null
  }
}

function SongButton({ 
  songNumber, 
  song, 
  isThisListening, 
  isAnyListening, 
  onStartListening, 
  onStopListening 
}: { 
  songNumber: number
  song: typeof songs[0]
  isThisListening: boolean
  isAnyListening: boolean
  onStartListening: () => void
  onStopListening: () => void
}) {
  const [showArtist, setShowArtist] = useState(false)
  const [showDuration, setShowDuration] = useState(false)
  const [titleText, setTitleText] = useState(`SONG ${songNumber}`)
  const [shouldScrambleTitle, setShouldScrambleTitle] = useState(false)
  const [albumArt, setAlbumArt] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Effect to extract album art when component mounts
  useEffect(() => {
    if (song.audioSrc && !albumArt) {
      extractAlbumArt(song.audioSrc).then(setAlbumArt)
    }
  }, [song.audioSrc, albumArt])

  // Effect to handle audio playback
  useEffect(() => {
    if (isThisListening && song.audioSrc && audioRef.current) {
      audioRef.current.play().catch(console.error)
      setIsPlaying(true)
    }
    // Don't pause when listening stops - let it continue playing
  }, [isThisListening, song.audioSrc])

  // Effect to stop this audio when another song starts listening
  useEffect(() => {
    if (isAnyListening && !isThisListening && audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [isAnyListening, isThisListening, isPlaying])

  const handleClick = () => {
    // If this song is revealed, toggle play/pause
    if (showArtist && song.audioSrc && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Stop any other playing audio first
        onStartListening() // This will trigger stopping other audio
        setTimeout(() => {
          onStopListening() // End listening state immediately
          if (audioRef.current) {
            audioRef.current.play().catch(console.error)
            setIsPlaying(true)
          }
        }, 0)
      }
      return
    }
    
    // Disable click if any button is listening
    if (isAnyListening) return
    
    // Start listening phase for unrevealed songs
    onStartListening()
    
    const randomDelay = Math.random() < 0.5 ? 1000 : 3000
    const totalDelay = 3000 + randomDelay
    
    setTimeout(() => {
      // Stop listening and start revealing
      onStopListening()
      setShouldScrambleTitle(true)
      setTitleText(song.title)
      
      // Show artist and duration immediately with the reveal
      setShowArtist(true)
      setShowDuration(true)
    }, totalDelay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }

  return (
    <motion.div 
      className={`p-6 bg-neutral-800/50 rounded-lg transition-colors duration-200 min-h-[96px] flex items-center ${
        isAnyListening && !isThisListening 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:bg-neutral-800/70'
      }`}
      onClick={handleClick}
      whileHover={isAnyListening && !isThisListening ? {} : { scale: 1.02 }}
      whileTap={isAnyListening && !isThisListening ? {} : { scale: 0.98 }}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Album Art or Icon */}
            {showArtist && albumArt ? (
              <div className="relative">
                <img 
                  src={albumArt} 
                  alt="Album artwork"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                {/* Play/Pause indicator */}
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : !isThisListening ? (
              <AudioLines className={`w-8 h-8 ${showArtist ? 'text-green-400' : 'text-neutral-400'}`} />
            ) : (
              <AnimatedAudioLines 
                className="w-8 h-8 text-blue-400" 
                size={32}
                animate
              />
            )}
            
            <div>
              {/* Title - shows SONG X, then scrambles to actual title */}
              <TextScramble
                className="text-white text-lg font-medium"
                trigger={shouldScrambleTitle}
                duration={0.8}
                as="h3"
              >
                {titleText}
              </TextScramble>
              
              {/* Artist - appears after title is revealed */}
              <AnimatePresence>
                {showArtist && (
                  <motion.p
                    initial={{ 
                      opacity: 0, 
                      y: 10,
                      filter: "blur(10px)"
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      filter: "blur(0px)"
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="text-neutral-400 text-sm"
                  >
                    {song.artist}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Duration - appears last */}
          <AnimatePresence>
            {showDuration && (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  x: 20,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  filter: "blur(0px)"
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="text-neutral-500 text-sm font-mono"
              >
                {song.duration}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Hidden audio element for playback */}
      {song.audioSrc && (
        <audio
          ref={audioRef}
          src={song.audioSrc}
          preload="metadata"
          style={{ display: 'none' }}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </motion.div>
  )
}

function App() {
  const [listeningButtonId, setListeningButtonId] = useState<number | null>(null)

  const handleStartListening = (buttonId: number) => {
    setListeningButtonId(buttonId)
  }

  const handleStopListening = () => {
    setListeningButtonId(null)
  }

  return (  
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        {songs.map((song, index) => (
          <SongButton 
            key={song.id} 
            songNumber={index + 1} 
            song={song}
            isThisListening={listeningButtonId === song.id}
            isAnyListening={listeningButtonId !== null}
            onStartListening={() => handleStartListening(song.id)}
            onStopListening={handleStopListening}
          />
        ))}
      </div>
    </div>
  )
}