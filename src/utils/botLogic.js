import { format } from 'date-fns'

// Database simulation
const DB = {
  jobs: [
    {
      id: 'job1',
      title: 'Software Developer',
      company: 'TechNova',
      description: 'Join our team to build innovative solutions for women in tech',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-5 years',
      image: '/images/software.webp'
    },
    {
      id: 'job2',
      title: 'Community Manager',
      company: 'ASHA Network',
      description: 'Help grow our vibrant community of women entrepreneurs',
      location: 'Mumbai, India',
      type: 'Part-time',
      experience: '1-2 years',
      image: '/images/community.jpeg'
    },
    {
      id: 'job3',
      title: 'Content Creator',
      company: 'SheStartup',
      description: 'Create engaging content for women-led businesses',
      location: 'Hybrid',
      type: 'Freelance',
      experience: '0-1 years',
      image: '/images/content.jpeg'
    }
  ],
  events: [
    {
      id: 'event1',
      title: 'Women in Tech Summit',
      description: 'Annual conference featuring talks from top women tech leaders',
      date: '2025-06-15',
      location: 'Bangalore',
      image: '/images/women-in-tech-summit-nowords.png'
    },
    {
      id: 'event2',
      title: 'Entrepreneurship Workshop',
      description: 'Learn how to start and scale your business',
      date: '2025-05-20',
      location: 'Delhi',
      image: '/images/workshop.jpg'
    },
    {
      id: 'event3',
      title: 'Networking Mixer',
      description: 'Connect with like-minded women in your industry',
      date: '2025-05-10',
      location: 'Virtual',
      image: '/images/network.jpg'
    }
  ],
  mentors: [
    {
      id: 'mentor1',
      name: 'Priya Sharma',
      expertise: 'Technology Leadership',
      experience: '15+ years in tech',
      availability: 'Weekends',
      image: '/images/priya.jpg'
    },
    {
      id: 'mentor2',
      name: 'Aisha Patel',
      expertise: 'Entrepreneurship',
      experience: 'Founded 3 successful startups',
      availability: 'Weekday evenings',
      image: '/images/aisha.jpg'
    },
    {
      id: 'mentor3',
      name: 'Divya Gupta',
      expertise: 'Career Coaching',
      experience: '10+ years in HR',
      availability: 'Flexible',
      image: '/images/divya.jpg'
    }
  ],
  faqs: [
    {
      question: 'What is ASHA?',
      answer: 'ASHA (Alliance for Supporting Her Ambition) is a platform that connects women professionals with opportunities, mentors, and resources to advance their careers and entrepreneurial journeys.'
    },
    {
      question: 'How do I sign up?',
      answer: 'You can sign up by clicking the "Join Now" button or just tell me you want to create an account, and I\'ll guide you through the process!'
    },
    {
      question: 'Is ASHA free to use?',
      answer: 'Yes! ASHA\'s core features are free for all users. We also offer premium memberships with additional benefits like unlimited mentor sessions and exclusive workshops.'
    },
    {
      question: 'How do I find a mentor?',
      answer: 'You can browse our mentor directory or tell me what kind of guidance you\'re looking for, and I\'ll recommend suitable mentors for you.'
    },
    {
      question: 'Can I post job opportunities?',
      answer: 'Yes! Organizations can post job opportunities that align with our community\'s skills and interests. You can register as an organization to post jobs.'
    },
    {
      question: 'How do I update my profile?',
      answer: 'You can update your profile by going to your account settings or simply tell me what you want to update, and I\'ll help you through the process.'
    }
  ]
}

// Intent handlers
function handleGreeting(message) {
  return {
    text: "Hey there! 👋 Welcome to ASHA! I'm Sakhi, your personal community assistant. What brings you here today?",
    options: [
      { text: "Find a job", icon: "link" },
      { text: "Discover events", icon: "calendar" },
      { text: "Connect with mentors", icon: "user" },
      { text: "Create my account", icon: "user" }
    ]
  }
}

