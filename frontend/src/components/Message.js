import React from 'react';
import './Message.css';
import { User, Bot } from 'lucide-react';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  const isBot = message.role === 'bot';

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format message content (handle basic markdown)
  const formatContent = (content) => {
    // Split by lines to handle line breaks
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Check for markdown headers
      if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.replace(/\*\*/g, '');
        return <strong key={index}>{text}</strong>;
      }
      
      // Return the line as is
      return (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </React.Fragment>
      );
    });
  };

  if (isUser) {
    return (
      <div className="message user-message">
        <div className="message-content">
          <div className="message-avatar user-avatar">
            <User size={20} />
          </div>
          <div className="message-bubble user-bubble">
            <p>{message.content}</p>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isBot) {
    return (
      <div className="message bot-message">
        <div className="message-content">
          <div className="message-avatar bot-avatar">
            <Bot size={20} />
          </div>
          <div className="message-bubble bot-bubble">
            <div className="message-text">
              {message.isLoading ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <p>{formatContent(message.content)}</p>
              )}
            </div>
            {!message.isLoading && message.timestamp && (
              <span className="message-time">{formatTime(message.timestamp)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Message;
