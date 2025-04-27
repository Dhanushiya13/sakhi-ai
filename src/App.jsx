import { useState, useEffect } from 'react'
import ChatWindow from './chatwindow.jsx'
import { motion } from 'framer-motion'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading assets
    setTimeout(() => setIsLoaded(true), 1200)
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="logo-container"
        >
          <img src="images/sakhi_logo.png" alt="Sakhi AI Logo" className="logo" />
          <h1 className="app-title">Sakhi AI</h1>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="tagline"
        >
          Your community companion
        </motion.div>
      </header>
      
      <main className="app-main">
        {isLoaded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ChatWindow />
          </motion.div>
        ) : (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading Sakhi AI...</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Team AIYO! • ASHA AI Hackathon</p>
      </footer>
    </div>
  )
}

export default App