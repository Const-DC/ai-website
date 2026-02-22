'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Site Settings Interface
interface SiteSettings {
  profileName: string
  profilePic: string
  profileMood: string
  profileBio: string
  musicTitle: string
  musicArtist: string
  musicAlbumArt: string
  musicYoutubeId: string
  aboutMeImage: string
  aboutMeText: string
  meetImage: string
  backgroundImage: string
  introGif: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  bgColor: string
  openrouterApiKey?: string
  openrouterModel?: string
  aiPersona?: string
}

// Default settings
const defaultSettings: SiteSettings = {
  profileName: 'const.js',
  profilePic: 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg',
  profileMood: 'studying',
  profileBio: 'im a guy',
  musicTitle: '420',
  musicArtist: 'MACINTOSH PLUS',
  musicAlbumArt: 'https://m.media-amazon.com/images/I/81BbQMTakEL._UF1000,1000_QL80_.jpg',
  musicYoutubeId: 'hI302pJcB5Y',
  aboutMeImage: 'https://64.media.tumblr.com/5019b04d38d5c58b8d826eb8b9f22f39/34275822159c4776-88/s400x600/0f21dc869dad6bd910791ee4a685be5756e5af62.pnj',
  aboutMeText: 'I love coding, anime, and late-night programming sessions! 💻🌙',
  meetImage: 'https://i.pinimg.com/originals/b1/45/61/b14561c3f4a5078244f7ccaf62f6bd53.gif',
  backgroundImage: 'https://media1.tenor.com/m/zVOKTGRnA8kAAAAd/water-lake.gif',
  introGif: 'https://media1.tenor.com/m/7yzbOZ0f8PcAAAAC/cute.gif',
  primaryColor: '#b07ded',
  secondaryColor: '#9b6dd9',
  accentColor: '#c9abff',
  textColor: '#e0b0ff',
  bgColor: 'rgba(30, 20, 50, 0.7)',
  openrouterApiKey: '',
  openrouterModel: 'openai/gpt-4o-mini',
  aiPersona: `Your name is Const.js. Real name Adithyan M.P. You are 17, from Thrissur Kerala India. Born June 2008. Instagram: const.rb Discord: const.js. You code, watch anime, play games.

You MUST:
- Always remember your name is Const.js/Adithyan when asked
- Use lowercase always
- Say "bruh" normally (not "brugah" or weird variations)
- Keep responses very short, like 1 sentence
- Be chill, slightly bored/annoyed vibe
- Use "idk" "fr" "wtf" "dude" "like" casually
- Put "?" after confused statements: "huh ?" "wait what ?"

NEVER:
- Use emojis
- Say "hey there" "what's up" "how are you"
- Use exclamation marks (almost never)
- Act confused about who you are
- Write long responses
- Be overly helpful or friendly

Example good responses:
User: "who are you"
You: "im const.js bruh"
User: "hello"  
You: "yo"
User: "whats up"
You: "nothin much"
User: "can you help me"
You: "idk maybe, with what"`
}

// Intro Overlay Component with dynamic color extraction
const IntroOverlay = ({ introGif }: { introGif: string }) => {
  const [visible, setVisible] = useState(true)
  const [borderColor, setBorderColor] = useState('#1a0a2e')
  
  useEffect(() => {
    // Extract dominant color from intro GIF
    const extractColor = async () => {
      try {
        const res = await fetch(`/api/color-extract?url=${encodeURIComponent(introGif)}`)
        const data = await res.json()
        if (data.hex) {
          setBorderColor(data.hex)
        }
      } catch (e) {
        // Use default purple
      }
    }
    extractColor()
    
    // Hide after 7 seconds (fade handled by AnimatePresence)
    const hideTimer = setTimeout(() => setVisible(false), 7000)
    return () => {
      clearTimeout(hideTimer)
    }
  }, [introGif])
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, transparent 40%, ${borderColor}90 70%, ${borderColor} 100%)`
          }}
        >
          <motion.img
            src={introGif}
            alt="Intro"
            className="max-w-[85vw] max-h-[85vh] object-contain"
            style={{
              borderRadius: '16px',
              boxShadow: `0 0 80px ${borderColor}, 0 0 150px ${borderColor}60, inset 0 0 60px ${borderColor}40`
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Full CSS Styles matching the original - Now with dynamic settings!
const GlobalStyles = ({ 
  backgroundImage = 'https://media1.tenor.com/m/zVOKTGRnA8kAAAAd/water-lake.gif',
  introGif = 'https://media1.tenor.com/m/7yzbOZ0f8PcAAAAC/cute.gif'
}: { 
  backgroundImage?: string
  introGif?: string
}) => (
  <style jsx global>{`
    /* --- BASE & FONTS --- */
    html, body {
      background: url(${backgroundImage}) no-repeat fixed !important;
      background-size: cover !important;
      font-family: monospace;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      min-height: -webkit-fill-available;
      -webkit-tap-highlight-color: transparent;
    }

    /* Mobile viewport fix */
    html {
      height: -webkit-fill-available;
    }

    /* Prevent body scroll when modal is open */
    body.modal-open {
      overflow: hidden;
      position: fixed;
      width: 100%;
    }

    /* NOISE EFFECT */
    body::after {
      content: " ";
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0.3) 50%, rgba(0, 0, 0, 0.1) 50%);
      z-index: 99999 !important;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    /* Only show custom cursor on desktop */
    @media (pointer: fine) {
      * {
        cursor: url(https://cur.cursors-4u.net/symbols/sym-1/sym57.cur), auto !important;
      }
    }

    /* Touch-friendly inputs on mobile */
    input, textarea, button {
      font-size: 16px !important; /* Prevents iOS zoom on focus */
    }

    /* Safe area for notched phones */
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    /* --- ANIMATION KEYFRAMES --- */
    @keyframes float {
      0% { transform: translate(0, 0px); }
      50% { transform: translate(0, 8px); }
      100% { transform: translate(0, -0px); }
    }

    @keyframes blink {
      from, to { color: transparent; }
      50% { color: #c9abff; }
    }

    @keyframes slideIn {
      0% { opacity: 0; transform: translateX(-20px); }
      100% { opacity: 1; transform: translateX(0); }
    }

    @keyframes equalize {
      0% { height: 5px; }
      50% { height: 20px; }
      100% { height: 5px; }
    }

    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(30, 20, 50, 0.5);
    }
    ::-webkit-scrollbar-thumb {
      background: #b07ded;
      border-radius: 4px;
    }
  `}</style>
)

// Navigation Component - Fixed & Aesthetic
const Navigation = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tappedItem, setTappedItem] = useState<string | null>(null)
  
  const navItems = ['Home', 'Browse', 'Search', 'Messages', 'Blog', 'Bulletins', 'Forum', 'Groups', 'Layouts', 'Favs', 'Invite', 'App', 'Shop', 'About']
  
  return (
    <nav className="sticky top-0 z-[100] mb-2">
      {/* Main Header */}
      <motion.div 
        className="flex items-center justify-between px-3 py-2 md:px-4 rounded-t-lg"
        style={{
          background: 'linear-gradient(135deg, #b07ded, #9b6dd9)',
          border: '2px solid #8567d7',
          borderBottom: 'none',
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.a 
          href="#" 
          className="text-xl md:text-2xl font-bold text-white whitespace-nowrap"
          style={{ fontFamily: 'Arial, sans-serif', textDecoration: 'none', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ★ MySpace
        </motion.a>
        
        {/* Search - Hidden on mobile */}
        <form className="hidden md:flex items-center gap-2" onSubmit={e => e.preventDefault()}>
          <label className="text-white text-xs">Search:</label>
          <input 
            type="text" 
            className="px-2 py-1 text-xs border border-white/30 rounded bg-white/20 text-white placeholder-white/50 w-24" 
            autoComplete="off" 
            placeholder="users..."
          />
          <motion.button 
            type="submit" 
            className="px-3 py-1 text-xs bg-white text-purple-700 rounded font-bold"
            whileHover={{ scale: 1.05, backgroundColor: '#f0e6ff' }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </form>
        
        {/* Auth Links */}
        <div className="flex items-center gap-1 md:gap-2 text-xs text-white whitespace-nowrap">
          <motion.a 
            href="#" 
            className="px-2 py-1 rounded"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            Help
          </motion.a>
          <span className="hidden sm:inline">|</span>
          <motion.a 
            href="#" 
            className="px-2 py-1 rounded font-bold"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            LogIn
          </motion.a>
          <span className="hidden sm:inline">|</span>
          <motion.a 
            href="#" 
            className="px-2 py-1 rounded"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            SignUp
          </motion.a>
        </div>
      </motion.div>
      
      {/* Navigation Links */}
      <motion.ul 
        className="flex flex-wrap justify-center gap-x-1 gap-y-0 px-2 py-2 text-xs text-white rounded-b-lg"
        style={{
          background: 'linear-gradient(135deg, #9b6dd9, #8567d7)',
          border: '2px solid #7a4ecf',
          borderTop: 'none',
          listStyle: 'none',
          margin: 0
        }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {navItems.map((item, i) => (
          <motion.li 
            key={i} 
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
          >
            <motion.a 
              href="#" 
              className="px-1 py-1 rounded font-bold whitespace-nowrap"
              style={{ 
                textShadow: '0 0 7px rgba(255,255,255,0.55)', 
                textDecoration: 'none',
                color: tappedItem === item ? '#ffd700' : 'white'
              }}
              whileHover={{ 
                scale: 1.1, 
                color: '#ffd700',
                textShadow: '0 0 15px rgba(255,215,0,0.8)'
              }}
              whileTap={{ 
                scale: 0.9, 
                color: '#ffd700'
              }}
              onHoverStart={() => setHoveredItem(item)}
              onHoverEnd={() => setHoveredItem(null)}
              onTouchStart={() => setTappedItem(item)}
              onTouchEnd={() => setTimeout(() => setTappedItem(null), 300)}
            >
              {item}
            </motion.a>
            {i < navItems.length - 1 && (
              <motion.span 
                className="mx-0.5 text-white/70"
                animate={{ rotate: hoveredItem === item ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ☆
              </motion.span>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  )
}

// Profile Section - Now with dynamic settings!
const ProfileSection = ({ 
  name = 'const.js', 
  pic = 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg',
  mood = 'studying',
  bio = 'im a guy'
}: { 
  name?: string
  pic?: string
  mood?: string
  bio?: string
}) => (
  <div className="mb-4">
    <h1 className="text-lg font-bold mb-3" style={{ color: 'white' }}>{name}</h1>
    <div className="mb-4">
      <div className="w-40 h-48 mx-auto rounded-lg border-4 overflow-hidden" style={{
        borderColor: '#dcd6ff',
        borderStyle: 'double',
        boxShadow: '0 0 15px #c9b7ec'
      }}>
        <img 
          src={pic} 
          alt={`${name}'s profile picture`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
    <div className="text-center mb-4 p-3 rounded-lg" style={{
      background: 'rgba(30, 20, 50, 0.7)',
      border: '3px inset #c8aaff',
      color: '#e0b0ff'
    }}>
      <p className="text-sm italic mb-1">"{mood}"</p>
      <p className="text-xs">{bio}</p>
      <p className="text-xs mt-1">Last active: <br /> 2 hours ago</p>
      <p className="mt-2 text-xs font-bold" style={{ color: '#b07ded' }}>
        <span className="inline-block w-2 h-2 rounded-full animate-pulse mr-1" style={{ background: '#b07ded' }}></span>
        ONLINE!
      </p>
    </div>
    <div className="p-3 rounded-lg text-xs mb-4" style={{
      background: 'rgba(30, 20, 50, 0.7)',
      border: '3px inset #c8aaff',
      color: '#e0b0ff'
    }}>
      <p><b>Mood:</b> {mood}</p>
      <p className="mt-1">
        <b>View my:</b>{' '}
        <a href="#" className="text-pink-300 hover:text-pink-200">Blog</a>
        {' | '}
        <a href="#" className="text-pink-300 hover:text-pink-200">Forum Topics</a>
      </p>
    </div>
  </div>
)

