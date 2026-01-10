import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import './InputArea.css';

const InputArea = ({ onSendMessage, isLoading, inputRef }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className="input-area">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "Generating response..." : "Ask about any news topic..."}
          disabled={isLoading}
          className="input-field"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="send-button"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
      <div className="input-hints">
        <span className="hint">💡 Try: "Tell me today's news about AI"</span>
      </div>
    </div>
  );
};

export default InputArea;
