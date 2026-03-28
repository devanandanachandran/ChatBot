import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  
  // Format the time
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handle Copy logic dynamically hooking into the browser's clipboard API
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'bot'}`}>
      <div className="message-bubble">
        {isUser ? (
          message.content 
        ) : (
          <div className="markdown-content">
            {/* React Markdown takes care of bolding, code blocks, lists natively */}
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      
      <div className="message-footer">
        <span className="message-time">{isUser ? 'You' : 'Bot'} • {time}</span>
        
        {/* Conditional rendering of the intelligent clipboard copy button */}
        {!isUser && (
          <button 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy response to clipboard"
          >
            {copied ? <Check size={12} color="#4CAF50" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