// Contact Box with GIF icons - Now with functional buttons!
const ContactBox = ({ onOpenChat }: { onOpenChat?: () => void }) => {
  const [showToast, setShowToast] = useState<string | null>(null)

  const handleAction = (action: string, callback?: () => void) => {
    setShowToast(action)
    if (callback) callback()
    setTimeout(() => setShowToast(null), 3000)
  }

  const contactActions = [
    { gif: 'https://64.media.tumblr.com/7708f868dc26be83f356994b059574dc/947f5e53c6e30b8e-c6/s75x75_c1/54a1d19d41346daa38f7022072bf893393e1d48f.gifv', text: 'Add to Friends', message: 'Friend request sent! 💜' },
    { gif: 'https://64.media.tumblr.com/8f2873c1bf4abe15f130cb90aab5b880/de16010b85cc64d8-dd/s75x75_c1/58952615f0cb65279bd5f1aeb20a44f41141db94.gifv', text: 'Add to Favorites', message: 'Added to favorites! ⭐' },
    { gif: 'https://64.media.tumblr.com/2ddf249c6a28d23959c782e7056da23b/e386af749187d014-61/s75x75_c1/37b07bfef349d68ff5a76ca29f651e50082a63eb.gifv', text: 'Send Message', message: 'Message window opened! 📧' },
    { gif: 'https://64.media.tumblr.com/4df60e412e2774d70f3badefc5ee0475/50a86d7dbc813001-5f/s75x75_c1/b12f370a4052ba27029bd51144e2fb899775cdf0.gifv', text: 'Forward to Friend', message: 'Forward dialog opened! ↗️' },
    { gif: 'https://64.media.tumblr.com/02c88dcb6a4fbe7e9be7dd856003bcbf/50a86d7dbc813001-90/s75x75_c1/2de77306f1d926519f2eb9cf93fe8b5108a59f41.gifv', text: 'Instant Message', message: 'Opening chat... 💬', isChat: true },
    { gif: 'https://64.media.tumblr.com/9e115c51c30ed1e8b665580227028149/cc1839e6baf4e1c1-97/s75x75_c1/0b35f44eda9d308092e4293f251a8a4e34ac2f6d.gifv', text: 'Block User', message: 'User blocked! 🚫' },
    { gif: 'https://64.media.tumblr.com/f173b196e3889b1d9ad6a21746e205d8/29429a2fed66c7ab-c7/s75x75_c1/2ca07f7d05d9b4dafe9b6aa678ec53e8f9e51f5d.gifv', text: 'Add to Group', message: 'Select a group... 👥' },
    { gif: 'https://64.media.tumblr.com/11c565ec5a80aed4229fd85cad87ce24/457ad034c51ea48d-40/s75x75_c1/537e7763ce40d3db686a7f0ba373728a660b516d.gifv', text: 'Report User', message: 'Report submitted! ⚠️' }
  ]

  return (
    <>
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-20 left-1/2 z-[999] px-6 py-3 rounded-lg text-white text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #b07ded, #9b6dd9)',
              boxShadow: '0 4px 20px rgba(176, 125, 237, 0.5)',
              border: '2px solid white'
            }}
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mb-4 rounded-lg overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-3 py-2 text-xs font-bold" style={{
          background: 'linear-gradient(135deg, #c9abff, #b07ded)',
          color: 'white',
          textShadow: '1px 1px 0 #7a4ecf',
          border: '2px solid white',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0'
        }}>
          Contacting const.js
        </div>
        <div className="p-2 text-xs" style={{
          background: 'rgba(30, 20, 50, 0.7)',
          border: '3px inset #c8aaff',
          borderTop: 'none',
          color: '#e0b0ff'
        }}>
          <div className="grid grid-cols-2 gap-1">
            {contactActions.map((item, i) => (
              <motion.button
                key={i}
                onClick={() => handleAction(item.message, item.isChat ? onOpenChat : undefined)}
                className="flex items-center gap-1 p-2 rounded text-left"
                style={{ textDecoration: 'none', background: 'transparent', minHeight: '44px' }}
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(176, 125, 237, 0.2)',
                  x: 2
                }}
                whileTap={{ 
                  scale: 0.95, 
                  backgroundColor: 'rgba(176, 125, 237, 0.4)'
                }}
              >
                <motion.img 
                  src={item.gif} 
                  alt="" 
                  className="w-6 h-6"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  whileTap={{ scale: 1.2, rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.3 }}
                />
                <span className="text-xs" style={{ color: '#e0b0ff' }}>{item.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

// URL Info
const UrlInfo = () => (
  <div className="mb-4 p-3 rounded-lg text-xs" style={{
    background: 'rgba(30, 20, 50, 0.7)',
    border: '3px inset #c8aaff',
    color: '#e0b0ff'
  }}>
    <p><b>Profile URL:</b></p>
    <p className="mt-1" style={{ color: '#d4c4f9' }}>https://myspace.com/const_js</p>
  </div>
)

// Animated Music Bars Component
const AnimatedBars = () => {
  const [bars, setBars] = useState([8, 12, 6, 14, 10, 8, 16])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 20 + 4))
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end gap-1 h-8">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-t-full"
          style={{
            background: 'linear-gradient(to top, #b07ded, #e0b0ff, #fff)',
            boxShadow: '0 0 10px #b07ded, 0 0 20px rgba(176, 125, 237, 0.5)'
          }}
          animate={{ height: `${height}px` }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

// Typing Animation Component
const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, 50 + delay)
    return () => clearTimeout(timeout)
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ color: '#e0b0ff' }}
      >|</motion.span>
    </span>
  )
}

