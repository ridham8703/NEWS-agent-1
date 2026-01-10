import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message 
          key={index} 
          message={message}
          isLoading={message.isLoading}
        />
      ))}
      {isLoading && (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
};

export default MessageList;
