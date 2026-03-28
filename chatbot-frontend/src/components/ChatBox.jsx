import React, { useEffect, useRef } from 'react';
import Message from './Message';

const ChatBox = ({ messages, isLoading }) => {
  const chatBoxRef = useRef(null);

  // Auto-scroll logic: triggers smoothly when messages length or loading state changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-box" ref={chatBoxRef}>
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      
      {/* Dynamic Typing Indicator */}
      {isLoading && (
        <div className="typing-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
