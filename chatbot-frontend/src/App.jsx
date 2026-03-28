import { useState, useEffect } from 'react';
import { BotMessageSquare, Moon, Sun, Trash2 } from 'lucide-react';
import './App.css';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load dark mode preference from user history or default to false
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode overrides to the document body to trigger CSS variable shifts globally
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleSendMessage = async (content) => {
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      
      if (!response.ok) {
        throw new Error("Network response failed");
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "No reply available from server." }]);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error: Unable to reach the backend server. Make sure it is running on localhost:3000.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared! Let's start over. How can I assist you today?" }]);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-left">
          <div className="brand-icon">
            <BotMessageSquare color="white" size={24} />
          </div>
          <div className="brand-text">
            <h1>Chatbot Assistant</h1>
            <p>Online & Ready</p>
          </div>
        </div>
        
        {/* Toggle and Clear Buttons */}
        <div className="header-actions">
          <button 
            className="action-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="action-btn"
            onClick={handleClearChat}
            title="Clear Chat History"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>
      
      <ChatBox messages={messages} isLoading={isLoading} />
      <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
