import React, { useState } from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        className="input-field"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        ref={input => input && !disabled && input.focus()} // auto focus
      />
      <button 
        className="send-button"
        onClick={handleSend}
        disabled={!inputValue.trim() || disabled}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default InputArea;
