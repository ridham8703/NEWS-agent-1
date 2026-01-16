import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="App">
      <ChatBot />
      <SpeedInsights />
    </div>
  );
}

export default App;
