import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import Message from './components/Message'
import InputBox from './components/InputBox'
import { handleUserMessage, getInitialGreeting } from './utils/botLogic'

function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentContext, setCurrentContext] = useState('greeting')
  const messagesEndRef = useRef(null)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    interests: [],
    isRegistered: false
  })

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Display initial greeting when component mounts
  useEffect(() => {
    const greeting = getInitialGreeting()
    
    // Add small delay for realistic chat feel
    setTimeout(() => {
      setMessages([
        {
          id: nanoid(),
          text: greeting.text,
          sender: 'bot',
          options: greeting.options
        }
      ])
    }, 800)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { ...message, id: nanoid() }])
  }

  const sendMessage = async (text) => {
    // Add user message to chat
    addMessage({
      text,
      sender: 'user'
    })

    // Show typing indicator
    setIsTyping(true)
    
    // Process the message with our bot logic
    setTimeout(async () => {
      const response = await handleUserMessage(
        text, 
        currentContext, 
        userData, 
        messages.filter(m => m.sender === 'bot')
      )
      
      // Update context if needed
      if (response.newContext) {
        setCurrentContext(response.newContext)
      }
      
      // Update user data if needed
      if (response.userData) {
        setUserData(prevData => ({ ...prevData, ...response.userData }))
      }
      
      // Add bot response
      addMessage({
        text: response.text,
        sender: 'bot',
        options: response.options || [],
        quickReplies: response.quickReplies || [],
        cards: response.cards || []
      })
      
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2s for realism
  }

  const handleOptionClick = (optionText) => {
    sendMessage(optionText)
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="bot-avatar">
          <img src="sakhi_logo.png" alt="Sakhi Avatar" />
          <span className="status-indicator"></span>
        </div>
        <div className="bot-info">
          <h2>Sakhi AI</h2>
          <p className="status">Online</p>
        </div>
      </div>
      
      <div className="messages-container">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Message 
                message={message} 
                onOptionClick={handleOptionClick} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <InputBox 
        onSendMessage={sendMessage} 
        isTyping={isTyping} 
        context={currentContext} 
      />
    </div>
  )
}

export default ChatWindow