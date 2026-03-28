const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// Allow frontend to communicate smoothly from any port during parallel development
app.use(cors({
  origin: '*', // Open CORS for dev
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Gemini Model with strict System Instructions
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  systemInstruction: `You are a helpful AI chatbot.

Rules:
- Use previous conversation for context
- Do NOT hallucinate (if unsure, say "I don't know")
- Avoid repeating the same answer
- Keep answers short and clear
- Ask clarification if the question is unclear
- Stay relevant to the user's question`
});

// Chat memory (VERY IMPORTANT)
let chatHistory = [];

// Context window (TOKEN OPTIMIZATION)
function trimHistory(history) {
  // Keep only the last 20 messages (10 turns of conversation) for better context awareness
  return history.slice(-20);
}

// PROMPT CREATION for Gemini
function formatGeminiHistory(history) {
  return history.map(msg => ({
    // Gemini sdk expects specifically "user" or "model" roles
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
}

// HEALTH CHECK ENDPOINT (Parallel Development feature)
// Allows the frontend dev to quickly check if the server is running
app.get("/health", (req, res) => {
  res.json({ status: "online", message: "Backend is running flawlessly with Gemini API!" });
});

// API ENDPOINT (/chat)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    // --- HARDCODED BASIC RESPONSES (Optimization) ---
    // Prevent wasting tokens on simple pleasantries
    const cleanedMessage = userMessage.toLowerCase().trim().replace(/[.,!?]/g, "");
    const basicResponses = {
      // Greetings
      "hi": "Hello! How can I help you today?",
      "hello": "Hi there! How can I assist you?",
      "hey": "Hey! What's on your mind?",
      "hi there": "Hello! What can I do for you?",
      "hello there": "Hi! How can I help?",
      "hey there": "Hey! What's up?",
      "greetings": "Greetings! How may I assist you?",
      "sup": "Not much, just here to help! What's on your mind?",
      "whats up": "I'm ready to help you out! What do you need?",
      "wassup": "Just here and ready to assist!",

      // Time-based
      "good morning": "Good morning! How can I help you start your day?",
      "morning": "Morning! What can I do for you today?",
      "good afternoon": "Good afternoon! How can I help?",
      "afternoon": "Good afternoon! Need any assistance?",
      "good evening": "Good evening! How can I assist you tonight?",
      "evening": "Evening! How can I help you?",
      "good night": "Good night! Have a restful sleep.",
      "night": "Good night! Talk to you later.",

      // Status/Feelings
      "how are you": "I'm just a computer program, but I'm doing great! How are you?",
      "how are you doing": "I'm doing well, thanks for asking! How about you?",
      "hows it going": "It's going great! How can I help you today?",
      "how do you do": "I'm doing very well, thank you!",
      "im good": "I'm glad to hear that! How can I help you today?",
      "im fine": "That's good to hear! What's on your mind?",
      "fine": "Glad to hear you are fine! How can I assist?",
      "doing well": "Happy to hear you're doing well! Need any help?",
      "thanks for asking": "You're very welcome! Let me know what you need.",
      "all good": "Awesome! How can I help you today?",

      // Gratitude
      "thank you": "You're very welcome!",
      "thanks": "You're welcome! Happy to help.",
      "thanks a lot": "Anytime! Let me know if you need anything else.",
      "thank you so much": "You're very welcome! I'm here if you need more help.",
      "appreciate it": "Glad I could help!",

      // Affirmations & Agreement
      "ok": "Got it! Let me know if there's anything else you need.",
      "okay": "Sounds good! What's next?",
      "cool": "Awesome! Need help with anything else?",
      "awesome": "Great! Let me know what else I can do for you.",
      "great": "Perfect! I'm here if you need me.",
      "nice": "Glad you think so!",
      "perfect": "Excellent! Anything else I can assist with?",
      "sounds good": "Great! Let me know when you're ready for the next step.",
      "got it": "Understood! I'm ready for your next question.",
      "makes sense": "Happy it makes sense! Anything else to clarify?",

      // Identity & Capabilities
      "who are you": "I am a helpful AI chatbot here to assist you.",
      "what are you": "I'm an AI chatbot designed to help answer your questions.",
      "what is your name": "I don't have a specific name, but you can just call me your AI assistant!",
      "are you a robot": "I am an artificial intelligence program, so you could say that!",
      "are you human": "Nope, I'm a helpful AI assistant running on servers.",
      "help": "I'm here to help! You can ask me questions, and I'll do my best to answer.",
      "what can you do": "I can answer questions, summarize topics, help with logic, and chat with you!",

      // Farewells
      "bye": "Goodbye! Have a great day!",
      "goodbye": "Farewell! Take care.",
      "see you": "See you later! Come back anytime.",
      "see ya": "Catch you later!",
      "take care": "You too! Have a wonderful day.",
      "have a good one": "Thanks! You do the same."
    };

    // If it's a basic message, instantly return the hardcoded reply
    if (basicResponses[cleanedMessage]) {
      const reply = basicResponses[cleanedMessage];
      // Save it to history so context flows smoothly
      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: reply });
      return res.json({ reply, isMock: false, isBasic: true });
    }

    // --- PARALLEL DEVELOPMENT MOCK MODE ---
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.MOCK_MODE === 'true') {
      const mockReply = "This is a mock response from the Gemini backend! The API key is missing or turned off, but your frontend logic is perfectly connected.";
      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: mockReply });
      return res.json({ reply: mockReply, isMock: true });
    }

    // 1. Trim old history
    const trimmedHistory = trimHistory(chatHistory);

    // 2. Format history for Google Gemini SDK format
    const geminiHistory = formatGeminiHistory(trimmedHistory);

    // 3. Start a chat session using the cleanly mapped history
    const chatSession = model.startChat({
      history: geminiHistory,
    });

    // 4. Send the new user message and get response
    const result = await chatSession.sendMessage(userMessage);
    const reply = result.response.text();

    // 5. Save conversation
    chatHistory.push({ role: "user", content: userMessage });
    chatHistory.push({ role: "assistant", content: reply });

    // 6. Send response back
    res.json({ reply, isMock: false });

  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Internal server error trying to connect to Gemini API" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