function handleJobs(message) {
  // Extract job type preferences if mentioned
  const jobTypes = ['full-time', 'part-time', 'remote', 'freelance', 'internship']
  const mentionedTypes = jobTypes.filter(type => message.toLowerCase().includes(type))

  // Filter jobs if specific types mentioned
  let filteredJobs = DB.jobs
  if (mentionedTypes.length > 0) {
    filteredJobs = DB.jobs.filter(job => 
      mentionedTypes.some(type => job.type.toLowerCase().includes(type) || job.location.toLowerCase().includes(type))
    )
  }

  // Create job cards
  const jobCards = filteredJobs.map(job => ({
    title: job.title,
    description: `${job.company} • ${job.type}`,
    details: {
      location: job.location,
      experience: job.experience
    },
    image: job.image,
    action: { text: `Tell me about ${job.title}` }
  }))

  let responseText = ""
  if (mentionedTypes.length > 0) {
    responseText = `Here are some ${mentionedTypes.join(', ')} opportunities I found:`
  } else {
    responseText = "Check out these job opportunities from the ASHA network:"
  }

  return {
    text: responseText,
    cards: jobCards,
    quickReplies: ['Full-time jobs', 'Remote work', 'Entry-level positions']
  }
}

function handleEvents(message) {
  // Check if user is looking for events in a specific location
  const locations = DB.events.map(event => event.location.toLowerCase())
  const mentionedLocation = locations.find(location => 
    message.toLowerCase().includes(location.toLowerCase())
  )

  // Filter events if location mentioned
  let filteredEvents = DB.events
  if (mentionedLocation) {
    filteredEvents = DB.events.filter(event => 
      event.location.toLowerCase() === mentionedLocation
    )
  }

  // Format dates for display
  const eventCards = filteredEvents.map(event => {
    const formattedDate = format(new Date(event.date), 'MMM d, yyyy')
    return {
      title: event.title,
      description: event.description,
      details: {
        date: formattedDate,
        location: event.location
      },
      image: event.image,
      action: { text: `Register for ${event.title}` }
    }
  })

  let responseText = ""
  if (mentionedLocation) {
    responseText = `Here are upcoming events in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}:`
  } else {
    responseText = "Here are some upcoming events you might be interested in:"
  }

  return {
    text: responseText,
    cards: eventCards,
    quickReplies: ['Virtual events', 'This month', 'Workshops']
  }
}

function handleSignup(message, userData = {}) {
  // Check where in the signup flow we are based on userData
  if (!userData.name) {
    // Starting signup process
    if (message.toLowerCase().includes('create account') || message.toLowerCase().includes('sign up') || message.toLowerCase().includes('create my account')) {
      return {
        text: "Awesome! Let's get you set up with an ASHA account. First, what's your name?",
        newContext: 'signup_name'
      }
    } else {
      // User provided their name directly
      return {
        text: `Great to meet you, ${message}! Now, what email would you like to use for your account?`,
        userData: { name: message },
        newContext: 'signup_email'
      }
    }
  } else if (!userData.email) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(message)) {
      return {
        text: `Thanks! Now, what are you most interested in? This helps us personalize your experience.`,
        userData: { ...userData, email: message },  // Keep previous userData and add email
        newContext: 'signup_interests',
        options: [
          { text: "Career opportunities", icon: "link" },
          { text: "Networking events", icon: "calendar" },
          { text: "Mentorship", icon: "user" },
          { text: "Entrepreneurship", icon: "book" }
        ]
      }
    } else {
      return {
        text: "That doesn't look like a valid email address. Could you please enter a valid email?",
        newContext: 'signup_email'
      }
    }
  } else if (!userData.interests || userData.interests.length === 0) {
    // Process interests
    return {
      text: `Perfect! ${userData.name}, your account has been created successfully! 🎉 You can now explore jobs, events, and connect with mentors. What would you like to check out first?`,
      userData: { 
        ...userData,  // Keep previous userData
        interests: [message], 
        isRegistered: true 
      },
      newContext: 'greeting',
      options: [
        { text: "Explore jobs", icon: "link" },
        { text: "See upcoming events", icon: "calendar" },
        { text: "Find a mentor", icon: "user" }
      ]
    }
  } else {
    // Already registered
    return {
      text: "You're already registered with us! Is there something specific you'd like to explore or update in your profile?",
      newContext: 'greeting',
      quickReplies: ['Update profile', 'Explore opportunities', 'Find events']
    }
  }
}

