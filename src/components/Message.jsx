import { motion } from 'framer-motion'
import { BiLink, BiUser, BiCalendar, BiBookOpen } from 'react-icons/bi'

function Message({ message, onOptionClick }) {
  const { text, sender, options, quickReplies, cards } = message
  
  return (
    <div className={`message-wrapper ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      {sender === 'bot' && (
        <div className="bot-avatar-small">
          <img src="sakhi_logo.png" alt="Sakhi" />
        </div>
      )}
      
      <div className={`message ${sender}`}>
        {/* Main message text */}
        {text.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        
        {/* Interactive options */}
        {options && options.length > 0 && (
          <div className="message-options">
            {options.map((option, index) => (
              <motion.button
                key={index}
                className="option-button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onOptionClick(option.text)}
              >
                {option.icon && getIconComponent(option.icon)}
                {option.text}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Quick reply chips */}
        {quickReplies && quickReplies.length > 0 && (
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                className="quick-reply-chip"
                whileTap={{ scale: 0.95 }}
                onClick={() => onOptionClick(reply)}
              >
                {reply}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Card carousel for product/event discovery */}
        {cards && cards.length > 0 && (
          <div className="cards-carousel">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="card"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {card.image && (
                  <div className="card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                )}
                <div className="card-content">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  
                  {card.details && (
                    <div className="card-details">
                      {card.details.date && (
                        <div className="card-detail">
                          <BiCalendar />
                          <span>{card.details.date}</span>
                        </div>
                      )}
                      {card.details.location && (
                        <div className="card-detail">
                          <BiLink />
                          <span>{card.details.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {card.action && (
                    <button 
                      className="card-action-button"
                      onClick={() => onOptionClick(card.action.text)}
                    >
                      {card.action.text}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getIconComponent(icon) {
  switch (icon) {
    case 'user':
      return <BiUser />
    case 'calendar':
      return <BiCalendar />
    case 'book':
      return <BiBookOpen />
    case 'link':
      return <BiLink />
    default:
      return null
  }
}

export default Message