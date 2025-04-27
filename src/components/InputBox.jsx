import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BiSend, BiMicrophone, BiX } from 'react-icons/bi'

function InputBox({ onSendMessage, isTyping, context }) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  
  // Set focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  // Set focus after a message is sent
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus()
    }
  }, [isTyping])
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordingTime(0)
    }
    
    return () => clearInterval(timerRef.current)
  }, [isRecording])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Don't send empty messages
    if (!message.trim()) return
    
    onSendMessage(message.trim())
    setMessage('')
  }
  
  const handleKeyDown = (e) => {
    // Send message on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const toggleRecording = () => {
    // This would connect to Web Speech API in a real app
    // For now, we'll just simulate
    setIsRecording(prev => !prev)
    
    if (!isRecording) {
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        setMessage(getMessage())
        setIsRecording(false)
      }, 2000)
    }
  }
  
  // Get a contextual message for voice simulation
  const getMessage = () => {
    const contextMessages = {
      greeting: "Hi, I'd like to learn more about ASHA",
      signup: "I want to create an account",
      jobs: "Show me available job opportunities",
      events: "What events are happening this month?",
      profile: "I need to update my profile"
    }
    
    return contextMessages[context] || "I need help with something"
  }
  
  // Format the recording time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }
  
  return (
    <form className="input-box" onSubmit={handleSubmit}>
      {isRecording ? (
        <div className="recording-interface">
          <div className="recording-indicator">
            <span className="recording-pulse"></span>
            <span className="recording-time">{formatTime(recordingTime)}</span>
          </div>
          <motion.button
            type="button"
            className="cancel-recording-button"
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
          >
            <BiX />
          </motion.button>
        </div>
      ) : (
        <>
          <textarea
            ref={inputRef}
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTyping 
                ? "Sakhi is typing..." 
                : getPlaceholderForContext(context)
            }
            disabled={isTyping}
            rows={1}
          />
          <div className="input-actions">
            <motion.button
              type="button"
              className="voice-button"
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              disabled={isTyping}
            >
              <BiMicrophone />
            </motion.button>
            <motion.button
              type="submit"
              className={`send-button ${message.trim() ? 'active' : ''}`}
              whileTap={{ scale: 0.95 }}
              disabled={!message.trim() || isTyping}
            >
              <BiSend />
            </motion.button>
          </div>
        </>
      )}
    </form>
  )
}

function getPlaceholderForContext(context) {
  const placeholders = {
    greeting: "Hi! How can Sakhi help you today?",
    signup: "Tell me more about yourself...",
    job_search: "What kind of jobs are you looking for?",
    events: "Which types of events interest you?",
    profile: "What would you like to update in your profile?",
    faq: "What questions do you have about ASHA?",
    mentorship: "What are you looking for in a mentor?"
  }
  
  return placeholders[context] || "Message Sakhi..."
}

export default InputBox