function handleProfile(message, userData) {
  // Check if user is registered
  if (!userData.isRegistered) {
    return {
      text: "You'll need to create an account first before setting up your profile. Would you like to do that now?",
      newContext: 'signup',
      options: [
        { text: "Yes, create account", icon: "user" },
        { text: "Not now", icon: "link" }
      ]
    }
  }

  // Identify what profile aspect they want to update
  const profileAspects = {
    name: ['name', 'full name', 'username'],
    email: ['email', 'email address', 'mail'],
    password: ['password', 'passcode', 'secret'],
    interests: ['interests', 'preferences', 'topics'],
    photo: ['photo', 'picture', 'profile pic', 'avatar', 'image'],
    bio: ['bio', 'about me', 'description', 'about', 'background']
  }

  let aspectToUpdate = null
  for (const [aspect, keywords] of Object.entries(profileAspects)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      aspectToUpdate = aspect
      break
    }
  }

  if (aspectToUpdate) {
    return {
      text: `Got it! I can help you update your ${aspectToUpdate}. What would you like to change it to?`,
      newContext: `profile_update_${aspectToUpdate}`
    }
  } else {
    return {
      text: "What aspect of your profile would you like to update?",
      newContext: 'profile',
      options: [
        { text: "Update my name", icon: "user" },
        { text: "Change email address", icon: "link" },
        { text: "Update interests", icon: "book" },
        { text: "Upload new photo", icon: "user" }
      ]
    }
  }
}

function handleMentorship(message) {
  // Extract mentor preferences if mentioned
  const expertiseAreas = ['technology', 'entrepreneurship', 'career', 'leadership', 'business']
  const mentionedAreas = expertiseAreas.filter(area => message.toLowerCase().includes(area))

  // Filter mentors if specific expertise mentioned
  let filteredMentors = DB.mentors
  if (mentionedAreas.length > 0) {
    filteredMentors = DB.mentors.filter(mentor => 
      mentionedAreas.some(area => mentor.expertise.toLowerCase().includes(area))
    )
  }

  // Create mentor cards
  const mentorCards = filteredMentors.map(mentor => ({
    title: mentor.name,
    description: mentor.expertise,
    details: {
      experience: mentor.experience,
      availability: mentor.availability
    },
    image: mentor.image,
    action: { text: `Connect with ${mentor.name}` }
  }))

  let responseText = ""
  if (mentionedAreas.length > 0) {
    responseText = `Here are mentors with expertise in ${mentionedAreas.join(', ')}:`
  } else {
    responseText = "Here are some amazing mentors from our community:"
  }

  return {
    text: responseText,
    cards: mentorCards,
    quickReplies: ['Tech mentors', 'Business advice', 'Career coaching']
  }
}

