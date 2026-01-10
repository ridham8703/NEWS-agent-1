import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { MessageCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/ask'; // Change this to your backend URL

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '👋 Hi! I\'m your AI News Agent. Ask me about any topic and I\'ll fetch the latest news for you. Try asking "Tell me today\'s news about AI" or "What are the latest developments in technology?"',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Add loading message
    const loadingMessageId = Date.now();
    setMessages(prev => [...prev, {
      role: 'bot',
      content: '🤔 Fetching the latest news...',
      isLoading: true,
      id: loadingMessageId
    }]);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message.trim() })
      });

      const data = await response.json();

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));

      if (data.success) {
        // Add bot response
        const botMessage = {
          role: 'bot',
          content: formatBotResponse(data),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError(data.message || 'Something went wrong');
        const errorMessage = {
          role: 'bot',
          content: `❌ ${data.message || 'Sorry, I couldn\'t fetch the news right now. Please try again.'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Make sure the backend server is running.');
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      const errorMessage = {
        role: 'bot',
        content: '❌ Oops! I couldn\'t connect to the server. Please make sure the backend is running on http://localhost:5000',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBotResponse = (data) => {
    let response = `📰 **News Summary for: ${data.topic}**\n\n`;
    
    if (data.date && data.date !== 'null') {
      response += `📅 Date: ${formatDate(data.date)}\n\n`;
    }
    
    response += `✨ **Summary:**\n\n${data.summary}`;
    
    return response;
  };

  const formatDate = (dateString) => {
    if (dateString === 'today') return 'Today';
    if (dateString === 'yesterday') return 'Yesterday';
    if (dateString === 'latest') return 'Latest News';
    if (dateString && dateString.includes('-')) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return dateString;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <MessageCircle className="header-icon" size={28} />
          <div>
            <h1>News Agent</h1>
            <p>AI-Powered News Assistant</p>
          </div>
        </div>
      </div>

      <div className="chatbot-messages" ref={chatContainerRef}>
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <InputArea 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        inputRef={inputRef}
      />

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