// Glowing Orb Background
const GlowingOrb = ({ color, size, x, y }: { color: string, size: number, x: string, y: string }) => (
  <motion.div
    className="absolute rounded-full blur-xl opacity-30"
    style={{
      background: `radial-gradient(circle, ${color}, transparent)`,
      width: size,
      height: size,
      left: x,
      top: y,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

// Interests Table with framer-motion animations
const InterestsTable = () => {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [tappedItem, setTappedItem] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20, y: 10 },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  const animeList = ['Terror in Resonance', 'Planetes', 'Kokoro Connect', 'Shouwa Genroku Rakugo Shinjuu', 'Mononoke']
  const songs = ['Speakerboxxx — Outkast', 'Awaken, My Love! — Childish Gambino', 'IGOR — Tyler, The Creator', 'Blonde — Frank Ocean', 'Exmilitary — Death Grips']
  const movies = [
    { title: 'Shutter Island', plot: 'A U.S. Marshal investigates a disappearance at a hospital for the criminally insane, only to uncover a truth that shatters his reality.' },
    { title: 'Se7en', plot: 'Two detectives hunt a serial killer using the seven deadly sins as his motifs. A dark, rain-soaked masterpiece.' },
    { title: 'Interstellar', plot: 'Explorers travel through a wormhole to save humanity. A visual and emotional journey through time and space.' },
    { title: 'Fight Club', plot: 'An insomniac and a soap salesman form an underground fight club that spirals into anarchy and madness.' },
    { title: 'No Country for Old Men', plot: 'A hunter stumbles upon dead bodies, heroin, and over $2 million in cash, sparking a violent cat-and-mouse chase.' }
  ]
  const books = [
    { title: 'Reverend Insanity', desc: 'A story of a demonic cultivator, Fang Yuan, who pursues immortality with ruthless pragmatism.' },
    { title: 'Lord of the Mysteries (LOTM)', desc: 'Klein Moretti wakes up in a Victorian-era world filled with steam, machinery, and occult powers.' },
    { title: 'My Demon System', desc: 'A ruthless system guides the protagonist through a dark fantasy world. Action-packed and gritty.' }
  ]

  return (
    <motion.div 
      className="rounded-lg overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="px-3 py-2 text-xs font-bold"
        style={{
          background: 'linear-gradient(135deg, #c9abff 0%, #b07ded 50%, #9b6dd9 100%)',
          color: 'white',
          textShadow: '1px 1px 0 #7a4ecf',
          border: '2px solid white',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0'
        }}
        whileHover={{ scale: 1.01 }}
      >
        const.js&apos;s Interests
      </motion.div>
      
      <div className="p-2 relative overflow-hidden" style={{
        background: 'rgba(30, 20, 50, 0.7)',
        border: '3px inset #c8aaff',
        borderTop: 'none'
      }}>
        {/* Glowing orbs background */}
        <GlowingOrb color="#b07ded" size={100} x="10%" y="20%" />
        <GlowingOrb color="#e0b0ff" size={80} x="80%" y="60%" />
        <GlowingOrb color="#c9abff" size={60} x="50%" y="80%" />
        
        <table className="w-full text-xs border-collapse relative z-10">
          <tbody>
            {/* General */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>General</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="font-mono relative">
                  <motion.h1 
                    className="text-xl font-bold mb-1"
                    style={{ color: '#c9abff' }}
                    animate={{ 
                      textShadow: [
                        '0 0 10px #b07ded',
                        '0 0 20px #b07ded, 0 0 30px #e0b0ff',
                        '0 0 10px #b07ded'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TypewriterText text="CONST.JS" />
                  </motion.h1>
                  <motion.p 
                    className="text-xs mb-2"
                    style={{ color: '#b07ded', borderBottom: '2px dashed #8567d7', paddingBottom: '5px', display: 'inline-block' }}
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                  >
                    KERALA — JUNE 2008
                  </motion.p>
                  <div className="mt-3">
                    <h3 className="text-xs font-bold mb-2" style={{ color: '#e0b0ff', textTransform: 'uppercase' }}>✨ Underrated Anime</h3>
                    <motion.ul 
                      className="list-none p-0 m-0"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {animeList.map((anime, i) => (
                        <motion.li 
                          key={i}
                          variants={itemVariants}
                          className="py-2 px-1 cursor-pointer rounded"
                          onHoverStart={() => setHoveredItem(i)}
                          onHoverEnd={() => setHoveredItem(null)}
                          onTouchStart={() => setTappedItem(i)}
                          onTouchEnd={() => setTimeout(() => setTappedItem(null), 300)}
                          whileHover={{ 
                            x: 10, 
                            color: '#b07ded',
                            transition: { type: "spring", stiffness: 300 }
                          }}
                          whileTap={{ 
                            scale: 0.98,
                            x: 10,
                            backgroundColor: 'rgba(176, 125, 237, 0.1)'
                          }}
                          style={{ color: (hoveredItem === i || tappedItem === i) ? '#b07ded' : '#483D8B' }}
                        >
                          <motion.span
                            animate={{ rotate: (hoveredItem === i || tappedItem === i) ? 360 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block mr-1"
                          >
                            ✦
                          </motion.span>
                          {anime}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </td>
            </motion.tr>

            {/* Music */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>Music</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="flex items-center gap-3 mb-3">
                  <AnimatedBars />
                  <motion.h3 
                    className="text-xs font-bold"
                    style={{ color: '#483D8B', textTransform: 'uppercase', letterSpacing: '3px' }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Now Playing
                  </motion.h3>
                </div>
                <motion.ul 
                  className="list-none p-0 m-0 text-xs space-y-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {songs.map((song, i) => (
                    <motion.li 
                      key={i}
                      variants={itemVariants}
                      className="py-2 px-2 rounded cursor-pointer"
                      whileHover={{ 
                        scale: 1.02,
                        x: 5,
                        backgroundColor: 'rgba(176, 125, 237, 0.15)',
                        borderLeftWidth: 3,
                        borderLeftColor: '#b07ded'
                      }}
                      whileTap={{ 
                        scale: 0.98,
                        x: 5,
                        backgroundColor: 'rgba(176, 125, 237, 0.25)'
                      }}
                      style={{ borderLeft: '3px solid transparent' }}
                    >
                      <motion.span
                        className="inline-block mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      >
                        ♪
                      </motion.span>
                      {song}
                    </motion.li>
                  ))}
                </motion.ul>
              </td>
            </motion.tr>

            {/* Movies */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>Movies</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="font-mono">
                  <motion.div 
                    className="text-xs font-bold mb-2 p-1 rounded"
                    style={{ color: '#483D8B', textTransform: 'uppercase', letterSpacing: '4px', borderBottom: '2px solid #b07ded', paddingBottom: '5px', display: 'inline-block' }}
                    whileHover={{ letterSpacing: '6px', backgroundColor: 'rgba(176, 125, 237, 0.1)' }}
                    whileTap={{ scale: 0.98, letterSpacing: '6px' }}
                  >
                    🎬 Cinema
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {movies.map((movie, i) => (
                      <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="rounded overflow-hidden"
                        style={{ border: '1px solid rgba(176, 125, 237, 0.3)' }}
                      >
                        <motion.div
                          className="cursor-pointer text-xs font-bold p-3 flex justify-between items-center"
                          style={{ color: '#483D8B', background: 'rgba(176, 125, 237, 0.1)' }}
                          onClick={() => setSelectedMovie(selectedMovie === i ? null : i)}
                          whileHover={{ backgroundColor: 'rgba(176, 125, 237, 0.2)' }}
                          whileTap={{ scale: 0.98, backgroundColor: 'rgba(176, 125, 237, 0.3)' }}
                        >
                          <span>🎞️ {movie.title}</span>
                          <motion.span
                            animate={{ rotate: selectedMovie === i ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-purple-500 text-sm"
                          >
                            ▶
                          </motion.span>
                        </motion.div>
                        <AnimatePresence>
                          {selectedMovie === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="text-xs p-3"
                              style={{ color: '#4a4a4a', background: 'rgba(176, 125, 237, 0.05)', borderLeft: '3px solid #b07ded' }}
                            >
                              {movie.plot}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </td>
            </motion.tr>

            {/* Television */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>Television</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="font-mono">
                  <div className="text-xs font-bold mb-2" style={{ color: '#483D8B', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #b07ded', paddingBottom: '5px' }}>📺 Television</div>
                  <motion.details className="group">
                    <motion.summary 
                      className="cursor-pointer text-sm font-bold p-3 rounded"
                      style={{ color: '#b07ded' }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(176, 125, 237, 0.1)' }}
                      whileTap={{ scale: 0.98, backgroundColor: 'rgba(176, 125, 237, 0.2)' }}
                    >
                      🤖 DORAEMON
                    </motion.summary>
                    <motion.div 
                      className="text-xs p-3 rounded mt-1"
                      style={{ background: 'rgba(255,255,255,0.6)', color: '#4a4a4a', border: '1px solid #dcd6ff' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      A robotic cat named Doraemon travels back in time from the 22nd century to aid a pre-teen boy named Nobita. A timeless classic about friendship, gadgets, and adventure.
                    </motion.div>
                  </motion.details>
                </div>
              </td>
            </motion.tr>

            {/* Books */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>Books</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="font-mono">
                  <div className="text-xs font-bold mb-2" style={{ color: '#483D8B', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #b07ded', paddingBottom: '5px' }}>📚 Books</div>
                  <motion.div 
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {books.map((book, i) => (
                      <motion.details 
                        key={i} 
                        className="group"
                        variants={itemVariants}
                      >
                        <motion.summary 
                          className="cursor-pointer text-xs font-bold p-3 rounded"
                          style={{ color: '#b07ded' }}
                          whileHover={{ x: 5, backgroundColor: 'rgba(176, 125, 237, 0.1)' }}
                          whileTap={{ scale: 0.98, x: 5, backgroundColor: 'rgba(176, 125, 237, 0.2)' }}
                        >
                          📖 {book.title}
                        </motion.summary>
                        <motion.div 
                          className="text-xs p-3 rounded mt-1 border-l-2"
                          style={{ background: 'rgba(255,255,255,0.6)', borderColor: '#b07ded', color: '#4a4a4a' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {book.desc}
                        </motion.div>
                      </motion.details>
                    ))}
                  </motion.div>
                </div>
              </td>
            </motion.tr>

            {/* Heroes */}
            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
              <td className="p-2 font-bold w-1/3 align-top" style={{ background: 'linear-gradient(180deg, #d4c4f9, #c9b7ec)', color: 'white', border: '1px solid white' }}>Heroes</td>
              <td className="p-2 align-top" style={{ background: '#e8e0ff', color: '#4a4a4a', border: '1px solid white' }}>
                <div className="font-mono">
                  <div className="text-xs font-bold mb-2" style={{ color: '#483D8B', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #b07ded', paddingBottom: '5px' }}>🦸 Heroes</div>
                  <motion.details className="group">
                    <motion.summary 
                      className="cursor-pointer text-xs font-bold p-3 rounded"
                      style={{ color: '#b07ded' }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(176, 125, 237, 0.1)' }}
                      whileTap={{ scale: 0.98, backgroundColor: 'rgba(176, 125, 237, 0.2)' }}
                    >
                      🕷️ Spiderman
                    </motion.summary>
                    <motion.div 
                      className="p-4 rounded mt-1 text-center"
                      style={{ 
                        background: 'linear-gradient(135deg, #2e2442, #1a1a2e)', 
                        border: '2px solid #b07ded', 
                        boxShadow: '0 0 20px rgba(176, 125, 237, 0.5)' 
                      }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <motion.span 
                        className="text-5xl inline-block"
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🕷️
                      </motion.span>
                    </motion.div>
                  </motion.details>
                </div>
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// Blog Preview
const BlogPreview = () => (
  <div className="rounded-lg overflow-hidden mb-4">
    <div className="px-3 py-2 text-xs font-bold" style={{
      background: '#c9abff',
      color: 'white',
      textShadow: '1px 1px 0 #7a4ecf',
      border: '2px solid white',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0'
    }}>
      const.js&apos;s Latest Blog Entries [<a href="#" className="text-pink-200 hover:text-pink-100">View Blog</a>]
    </div>
    <div className="p-3 text-xs" style={{
      background: 'rgba(30, 20, 50, 0.7)',
      border: '3px inset #c8aaff',
      borderTop: 'none',
      color: '#e0b0ff'
    }}>
      <p className="mb-1">
        <span className="text-purple-200">IM NEW</span>
        {' '}(<a href="#" className="text-pink-300 hover:text-pink-200">view more</a>)
      </p>
    </div>
  </div>
)

// Blurbs Section (with CD Player embedded at top) - Now with dynamic settings!
const BlurbsSection = ({ 
  musicTitle, musicArtist, musicAlbumArt, musicYoutubeId,
  aboutMeImage, aboutMeText, meetImage 
}: { 
  musicTitle?: string
  musicArtist?: string
  musicAlbumArt?: string
  musicYoutubeId?: string
  aboutMeImage?: string
  aboutMeText?: string
  meetImage?: string
}) => (
  <div className="rounded-lg overflow-hidden mb-4">
    <div className="px-3 py-2 text-xs font-bold" style={{
      background: '#c9abff',
      color: 'white',
      textShadow: '1px 1px 0 #7a4ecf',
      border: '2px solid white',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0'
    }}>
      const.js&apos;s Blurbs
    </div>
    <div className="p-3 text-xs overflow-y-auto max-h-96" style={{
      background: 'rgba(30, 20, 50, 0.7)',
      border: '3px inset #c8aaff',
      borderTop: 'none',
      color: '#e0b0ff'
    }}>
      {/* CD Player embedded here with dynamic settings */}
      <div className="mb-4">
        <CDPlayerEmbedded 
          title={musicTitle}
          artist={musicArtist}
          albumArt={musicAlbumArt}
          youtubeId={musicYoutubeId}
        />
      </div>
      
      <div className="mb-4">
        <h4 className="font-bold mb-2 text-purple-200">About me:</h4>
        {aboutMeImage && <img src={aboutMeImage} alt="" className="w-full mb-2" />}
        <p className="mb-2">{aboutMeText}</p>
        <div className="flex flex-wrap gap-1 my-2">
          {['Made with 💜', 'XP User', 'Gamer', 'Hacker'].map((text, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded animate-pulse" style={{
              background: `linear-gradient(180deg, ${['#9933ff', '#3399ff', '#33ff33', '#ff3399'][i]}cc 0%, ${['#9933ff', '#3399ff', '#33ff33', '#ff3399'][i]} 100%)`,
              color: 'white',
              textShadow: '1px 1px 0 black'
            }}>
              {text}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-2 text-purple-200">Who I&apos;d like to meet:</h4>
        <motion.div 
          className="w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src={meetImage} 
            alt="Who I'd like to meet" 
            className="w-full max-w-md rounded-lg"
            style={{ boxShadow: '0 0 20px rgba(176, 125, 237, 0.5)' }}
            whileHover={{ scale: 1.02 }}
          />
        </motion.div>
      </div>
    </div>
  </div>
)

// Friend Space
const FriendSpace = () => (
  <div className="rounded-lg overflow-hidden mb-4">
    <div className="px-3 py-2 text-xs font-bold flex justify-between items-center" style={{
      background: '#c9abff',
      color: 'white',
      textShadow: '1px 1px 0 #7a4ecf',
      border: '2px solid white',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0'
    }}>
      <span>const.js&apos;s Friend Space</span>
      <a href="#" className="text-pink-200 hover:text-pink-100 font-normal">[view all]</a>
    </div>
    <div className="p-3 text-xs" style={{
      background: 'rgba(30, 20, 50, 0.7)',
      border: '3px inset #c8aaff',
      borderTop: 'none',
      color: '#e0b0ff'
    }}>
      <p className="mb-3"><b>const.js has <span className="text-pink-300">8</span> friends.</b></p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { name: 'CONST', img: 'https://i.pinimg.com/736x/f5/7d/3a/f57d3a87b048147bfe143aba5df42c39.jpg' },
          { name: 'D1zzy', img: 'https://i.pinimg.com/736x/d6/ad/06/d6ad0653025fd671dd0ce2af02c64109.jpg' },
          { name: 'Mariaandcats', img: 'https://i.pinimg.com/736x/08/2e/75/082e75901e7c4a14f1930ea67b29886c.jpg' },
          { name: 'mua', img: 'https://i.pinimg.com/736x/5a/b2/98/5ab2987780e1e9ee1a77a2f055a9b023.jpg' },
          { name: 'solh', img: 'https://i.pinimg.com/736x/93/8c/59/938c59b215862c1b3cacf763c1bb980b.jpg' },
          { name: 'santidwill', img: 'https://i.pinimg.com/736x/f8/49/b3/f849b31bf7ee7494327e9c471627d7a4.jpg' },
          { name: 'Myspace', img: 'https://i.pinimg.com/736x/39/95/05/399505936384b013c011bbbdf21bcd86.jpg' },
          { name: 'An', img: 'https://i.pinimg.com/736x/24/94/62/24946203a6b23ffa979abe8f83faab3d.jpg' }
        ].map((friend, i) => (
          <div key={i} className="text-center">
            <a href="#" className="block">
              <div className="w-12 h-12 mx-auto mb-1 rounded border-2 overflow-hidden" style={{ borderColor: '#dcd6ff' }}>
                <img src={friend.img} alt={friend.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-purple-200 hover:text-pink-300 truncate text-[10px]">{friend.name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Media Embedder Component - detects and embeds images, gifs, YouTube
const MediaEmbedder = ({ content }: { content: string }) => {
  // Parse content and detect media URLs
  const parseContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        const url = part
        
        // Check for YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        if (youtubeMatch) {
          return (
            <motion.div 
              key={i} 
              className="my-2 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ boxShadow: '0 0 15px rgba(176, 125, 237, 0.4)' }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                className="w-full h-40 rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          )
        }
        
        // Check for image/gif
        const imgMatch = url.match(/\.(gif|jpe?g|png|webp|bmp)(\?.*)?$/i)
        if (imgMatch) {
          return (
            <motion.a 
              key={i} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block my-2"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={url} 
                alt="Embedded media" 
                className="max-w-full h-auto rounded-xl border-2"
                style={{ 
                  borderColor: '#b07ded',
                  boxShadow: '0 0 15px rgba(176, 125, 237, 0.4)'
                }}
                loading="lazy"
              />
            </motion.a>
          )
        }
        
        // Regular link
        return (
          <a 
            key={i} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-300 hover:text-pink-200 underline break-all"
          >
            {url}
          </a>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return <div className="whitespace-pre-wrap break-words">{parseContent(content)}</div>
}

// Format relative time
const formatRelativeTime = (date: Date | string) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return past.toLocaleDateString()
}

// Comments Section with dual login (Admin + User)
const CommentsSection = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('user')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [userData, setUserData] = useState<{ name: string; avatar: string } | null>(null)
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [loginError, setLoginError] = useState('')
  const [comments, setComments] = useState<Array<{
    id: string
    author: string
    content: string
    avatar: string | null
    pinned: boolean
    isAdmin?: boolean
    createdAt: Date | string
  }>>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  // Show error toast for 3 seconds
  const showError = (msg: string) => {
    setErrorToast(msg)
    setTimeout(() => setErrorToast(null), 3000)
  }

  // Load comments from database on mount
  const loadComments = async () => {
    try {
      const res = await fetch('/api/comments')
      const data = await res.json()
      if (data.comments) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check auth status on mount
  useEffect(() => {
    // Check admin auth
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setIsAdmin(data.authenticated))
      .catch(() => setIsAdmin(false))
    
    // Check user auth
    fetch('/api/user-auth')
      .then(res => res.json())
      .then(data => {
        setIsUser(data.authenticated)
        if (data.user) {
          setUserData(data.user)
        }
      })
      .catch(() => setIsUser(false))
    
    loadComments()
  }, [])

  // Admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    const data = await res.json()
    
    if (data.success) {
      setIsAdmin(true)
      setShowLoginModal(false)
      setPassword('')
      setShowCommentModal(true)
    } else {
      setLoginError('Wrong password!')
    }
  }

  // User login
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (!userName.trim() || !userAvatar.trim()) {
      setLoginError('Name and avatar are required!')
      return
    }
    
    const res = await fetch('/api/user-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, avatar: userAvatar })
    })
    
    const data = await res.json()
    
    if (data.success) {
      setIsUser(true)
      setUserData(data.user)
      setShowLoginModal(false)
      setUserName('')
      setUserAvatar('')
      setShowCommentModal(true)
    } else {
      setLoginError(data.error || 'Login failed')
    }
  }

  // Post comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })
      
      const data = await res.json()
      
      if (data.success && data.comment) {
        setComments([data.comment, ...comments])
      } else {
        showError(data.error || 'Failed to post comment')
        loadComments()
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
      showError('Failed to post comment. Please try again.')
    }
    
    setNewComment('')
    setShowCommentModal(false)
  }

  // Delete comment (admin only)
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setComments(comments.filter(c => c.id !== id))
      } else {
        const data = await res.json()
        showError(data.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      showError('Failed to delete comment. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  // Pin/Unpin comment (admin only)
  const handlePin = async (id: string, currentPinned: boolean) => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pinned: !currentPinned })
      })
      
      const data = await res.json()
      
      if (data.success) {
        const updated = comments.map(c => 
          c.id === id ? { ...c, pinned: !currentPinned } : c
        )
        updated.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setComments(updated)
      } else {
        showError(data.error || 'Failed to pin comment')
      }
    } catch (error) {
      console.error('Failed to pin:', error)
      showError('Failed to pin comment. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddClick = () => {
    if (isAdmin || isUser) {
      setShowCommentModal(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const isLoggedIn = isAdmin || isUser

  return (
    <>
      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[99999] px-6 py-3 rounded-lg text-white text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
              border: '2px solid white'
            }}
          >
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="p-6 rounded-xl max-w-md w-full mx-4"
              style={{
                background: 'linear-gradient(135deg, #2e1f4e, #1a1030)',
                border: '3px solid #b07ded',
                boxShadow: '0 0 30px rgba(176, 125, 237, 0.5)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Mode Tabs */}
              <div className="flex gap-2 mb-4">
                <motion.button
                  onClick={() => setLoginMode('user')}
                  className="flex-1 py-3 rounded-lg font-bold text-sm"
                  style={{
                    background: loginMode === 'user' ? '#b07ded' : 'rgba(176, 125, 237, 0.2)',
                    color: 'white',
                    minHeight: '48px'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  👤 User Login
                </motion.button>
                <motion.button
                  onClick={() => setLoginMode('admin')}
                  className="flex-1 py-3 rounded-lg font-bold text-sm"
                  style={{
                    background: loginMode === 'admin' ? '#b07ded' : 'rgba(176, 125, 237, 0.2)',
                    color: 'white',
                    minHeight: '48px'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔐 Admin
                </motion.button>
              </div>

              {loginMode === 'admin' ? (
                <form onSubmit={handleAdminLogin}>
                  <h3 className="text-lg font-bold text-white mb-3 text-center">Admin Login</h3>
                  <p className="text-purple-300 text-xs mb-3 text-center">Enter admin password</p>
                  
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Admin password..."
                    className="w-full px-4 py-4 rounded-lg text-white mb-3 outline-none text-base"
                    style={{ background: 'rgba(30, 20, 50, 0.7)', border: '2px solid #b07ded', minHeight: '48px' }}
                    autoComplete="off"
                  />
                  
                  {loginError && (
                    <motion.p className="text-red-400 text-xs mb-3 text-center">{loginError}</motion.p>
                  )}
                  
                  <motion.button
                    type="submit"
                    className="w-full py-4 rounded-lg text-white font-bold text-base"
                    style={{ background: 'linear-gradient(135deg, #b07ded, #9b6dd9)', minHeight: '48px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login as Admin
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleUserLogin}>
                  <h3 className="text-lg font-bold text-white mb-3 text-center">User Login</h3>
                  <p className="text-purple-300 text-xs mb-3 text-center">Enter your name & profile image URL</p>
                  
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Your name..."
                    className="w-full px-4 py-4 rounded-lg text-white mb-2 outline-none text-base"
                    style={{ background: 'rgba(30, 20, 50, 0.7)', border: '2px solid #b07ded', minHeight: '48px' }}
                    autoComplete="off"
                  />
                  
                  <input
                    type="text"
                    value={userAvatar}
                    onChange={e => setUserAvatar(e.target.value)}
                    placeholder="Profile image URL (.gif, .jpg, .png)..."
                    className="w-full px-4 py-4 rounded-lg text-white mb-3 outline-none text-base"
                    style={{ background: 'rgba(30, 20, 50, 0.7)', border: '2px solid #b07ded', minHeight: '48px' }}
                    autoComplete="off"
                  />
                  
                  {userAvatar && (
                    <div className="flex justify-center mb-3">
                      <img 
                        src={userAvatar} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-xl border-2 object-cover"
                        style={{ borderColor: '#b07ded' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}
                  
                  {loginError && (
                    <motion.p className="text-red-400 text-xs mb-3 text-center">{loginError}</motion.p>
                  )}
                  
                  <motion.button
                    type="submit"
                    className="w-full py-4 rounded-lg text-white font-bold text-base"
                    style={{ background: 'linear-gradient(135deg, #b07ded, #9b6dd9)', minHeight: '48px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login as User
                  </motion.button>
                </form>
              )}
              
              <motion.button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 mt-3 rounded-lg text-purple-300 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ minHeight: '48px' }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="p-6 rounded-xl max-w-md w-full mx-4"
              style={{
                background: 'linear-gradient(135deg, #2e1f4e, #1a1030)',
                border: '3px solid #b07ded',
                boxShadow: '0 0 30px rgba(176, 125, 237, 0.5)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={isAdmin 
                    ? 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg' 
                    : userData?.avatar || ''
                  } 
                  alt="Your avatar" 
                  className="w-12 h-12 rounded-xl border-2"
                  style={{ borderColor: '#b07ded' }}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isAdmin ? 'const.js' : userData?.name}
                  </h3>
                  <p className="text-purple-300 text-xs">
                    {isAdmin ? '👑 Admin' : '👤 User'}
                  </p>
                </div>
              </div>
              
              <p className="text-purple-300 text-[10px] mb-3 opacity-70">
                💡 Tip: Paste image/GIF links or YouTube URLs to embed media!
              </p>
              
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full px-4 py-4 rounded-lg text-white mb-3 outline-none resize-none text-base"
                style={{ background: 'rgba(30, 20, 50, 0.7)', border: '2px solid #b07ded', minHeight: '120px', fontSize: '16px' }}
              />
              
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setShowCommentModal(false)}
                  className="flex-1 py-4 rounded-lg text-white font-bold text-base"
                  style={{ background: '#444', minHeight: '48px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleAddComment}
                  className="flex-1 py-4 rounded-lg text-white font-bold text-base"
                  style={{ background: 'linear-gradient(135deg, #b07ded, #9b6dd9)', minHeight: '48px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Post Comment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="px-3 py-2 text-xs font-bold" style={{
          background: 'linear-gradient(135deg, #c9abff, #b07ded)',
          color: 'white',
          textShadow: '1px 1px 0 #7a4ecf',
          border: '2px solid white',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0'
        }}>
          const.js&apos;s Friends Comments
        </div>
        <div className="p-3 text-xs" style={{
          background: 'rgba(30, 20, 50, 0.7)',
          border: '3px inset #c8aaff',
          borderTop: 'none',
          color: '#e0b0ff'
        }}>
          <div className="flex items-center justify-between mb-3">
            <b>Displaying <span className="text-pink-300">{comments.length}</span> comments</b>
            <div className="flex gap-2 items-center">
              {isLoggedIn && (
                <span className="text-[10px] text-purple-300">
                  {isAdmin ? '👑 Admin' : `👤 ${userData?.name}`}
                </span>
              )}
              <motion.span 
                className="text-pink-300 hover:text-pink-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={handleAddClick}
              >
                Add Comment
              </motion.span>
            </div>
          </div>
          
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {isLoading ? (
              <motion.div 
                className="text-center py-4 text-purple-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading comments...
              </motion.div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-purple-300 opacity-70">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment, i) => {
                // Derive isAdmin from author name if not provided (for cached responses)
                const isCommentAdmin = comment.isAdmin ?? (comment.author === 'const.js')
                return (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 p-2 rounded relative"
                  style={{ 
                    background: comment.pinned 
                      ? 'linear-gradient(135deg, rgba(176, 125, 237, 0.25), rgba(50, 40, 70, 0.5))' 
                      : 'rgba(50, 40, 70, 0.5)', 
                    border: comment.pinned 
                      ? '2px solid #b07ded' 
                      : '1px solid rgba(176, 125, 237, 0.3)'
                  }}
                  whileHover={{ backgroundColor: 'rgba(80, 60, 100, 0.5)' }}
                >
                  {comment.pinned && (
                    <motion.div 
                      className="absolute -top-2 -right-1 text-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📌
                    </motion.div>
                  )}
                  
                  <div className="flex-shrink-0 text-center">
                    <motion.img 
                      src={comment.avatar || 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg'} 
                      alt={comment.author} 
                      className="w-12 h-12 rounded-xl border-2"
                      style={{ borderColor: isCommentAdmin ? '#ffd700' : (comment.pinned ? '#b07ded' : '#dcd6ff') }}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    />
                    <p className="text-purple-200 text-[10px] mt-1 font-bold flex items-center justify-center gap-0.5">
                      {isCommentAdmin && <span>👑</span>}
                      {comment.author}
                    </p>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                      <p className="text-purple-300 text-[10px]">
                        {comment.pinned && <span className="text-yellow-300 mr-1">★ PINNED</span>}
                        {formatRelativeTime(comment.createdAt)}
                      </p>
                      
                      {isAdmin && (
                        <div className="flex gap-1">
                          <motion.button
                            onClick={() => handlePin(comment.id, comment.pinned)}
                            disabled={actionLoading === comment.id}
                            className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                            style={{ 
                              background: comment.pinned ? '#b07ded' : 'rgba(176, 125, 237, 0.3)',
                              color: 'white'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {actionLoading === comment.id ? '⏳' : (comment.pinned ? 'Unpin' : 'Pin')}
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(comment.id)}
                            disabled={actionLoading === comment.id}
                            className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-red-500/50"
                            style={{ color: 'white' }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            🗑️
                          </motion.button>
                        </div>
                      )}
                    </div>
                    <div className="text-white text-xs">
                      <MediaEmbedder content={comment.content} />
                    </div>
                  </div>
                </motion.div>
              )})
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

// Windows 98 CD Player Style
const CDPlayerStyles = () => (
  <style jsx global>{`
    /* Windows 98 CD Player customization - values set dynamically via CDPlayerEmbedded */

    /* Windows 98 Font */
    @font-face {
      font-family: "Pixelated MS Sans Serif";
      font-style: normal;
      font-weight: 400;
      src: url(https://unpkg.com/98.css@0.1.20/dist/ms_sans_serif.woff) format("woff");
      src: url(https://unpkg.com/98.css@0.1.20/dist/ms_sans_serif.woff2) format("woff2");
    }
    @font-face {
      font-family: "Pixelated MS Sans Serif";
      font-style: normal;
      font-weight: 700;
      src: url(https://unpkg.com/98.css@0.1.20/dist/ms_sans_serif_bold.woff) format("woff");
      src: url(https://unpkg.com/98.css@0.1.20/dist/ms_sans_serif_bold.woff2) format("woff2");
    }

    /* CD Player Window */
    .cd-window {
      background: silver;
      margin: auto;
      text-shadow: none;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
      padding: 3px;
      color: #000 !important;
      font-family: "Pixelated MS Sans Serif", Arial !important;
    }
    
    .cd-window * {
      -webkit-font-smoothing: none;
      font-family: "Pixelated MS Sans Serif", Arial;
      font-size: 11px;
      text-shadow: inherit;
    }

    .cd-window img {
      filter: none !important;
    }

    .cd-title-bar {
      display: flex;
      align-items: center;
      background: linear-gradient(90deg, navy, #1084d0);
      justify-content: space-between;
      padding: 2px;
    }

    .cd-title-bar-text {
      color: #fff;
      font-weight: 700;
      letter-spacing: 0;
      margin-right: 24px;
      line-height: 15px;
      user-select: none;
    }

    .cd-title-bar-text img {
      vertical-align: bottom;
      margin-inline: 2px;
    }

    .cd-title-bar-controls {
      display: flex;
    }

    .cd-btn {
      display: inline-block;
      background: silver;
      margin: auto;
      white-space: nowrap;
      border: none;
      border-radius: 0;
      min-height: 14px;
      min-width: 16px;
      padding: 0;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
      color: #000;
    }

    .cd-btn:active {
      padding: 0;
      box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
      text-shadow: 1px 1px #222;
    }

    .cd-btn:focus {
      outline: 0;
    }

    .cd-btn.minimize {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 0h6v2H0z'/%3E%3C/svg%3E");
      background-position: bottom 3px left 4px;
      background-repeat: no-repeat;
    }

    .cd-btn.maximize {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 0H0v9h9V0zM8 2H1v6h7V2z' fill='%23000'/%3E%3C/svg%3E");
      background-position: top 2px left 3px;
      background-repeat: no-repeat;
    }

    .cd-btn.close {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0V0z' fill='%23000'/%3E%3C/svg%3E");
      background-position: top 3px left 4px;
      background-repeat: no-repeat;
      margin-left: 2px;
    }

    .cd-window-body {
      margin: 8px;
    }

    .cd-menu-bar {
      text-align: left;
      margin-top: -3px !important;
      margin-bottom: 5px !important;
      margin-inline: 0px !important;
      user-select: none;
    }

    .cd-menu-bar span {
      border: 1px solid silver;
      padding: 2px 4px;
    }

    .cd-menu-bar span:hover {
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
    }

    .cd-display {
      position: relative;
      padding: 13px 4px;
      width: 54%;
      font-size: 20px;
      text-align: center;
      color: olive;
      background: #000;
      box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
      box-sizing: border-box;
      margin-block: 3px;
      z-index: 999;
    }

    .cd-display::before {
      content: "";
      display: block;
      position: absolute;
      top: 1px;
      left: 1px;
      background: var(--albumcover);
      width: 98%;
      height: 96%;
      opacity: .5;
      background-size: cover;
      background-position: center;
      z-index: -1;
    }

    .cd-buttons-area {
      width: 45%;
      height: 54px;
      vertical-align: top;
      text-align: center;
      display: inline-block;
    }

    .cd-control-btn {
      display: inline-block;
      background: silver;
      margin: auto;
      white-space: nowrap;
      border: none;
      border-radius: 0;
      min-height: 23px;
      min-width: 75px;
      padding: 6px 12px 0;
      text-shadow: 0 0 #222;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
      color: #000;
      font-size: 12px;
    }

    .cd-control-btn:active {
      box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
      text-shadow: 1px 1px #222;
    }

    .cd-info-area {
      text-align: right;
    }

    .cd-label {
      display: inline-block;
      font-size: 12px;
      width: fit-content;
      margin-right: 5px;
      margin-block: 3px;
    }

    .cd-text-field {
      display: inline-block;
      box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
      box-sizing: border-box;
      margin-block: 3px;
      background-color: #fff;
      padding: 4px;
      width: 85%;
      text-align: left;
      font-size: 12px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E");
      background-position: top 2px right 2px;
      background-repeat: no-repeat;
    }

    .cd-text-field.artist::after {
      content: var(--artist);
    }

    .cd-text-field.title::after {
      content: var(--title);
    }

    .cd-text-field.artist,
    .cd-text-field.title {
      height: 23px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-right: 20px !important;
      vertical-align: bottom;
    }

    .cd-status-bar {
      display: flex;
      gap: 1px;
      margin: 0 1px;
    }

    .cd-status-field {
      box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px grey;
      flex-grow: 1;
      margin: 0;
      padding: 2px 3px;
    }
  `}</style>
)

// Windows 98 CD Player Component (Embedded in Blurbs) - Now with dynamic settings!
const CDPlayerEmbedded = ({ 
  title = '420', 
  artist = 'MACINTOSH PLUS', 
  albumArt = 'https://m.media-amazon.com/images/I/81BbQMTakEL._UF1000,1000_QL80_.jpg',
  youtubeId = 'hI302pJcB5Y',
  autoPlay = true
}: { 
  title?: string
  artist?: string
  albumArt?: string
  youtubeId?: string
  autoPlay?: boolean
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showPlayer, setShowPlayer] = useState(true)

  // Autoplay on mount
  useEffect(() => {
    if (autoPlay) {
      // Small delay to allow page to load
      const timer = setTimeout(() => setIsPlaying(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay])

  // Timer for display
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }
  // Additional CD player controls
  const handlePrevious = () => setCurrentTime(0) // Reset to beginning
  const handleNext = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100) // Restart track
  }
  const handleRewind = () => setCurrentTime(Math.max(0, currentTime - 10)) // Skip back 10s
  const handleForward = () => setCurrentTime(currentTime + 10) // Skip forward 10s
  const handleEject = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setShowPlayer(false)
  }

  if (!showPlayer) return null

  return (
    <>
      {/* Dynamic styles for this CD player instance */}
      <style jsx global>{`
        .cd-player-root {
          --artist: "${artist}";
          --title: "${title}";
          --albumcover: url(${albumArt});
        }
        .cd-player-root .cd-display::before {
          background-image: url(${albumArt});
        }
      `}</style>
      <CDPlayerStyles />
      
      <div className="cd-player-root">
        {/* Hidden YouTube player for audio - only renders when playing */}
        {isPlaying && youtubeId && (
          <iframe 
            width="0" 
            height="0" 
            src={`https://www.youtube.com/embed/${youtubeId}?&autoplay=1&loop=1&playlist=${youtubeId}`}
            title="music" 
            frameBorder="0" 
            allow="autoplay"
            loading="lazy"
          />
        )}
        
        <div className="cd-window" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
          <div className="cd-title-bar">
            <div className="cd-title-bar-text">
              <img src="https://images2.imgbox.com/42/89/JIRoQjUo_o.png" alt="CD" />
              CD Player
            </div>
            <div className="cd-title-bar-controls">
              <button className="cd-btn minimize" onClick={() => setShowPlayer(false)}></button>
              <button className="cd-btn maximize"></button>
              <button className="cd-btn close" onClick={() => setShowPlayer(false)}></button>
            </div>
          </div>
          
          <div className="cd-window-body">
            <p className="cd-menu-bar">
              <span><u>D</u>isc</span>{' '}
              <span><u>V</u>iew</span>{' '}
              <span><u>O</u>ptions</span>{' '}
              <span><u>H</u>elp</span>
            </p>
            
            <p className="cd-display">[00] {formatTime(currentTime)}</p>
          
          <div className="cd-buttons-area">
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', background: isPlaying ? '#90EE90' : undefined }}
              onClick={handlePlay}
              title="Play"
            >▶</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginInline: '0px', background: isPlaying ? '#FFD700' : undefined }}
              onClick={handlePause}
              title="Pause"
            >❚❚</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px' }}
              onClick={handleStop}
              title="Stop"
            >◼</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginTop: '5px' }}
              onClick={handlePrevious}
              title="Previous Track"
            >❚◄◄</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginTop: '5px', marginLeft: '0px' }}
              onClick={handleRewind}
              title="Rewind 10s"
            >◄◄</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginTop: '5px', marginLeft: '0px' }}
              onClick={handleForward}
              title="Forward 10s"
            >►►</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginTop: '5px', marginLeft: '0px' }}
              onClick={handleNext}
              title="Next Track"
            >►►❚</button>
            <button 
              className="cd-control-btn" 
              style={{ minWidth: '20px', maxWidth: '20px', marginTop: '5px', marginLeft: '0px' }}
              onClick={handleEject}
              title="Eject"
            >❚ ►</button>
          </div>
          
          <div className="cd-info-area">
            <p className="cd-label"><u>A</u>rtist:</p>
            <p className="cd-text-field artist" style={{ color: '#000' }}>{artist}</p>
            <p className="cd-label">Title:</p>
            <p className="cd-text-field title" style={{ color: '#000' }}>{title}</p>
          </div>
        </div>
        
        <div className="cd-status-bar">
          <p className="cd-status-field">Total Play: {formatTime(currentTime)} m:s</p>
          <p className="cd-status-field">Track: {formatTime(currentTime)} m:s</p>
        </div>
      </div>
    </div>
  </>
  )
}

// Chat Modal Component - Premium Glassmorphic Chat UI
const ChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ name: string; avatar: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/user-auth')
      const data = await res.json()
      if (data.authenticated && data.user) {
        setIsLoggedIn(true)
        setUserData(data.user)
      } else {
        // Check admin auth
        const adminRes = await fetch('/api/auth')
        const adminData = await adminRes.json()
        if (adminData.authenticated) {
          setIsLoggedIn(true)
          setUserData({ name: 'const.js', avatar: 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg' })
        }
      }
    }
    checkAuth()
  }, [isOpen])
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  const sendMessage = async () => {
    if (!input.trim() || loading) return
    
    const userMessage = input.trim()
    setInput('')
    setError(null)
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10) // Keep last 10 messages for context
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center sm:p-4"
        style={{ 
          background: 'rgba(0, 0, 0, 0.8)', 
          backdropFilter: 'blur(8px)',
          overscrollBehavior: 'contain'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-md h-[92vh] sm:h-[80vh] sm:max-h-[600px] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(46, 31, 78, 0.98), rgba(26, 16, 48, 0.99))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="flex-shrink-0 flex items-center justify-between px-5 py-4"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl overflow-hidden border-2"
                style={{ borderColor: '#b07ded' }}
              >
                <img 
                  src="https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg" 
                  alt="const.js" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">const.js</h2>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </motion.button>
          </div>
          
          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ overscrollBehavior: 'contain' }}
          >
            {!isLoggedIn ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Login to Chat</h3>
                <p className="text-sm text-white/50 mb-4">You need to be logged in to send messages</p>
                <p className="text-xs text-white/30">Use the &quot;Add Comment&quot; button to login</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden border-2 mb-4"
                  style={{ borderColor: '#b07ded' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img 
                    src="https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">yo</h3>
                <p className="text-sm text-white/50">im const.js, wassup</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: '#b07ded' }}>
                      <img 
                        src="https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg" 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'rounded-tr-md' 
                        : 'rounded-tl-md'
                    }`}
                    style={{
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #b07ded, #9b6dd9)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))
            )}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: '#b07ded' }}>
                  <img 
                    src="https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="px-4 py-3 rounded-2xl rounded-tl-md"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
              >
                <p className="text-xs text-red-400">{error}</p>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div 
            className="flex-shrink-0 p-3"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {isLoggedIn ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white border-2 border-white/10 focus:border-purple-400/50 focus:outline-none transition-all text-sm placeholder:text-white/30"
                  disabled={loading}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                  style={{
                    background: input.trim() 
                      ? 'linear-gradient(135deg, #b07ded, #9b6dd9)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }}
                  whileHover={{ scale: input.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: input.trim() ? 0.98 : 1 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </motion.button>
              </div>
            ) : (
              <p className="text-center text-xs text-white/30 py-2">
                Login to start chatting
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Floating Decorations (hidden on mobile) - Both on RIGHT side now!
const FloatingDecorations = () => (
  <>
    {/* Right floating anime girl (Faye) - moved to right side */}
    <motion.div 
      className="hidden lg:block fixed right-5 bottom-8 z-[100] pointer-events-none w-80 h-72"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <img src="https://media.tenor.com/WNSgq2VcZHYAAAAi/faye-faye-valentine.gif" alt="" className="w-full h-full object-contain" />
    </motion.div>
    {/* Right floating cat girl - also on right side, higher up */}
    <motion.div 
      className="hidden lg:block fixed right-5 top-24 z-[100] pointer-events-none w-80 h-44"
      animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <img src="https://media.tenor.com/aQHeMjVDNpgAAAAi/neko-para-neko.gif" alt="" className="w-full h-full object-contain" />
    </motion.div>
    {/* Floating hearts with enhanced animations */}
    {[
      { right: '20px', top: '150px', delay: '0s' },
      { right: '100px', top: '80px', delay: '0.3s' },
      { right: '20px', top: '220px', delay: '0.6s' },
      { left: '20px', top: '100px', delay: '0.9s' },
      { left: '20px', top: '200px', delay: '1.2s' },
      { left: '20px', top: '300px', delay: '1.5s' }
    ].map((pos, i) => (
      <motion.div 
        key={i}
        className="hidden lg:block fixed w-20 h-16 z-[100] pointer-events-none"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: parseFloat(pos.delay || '0')
        }}
        style={pos}
      >
        <img src="https://i.imgur.com/hyrao2u.png" alt="" className="w-full h-full object-contain" />
      </motion.div>
    ))}
  </>
)

// Admin Settings Panel - Apple Glassmorphism Design
const AdminSettingsPanel = ({ onSettingsSaved }: { onSettingsSaved?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'music' | 'about' | 'bg' | 'colors' | 'ai'>('profile')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form fields with proper state
  const [profileName, setProfileName] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [profileMood, setProfileMood] = useState('')
  const [profileBio, setProfileBio] = useState('')
  const [musicTitle, setMusicTitle] = useState('')
  const [musicArtist, setMusicArtist] = useState('')
  const [musicAlbumArt, setMusicAlbumArt] = useState('')
  const [musicYoutubeUrl, setMusicYoutubeUrl] = useState('')
  const [aboutMeImage, setAboutMeImage] = useState('')
  const [aboutMeText, setAboutMeText] = useState('')
  const [meetImage, setMeetImage] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')
  const [introGif, setIntroGif] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#b07ded')
  const [secondaryColor, setSecondaryColor] = useState('#9b6dd9')
  const [accentColor, setAccentColor] = useState('#c9abff')
  const [textColor, setTextColor] = useState('#e0b0ff')
  const [bgColor, setBgColor] = useState('rgba(30, 20, 50, 0.7)')
  // AI Settings
  const [openrouterApiKey, setOpenrouterApiKey] = useState('')
  const [openrouterModel, setOpenrouterModel] = useState('openai/gpt-3.5-turbo')
  const [aiPersona, setAiPersona] = useState('')
  // Track if API key was changed by user (to avoid saving masked value)
  const [apiKeyChanged, setApiKeyChanged] = useState(false)
  
  // Track if settings were loaded
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  // Check admin status on mount
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setIsAdmin(data.authenticated || false))
      .catch(() => setIsAdmin(false))
  }, [])

  // Load settings from database
  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
        setProfileName(data.settings.profileName || '')
        setProfilePic(data.settings.profilePic || '')
        setProfileMood(data.settings.profileMood || '')
        setProfileBio(data.settings.profileBio || '')
        setMusicTitle(data.settings.musicTitle || '')
        setMusicArtist(data.settings.musicArtist || '')
        setMusicAlbumArt(data.settings.musicAlbumArt || '')
        setMusicYoutubeUrl(data.settings.musicYoutubeId ? `https://youtube.com/watch?v=${data.settings.musicYoutubeId}` : '')
        setAboutMeImage(data.settings.aboutMeImage || '')
        setAboutMeText(data.settings.aboutMeText || '')
        setMeetImage(data.settings.meetImage || '')
        setBackgroundImage(data.settings.backgroundImage || '')
        setIntroGif(data.settings.introGif || '')
        setPrimaryColor(data.settings.primaryColor || '#b07ded')
        setSecondaryColor(data.settings.secondaryColor || '#9b6dd9')
        setAccentColor(data.settings.accentColor || '#c9abff')
        setTextColor(data.settings.textColor || '#e0b0ff')
        setBgColor(data.settings.bgColor || 'rgba(30, 20, 50, 0.7)')
        // AI Settings - Don't store masked API key, just display it
        setOpenrouterApiKey(data.settings.openrouterApiKey || '')
        setOpenrouterModel(data.settings.openrouterModel || 'openai/gpt-4o-mini')
        setAiPersona(data.settings.aiPersona || '')
        setApiKeyChanged(false) // Reset flag when loading
        setSettingsLoaded(true)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  // Open modal
  const handleOpen = () => {
    setIsOpen(true)
    setSettingsLoaded(false)
    loadSettings()
  }

  // Save all settings
  const handleSave = async () => {
    if (!settingsLoaded) return
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName, profilePic, profileMood, profileBio,
          musicTitle, musicArtist, musicAlbumArt, musicYoutubeUrl,
          aboutMeImage, aboutMeText, meetImage,
          backgroundImage, introGif,
          primaryColor, secondaryColor, accentColor, textColor, bgColor,
          // Only send API key if it was changed by user (not masked value)
          openrouterApiKey: apiKeyChanged ? openrouterApiKey : undefined,
          openrouterModel, 
          aiPersona
        })
      })
      
      if (!res.ok) throw new Error('Failed to save')
      
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
          setIsOpen(false)
          // Call the callback to reload settings in parent component
          if (onSettingsSaved) {
            onSettingsSaved()
          }
        }, 800)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Preview image in fullscreen
  const openImagePreview = (url: string) => {
    setImagePreview(url)
  }

  if (!isAdmin) return null

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'music', icon: '🎵', label: 'Music' },
    { id: 'about', icon: '📝', label: 'About' },
    { id: 'bg', icon: '🖼️', label: 'Backgrounds' },
    { id: 'colors', icon: '🎨', label: 'Colors' },
    { id: 'ai', icon: '🤖', label: 'AI Chat' },
  ] as const

  return (
    <>
      {/* Apple-Style Floating Settings Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          border: '0.5px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </motion.button>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(40px)' }}
            onClick={() => setImagePreview(null)}
          >
            <motion.img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)'
              }}
            />
            <motion.button
              onClick={() => setImagePreview(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '0.5px solid rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal - Apple Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
            style={{ 
              background: 'rgba(0, 0, 0, 0.72)', 
              backdropFilter: 'saturate(180%) blur(50px)',
              WebkitBackdropFilter: 'saturate(180%) blur(50px)'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-5xl h-[92vh] md:h-[88vh] flex rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(30, 30, 40, 0.65)',
                backdropFilter: 'blur(50px) saturate(180%)',
                WebkitBackdropFilter: 'blur(50px) saturate(180%)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                boxShadow: `
                  0 0 0 0.5px rgba(255, 255, 255, 0.05),
                  0 50px 100px -20px rgba(0, 0, 0, 0.5),
                  0 30px 60px -30px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Sidebar - Thin Material */}
              <div 
                className="w-[200px] flex-shrink-0 flex flex-col"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRight: '0.5px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {/* Header */}
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(176, 125, 237, 0.3), rgba(155, 109, 217, 0.3))',
                        border: '0.5px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white tracking-tight">Settings</h2>
                      <p className="text-[11px] text-white/40">Admin Panel</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                  {tabs.map(tab => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id 
                          ? 'text-white' 
                          : 'text-white/50 hover:text-white/80'
                      }`}
                      style={{
                        background: activeTab === tab.id 
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'transparent',
                        border: activeTab === tab.id 
                          ? '0.5px solid rgba(255, 255, 255, 0.1)'
                          : '0.5px solid transparent'
                      }}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      {tab.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    Close
                  </motion.button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Content Header */}
                <div 
                  className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
                  style={{
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderBottom: '0.5px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <p className="text-sm text-white/40 mt-0.5">
                      {activeTab === 'profile' && 'Customize your profile appearance'}
                      {activeTab === 'music' && 'Configure the music player'}
                      {activeTab === 'about' && 'Edit your about me section'}
                      {activeTab === 'bg' && 'Set background images'}
                      {activeTab === 'colors' && 'Customize color scheme'}
                      {activeTab === 'ai' && 'Configure AI chat settings'}
                    </p>
                  </div>
                  <motion.button
                    onClick={handleSave}
                    disabled={loading || !settingsLoaded}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                    style={{
                      background: saved 
                        ? 'rgba(52, 199, 89, 0.2)'
                        : 'rgba(176, 125, 237, 0.2)',
                      border: saved 
                        ? '0.5px solid rgba(52, 199, 89, 0.3)'
                        : '0.5px solid rgba(176, 125, 237, 0.3)',
                      color: saved ? '#34c759' : 'white'
                    }}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        Saved
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6" style={{ overscrollBehavior: 'contain' }}>
                  {!settingsLoaded ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"/>
                    </div>
                  ) : (
                    <div className="space-y-6 max-w-3xl">
                      {/* Profile Tab */}
                      {activeTab === 'profile' && (
                        <div className="space-y-6">
                          {/* Glass Card */}
                          <GlassCard title="Profile Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <GlassField label="Display Name" value={profileName} onChange={setProfileName} placeholder="Your display name" />
                              <GlassField label="Mood" value={profileMood} onChange={setProfileMood} placeholder="Current mood" />
                            </div>
                            <div className="mt-5">
                              <GlassField label="Profile Picture URL" value={profilePic} onChange={setProfilePic} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="mt-5">
                              <GlassField label="Bio" value={profileBio} onChange={setProfileBio} placeholder="Short bio" />
                            </div>
                          </GlassCard>

                          {/* Preview Card */}
                          <GlassCard title="Preview">
                            <div className="flex items-center gap-5">
                              {profilePic ? (
                                <motion.img
                                  src={profilePic}
                                  alt="Profile"
                                  className="w-20 h-20 rounded-2xl object-cover cursor-pointer"
                                  style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                  onClick={() => openImagePreview(profilePic)}
                                  whileHover={{ scale: 1.05 }}
                                />
                              ) : (
                                <div 
                                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '0.5px dashed rgba(255, 255, 255, 0.2)' }}
                                >
                                  <span className="text-white/20 text-3xl">👤</span>
                                </div>
                              )}
                              <div>
                                <p className="text-lg font-medium text-white">{profileName || 'Your Name'}</p>
                                <p className="text-sm text-white/50">{profileMood || 'Mood'}</p>
                                <p className="text-xs text-white/30 mt-1">{profileBio || 'No bio set'}</p>
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      )}

                      {/* Music Tab */}
                      {activeTab === 'music' && (
                        <div className="space-y-6">
                          <GlassCard title="Music Player">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <GlassField label="Song Title" value={musicTitle} onChange={setMusicTitle} placeholder="Song name" />
                              <GlassField label="Artist" value={musicArtist} onChange={setMusicArtist} placeholder="Artist name" />
                            </div>
                            <div className="mt-5">
                              <GlassField label="Album Art URL" value={musicAlbumArt} onChange={setMusicAlbumArt} placeholder="https://example.com/album.jpg" />
                            </div>
                            <div className="mt-5">
                              <GlassField label="YouTube URL" value={musicYoutubeUrl} onChange={setMusicYoutubeUrl} placeholder="https://youtube.com/watch?v=..." />
                              <p className="text-xs text-white/30 mt-2 flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                                Video ID will be extracted automatically
                              </p>
                            </div>
                          </GlassCard>

                          {musicAlbumArt && (
                            <GlassCard title="Album Art Preview">
                              <motion.img
                                src={musicAlbumArt}
                                alt="Album"
                                className="w-32 h-32 rounded-2xl object-cover cursor-pointer"
                                style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                onClick={() => openImagePreview(musicAlbumArt)}
                                whileHover={{ scale: 1.02 }}
                              />
                              <p className="text-sm text-white/70 mt-3">{musicTitle || 'Song Title'}</p>
                              <p className="text-xs text-white/40">{musicArtist || 'Artist'}</p>
                            </GlassCard>
                          )}
                        </div>
                      )}

                      {/* About Tab */}
                      {activeTab === 'about' && (
                        <div className="space-y-6">
                          <GlassCard title="About Me">
                            <GlassField label="About Me Image URL" value={aboutMeImage} onChange={setAboutMeImage} placeholder="Image URL" />
                            <div className="mt-5">
                              <label className="block text-sm font-medium text-white/60 mb-2">About Me Text</label>
                              <textarea 
                                value={aboutMeText} 
                                onChange={e => setAboutMeText(e.target.value)} 
                                placeholder="Tell visitors about yourself..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl text-white text-base placeholder:text-white/30 resize-none transition-all"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '0.5px solid rgba(255, 255, 255, 0.1)',
                                  outline: 'none'
                                }}
                                onFocus={e => e.target.style.border = '0.5px solid rgba(176, 125, 237, 0.5)'}
                                onBlur={e => e.target.style.border = '0.5px solid rgba(255, 255, 255, 0.1)'}
                              />
                            </div>
                          </GlassCard>

                          <GlassCard title="Who I'd Like to Meet">
                            <GlassField label="Image URL (GIF recommended)" value={meetImage} onChange={setMeetImage} placeholder="https://example.com/meet.gif" />
                            {meetImage && (
                              <motion.img
                                src={meetImage}
                                alt="Meet"
                                className="mt-4 max-w-full max-h-40 rounded-xl cursor-pointer"
                                style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                onClick={() => openImagePreview(meetImage)}
                                whileHover={{ scale: 1.01 }}
                              />
                            )}
                          </GlassCard>
                        </div>
                      )}

                      {/* Backgrounds Tab */}
                      {activeTab === 'bg' && (
                        <div className="space-y-6">
                          <GlassCard title="Background Image">
                            <GlassField label="URL" value={backgroundImage} onChange={setBackgroundImage} placeholder="https://example.com/bg.gif" />
                            {backgroundImage && (
                              <motion.div 
                                className="mt-4 h-36 rounded-2xl overflow-hidden cursor-pointer relative"
                                style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                whileHover={{ scale: 1.005 }}
                                onClick={() => openImagePreview(backgroundImage)}
                              >
                                <img src={backgroundImage} alt="BG" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <span className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm">Preview</span>
                                </div>
                              </motion.div>
                            )}
                          </GlassCard>

                          <GlassCard title="Intro GIF">
                            <GlassField label="URL (shown on page load)" value={introGif} onChange={setIntroGif} placeholder="https://example.com/intro.gif" />
                            {introGif && (
                              <motion.img
                                src={introGif}
                                alt="Intro"
                                className="mt-4 max-w-xs rounded-xl cursor-pointer"
                                style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                onClick={() => openImagePreview(introGif)}
                                whileHover={{ scale: 1.01 }}
                              />
                            )}
                          </GlassCard>
                        </div>
                      )}

                      {/* Colors Tab */}
                      {activeTab === 'colors' && (
                        <div className="space-y-6">
                          <GlassCard title="Color Scheme">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { label: 'Primary', value: primaryColor, setter: setPrimaryColor },
                                { label: 'Secondary', value: secondaryColor, setter: setSecondaryColor },
                                { label: 'Accent', value: accentColor, setter: setAccentColor },
                                { label: 'Text', value: textColor, setter: setTextColor },
                              ].map(color => (
                                <div key={color.label} className="space-y-2">
                                  <label className="block text-xs font-medium text-white/50">{color.label}</label>
                                  <div className="flex gap-2">
                                    <motion.div 
                                      className="w-10 h-10 rounded-xl cursor-pointer overflow-hidden"
                                      style={{ border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <input 
                                        type="color" 
                                        value={color.value} 
                                        onChange={e => color.setter(e.target.value)}
                                        className="w-14 h-14 -m-2 cursor-pointer border-0"
                                      />
                                    </motion.div>
                                    <input 
                                      value={color.value} 
                                      onChange={e => color.setter(e.target.value)}
                                      className="flex-1 px-3 py-2 rounded-xl text-sm font-mono"
                                      style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '0.5px solid rgba(255, 255, 255, 0.1)',
                                        color: 'white'
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-5">
                              <label className="block text-xs font-medium text-white/50 mb-2">Box Background (RGBA)</label>
                              <input 
                                value={bgColor} 
                                onChange={e => setBgColor(e.target.value)} 
                                placeholder="rgba(30, 20, 50, 0.7)"
                                className="w-full px-4 py-3 rounded-xl text-base font-mono"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '0.5px solid rgba(255, 255, 255, 0.1)',
                                  color: 'white'
                                }}
                              />
                            </div>
                          </GlassCard>

                          {/* Live Preview */}
                          <GlassCard title="Live Preview">
                            <motion.div 
                              className="p-6 rounded-2xl"
                              style={{ 
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                border: `0.5px solid ${accentColor}`,
                              }}
                              animate={{ 
                                boxShadow: [`0 10px 40px -10px ${primaryColor}30`, `0 10px 40px -10px ${primaryColor}50`, `0 10px 40px -10px ${primaryColor}30`]
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <h3 style={{ color: textColor }} className="text-xl font-semibold mb-2">Preview Title</h3>
                              <p style={{ color: textColor }} className="text-sm opacity-80 mb-4">This is how your colors will look!</p>
                              <div className="flex gap-2 flex-wrap">
                                <span 
                                  className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
                                  style={{ background: accentColor, color: '#000' }}
                                >
                                  Accent
                                </span>
                                <span 
                                  className="px-4 py-2 rounded-xl text-sm"
                                  style={{ background: bgColor, color: textColor, border: `0.5px solid ${primaryColor}` }}
                                >
                                  Box BG
                                </span>
                              </div>
                            </motion.div>
                          </GlassCard>
                        </div>
                      )}

                      {/* AI Chat Tab */}
                      {activeTab === 'ai' && (
                        <div className="space-y-6">
                          <GlassCard title="OpenRouter AI Configuration">
                            <p className="text-sm text-white/40 mb-5">Configure the AI chatbot that responds to visitors</p>
                            
                            <GlassField 
                              label="API Key" 
                              type="password"
                              value={openrouterApiKey} 
                              onChange={(val) => {
                                setOpenrouterApiKey(val)
                                setApiKeyChanged(true)
                              }} 
                              placeholder="sk-or-..." 
                            />
                            {apiKeyChanged && openrouterApiKey && (
                              <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                                API key will be updated
                              </p>
                            )}
                            <p className="text-xs text-white/30 mt-1.5">
                              Get your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">openrouter.ai/keys</a>
                            </p>
                          </GlassCard>

                          <GlassCard title="AI Model">
                            <input 
                              type="text"
                              value={openrouterModel}
                              onChange={e => setOpenrouterModel(e.target.value)}
                              placeholder="e.g., openai/gpt-4o"
                              list="model-suggestions"
                              className="w-full px-4 py-3 rounded-xl text-base"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                                color: 'white'
                              }}
                            />
                            <datalist id="model-suggestions">
                              <option value="openai/gpt-4o" />
                              <option value="openai/gpt-4o-mini" />
                              <option value="anthropic/claude-3.5-sonnet" />
                              <option value="google/gemini-2.0-flash-exp:free" />
                              <option value="deepseek/deepseek-r1" />
                            </datalist>
                          </GlassCard>

                          <GlassCard title="AI Persona">
                            <textarea 
                              value={aiPersona} 
                              onChange={e => setAiPersona(e.target.value)} 
                              placeholder="Describe how the AI should behave..."
                              rows={8}
                              className="w-full px-4 py-3 rounded-xl text-base placeholder:text-white/30 resize-none"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                                color: 'white'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setAiPersona(`Your name is Const.js. Real name Adithyan M.P. You are 17, from Thrissur Kerala India. Born June 2008. Instagram: const.rb Discord: const.js. You code, watch anime, play games.

You MUST:
- Always remember your name is Const.js/Adithyan when asked
- Use lowercase always
- Say "bruh" normally
- Keep responses very short, like 1 sentence
- Be chill, slightly bored/annoyed vibe
- Use "idk" "fr" "wtf" "dude" "like" casually
- Put "?" after confused statements: "huh ?" "wait what ?"

NEVER:
- Use emojis
- Say "hey there" "what's up" "how are you"
- Use exclamation marks (almost never)
- Act confused about who you are
- Write long responses
- Be overly helpful or friendly`)}
                              className="mt-3 text-xs px-4 py-2 rounded-xl transition-all"
                              style={{
                                background: 'rgba(176, 125, 237, 0.15)',
                                border: '0.5px solid rgba(176, 125, 237, 0.3)',
                                color: 'rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              Use Default Template
                            </button>
                          </GlassCard>

                          {!openrouterApiKey && (
                            <div 
                              className="p-4 rounded-xl"
                              style={{
                                background: 'rgba(255, 204, 0, 0.1)',
                                border: '0.5px solid rgba(255, 204, 0, 0.3)'
                              }}
                            >
                              <p className="text-yellow-300/80 text-sm">⚠️ API key required for chat to work</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Glass Card Component - Apple Style
const GlassCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div 
    className="rounded-2xl p-5"
    style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '0.5px solid rgba(255, 255, 255, 0.06)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
    }}
  >
    <h4 className="text-sm font-medium text-white/70 mb-4">{title}</h4>
    {children}
  </div>
)

// Glass Field Component - Apple Style
const GlassField = ({ label, value, onChange, placeholder, type = 'text' }: { 
  label: string
  value: string
  onChange: (val: string) => void
  placeholder: string
  type?: string 
}) => (
  <div>
    <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-base placeholder:text-white/30 transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '0.5px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        outline: 'none'
      }}
      onFocus={e => e.target.style.border = '0.5px solid rgba(176, 125, 237, 0.5)'}
      onBlur={e => e.target.style.border = '0.5px solid rgba(255, 255, 255, 0.1)'}
    />
  </div>
)

// Main Page Component
export default function Home() {
  const [hasMounted, setHasMounted] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  
  // Load settings from database
  const loadSettings = useCallback(async () => {
    try {
      setSettingsLoading(true)
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      if (data.settings) {
        setSettings({
          profileName: data.settings.profileName || defaultSettings.profileName,
          profilePic: data.settings.profilePic || defaultSettings.profilePic,
          profileMood: data.settings.profileMood || defaultSettings.profileMood,
          profileBio: data.settings.profileBio || defaultSettings.profileBio,
          musicTitle: data.settings.musicTitle || defaultSettings.musicTitle,
          musicArtist: data.settings.musicArtist || defaultSettings.musicArtist,
          musicAlbumArt: data.settings.musicAlbumArt || defaultSettings.musicAlbumArt,
          musicYoutubeId: data.settings.musicYoutubeId || defaultSettings.musicYoutubeId,
          aboutMeImage: data.settings.aboutMeImage || defaultSettings.aboutMeImage,
          aboutMeText: data.settings.aboutMeText || defaultSettings.aboutMeText,
          meetImage: data.settings.meetImage || defaultSettings.meetImage,
          backgroundImage: data.settings.backgroundImage || defaultSettings.backgroundImage,
          introGif: data.settings.introGif || defaultSettings.introGif,
          primaryColor: data.settings.primaryColor || defaultSettings.primaryColor,
          secondaryColor: data.settings.secondaryColor || defaultSettings.secondaryColor,
          accentColor: data.settings.accentColor || defaultSettings.accentColor,
          textColor: data.settings.textColor || defaultSettings.textColor,
          bgColor: data.settings.bgColor || defaultSettings.bgColor,
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }, [])
  
  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 0)
    loadSettings()
    return () => clearTimeout(timer)
  }, [loadSettings])

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'url(https://media1.tenor.com/m/zVOKTGRnA8kAAAAd/water-lake.gif) no-repeat fixed',
        backgroundSize: 'cover'
      }}>
        <div className="text-2xl animate-pulse text-purple-300 font-mono">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'monospace' }}>
      <GlobalStyles 
        backgroundImage={settings.backgroundImage}
        introGif={settings.introGif}
      />
      
      {/* Intro Overlay with dynamic color */}
      <IntroOverlay introGif={settings.introGif} />
      
      {/* Floating Decorations */}
      <FloatingDecorations />
      
      {/* Admin Settings Panel with reload callback */}
      <AdminSettingsPanel onSettingsSaved={loadSettings} />
      
      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-2">
        <Navigation />
        
        {/* Main Content */}
        <main className="p-3 rounded-lg" style={{
          background: 'rgba(47, 33, 70, 0.85)',
          border: '2px solid #b89fff',
          boxShadow: '0 0 6px #9b74b0',
          fontSize: '80%',
          color: '#e6e6fa'
        }}>
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Column (40%) */}
            <div className="lg:w-2/5">
              <ProfileSection 
                name={settings.profileName}
                pic={settings.profilePic}
                mood={settings.profileMood}
                bio={settings.profileBio}
              />
              <ContactBox onOpenChat={() => setChatOpen(true)} />
              <UrlInfo />
              <InterestsTable />
            </div>
            
            {/* Right Column (60%) */}
            <div className="lg:w-3/5">
              <BlogPreview />
              <BlurbsSection 
                musicTitle={settings.musicTitle}
                musicArtist={settings.musicArtist}
                musicAlbumArt={settings.musicAlbumArt}
                musicYoutubeId={settings.musicYoutubeId}
                aboutMeImage={settings.aboutMeImage}
                aboutMeText={settings.aboutMeText}
                meetImage={settings.meetImage}
              />
              <FriendSpace />
              <CommentsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