function handleFAQ(message) {
  // Try to find a matching FAQ
  const lowerMessage = message.toLowerCase()
  let bestMatch = null
  let bestScore = 0

  for (const faq of DB.faqs) {
    // Simple matching algorithm - count keyword matches
    const questionWords = faq.question.toLowerCase().split(' ')
    const score = questionWords.filter(word => 
      word.length > 3 && lowerMessage.includes(word)
    ).length

    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  // If we found a good match
  if (bestScore >= 2) {
    return {
      text: bestMatch.answer,
      quickReplies: ['Tell me more about ASHA', 'How to sign up', 'Find a mentor']
    }
  } 
  
  // If message contains ASHA but no specific FAQ match
  if (lowerMessage.includes('asha') && lowerMessage.includes('what')) {
    return {
      text: "ASHA (Alliance for Supporting Her Ambition) is a platform that connects women professionals with opportunities, mentors, and resources to advance their careers and entrepreneurial journeys. We offer job listings, networking events, mentorship programs, and a supportive community for women in all stages of their professional journey.",
      quickReplies: ['How do I join?', 'Show me opportunities', 'Find events']
    }
  }

  // Default response for unmatched questions
  return {
    text: "That's a great question! While I don't have a specific answer for that, I can help you explore our platform to find what you're looking for. Would you like to see our job listings, upcoming events, or connect with a mentor?",
    options: [
      { text: "Explore jobs", icon: "link" },
      { text: "See events", icon: "calendar" },
      { text: "Find mentors", icon: "user" },
      { text: "Contact support", icon: "link" }
    ]
  }
}

// Get the initial greeting
export function getInitialGreeting() {
  const currentHour = new Date().getHours()
  let greeting = ''
  
  if (currentHour < 12) {
    greeting = 'Good morning! '
  } else if (currentHour < 17) {
    greeting = 'Good afternoon! '
  } else {
    greeting = 'Good evening! '
  }
  
  return {
    text: `${greeting}I'm Sakhi, your ASHA community assistant. I can help you discover opportunities, sign up for an account, answer questions, and more. How can I assist you today?`,
    options: [
      { text: 'Explore opportunities', icon: 'book' },
      { text: 'Create an account', icon: 'user' },
      { text: 'Ask a question', icon: 'link' }
    ]
  }
}

// Identify the intent from user message
function identifyIntent(message, currentContext) {
  message = message.toLowerCase()
  
  // Define intents with their keywords
  const intents = {
    greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    jobs: ['job', 'career', 'work', 'hiring', 'employment', 'position', 'vacancy', 'opportunities', 'explore opportunities'],
    events: ['event', 'workshop', 'conference', 'webinar', 'meetup', 'session'],
    signup: ['sign up', 'register', 'create account', 'join', 'become member'],
    profile: ['profile', 'account', 'settings', 'update', 'change', 'edit'],
    mentorship: ['mentor', 'guidance', 'advice', 'coach', 'mentorship'],
    jobDetail: ['tell me about'],
    faq: ['question', 'help', 'how do i', 'what is', 'can i', 'faq', 'who', 'when', 'where', 'why']
  }
  
  // Check for matches
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent
    }
  }
  
  // If in a specific context, maintain it
  if (currentContext && currentContext !== 'greeting') {
    return currentContext
  }
  
  // Default to FAQ if no matches
  return 'faq'
}

// Handle job detail requests
function handleJobDetail(message) {
  // Extract job title from message
  const jobTitlePattern = /tell me about (.*)/i
  const match = message.match(jobTitlePattern)
  
  if (match) {
    const jobTitle = match[1].trim()
    
    // Find the job in the database
    const job = DB.jobs.find(j => j.title.toLowerCase() === jobTitle.toLowerCase())
    
    if (job) {
      return {
        text: `**${job.title} at ${job.company}**\n\n${job.description}\n\n• **Location:** ${job.location}\n• **Job Type:** ${job.type}\n• **Experience Required:** ${job.experience}\n\nAre you interested in applying for this position?`,
        newContext: 'job_application',
        quickReplies: ['Apply now', 'See more jobs', 'Back to main menu']
      }
    }
  }
  
  // No specific job found
  return {
    text: "I couldn't find detailed information about that job. Here are all our current openings:",
    newContext: 'jobs',
    quickReplies: ['Show all jobs', 'Remote jobs', 'Entry-level jobs']
  }
}

// Handle user message and generate response
export async function handleUserMessage(message, currentContext, userData, previousMessages) {
  // Check if this is a job detail request
  if (message.toLowerCase().includes('tell me about')) {
    return handleJobDetail(message)
  }

  const intent = identifyIntent(message, currentContext)
  let response = { text: '', newContext: intent }
  
  // Handle based on intent
  switch (intent) {
    case 'greeting':
      response = handleGreeting(message)
      break
    case 'jobs':
      response = handleJobs(message)
      break
    case 'events':
      response = handleEvents(message)
      break
    case 'signup':
      response = handleSignup(message, userData)
      break
    case 'profile':
      response = handleProfile(message, userData)
      break
    case 'mentorship':
      response = handleMentorship(message)
      break
    case 'faq':
      response = handleFAQ(message)
      break
    default:
      response = {
        text: "I'm not sure I understood that. Could you tell me if you're looking for job opportunities, events, mentorship, or something else?",
        newContext: 'greeting',
        quickReplies: ['Jobs', 'Events', 'Mentorship', 'Create account', 'Help']
      }
  }
  
  return response
}
