# News Agent - React Frontend

A beautiful, modern React chatbot interface for the AI News Agent backend.

## Features

✨ **Modern UI Design**
- Gradient theme with smooth animations
- Responsive design for mobile and desktop
- Clean, intuitive chat interface

💬 **Chat Features**
- Real-time message display
- Loading indicators
- Error handling
- Typing animations
- Message timestamps

🎨 **Best Practices**
- Component-based architecture
- Clean code structure
- Accessibility considerations
- Smooth UX transitions

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Configuration

Make sure your backend server is running on `http://localhost:5000` or update the API_URL in `src/components/ChatBot.js`.

## Usage

The chatbot is ready to use! Try asking:
- "Tell me today's news about AI"
- "What's the latest news on technology?"
- "Get me yesterday's news about sports"
- "Recent developments in climate change"

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatBot.js       # Main chatbot component
│   │   ├── ChatBot.css
│   │   ├── Message.js       # Individual message component
│   │   ├── Message.css
│   │   ├── MessageList.js   # Message list container
│   │   ├── MessageList.css
│   │   ├── InputArea.js     # Input form component
│   │   └── InputArea.css
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Technologies Used

- React 18
- Lucide React (icons)
- CSS3 with animations
- Axios (for API calls)

## Customization

### Changing the API URL
Edit `src/components/ChatBot.js`:
```javascript
const API_URL = 'http://your-backend-url:port/ask';
```

### Customizing Colors
Edit the CSS files to change the gradient colors:
- Primary: `#667eea`
- Secondary: `#764ba2`

### Adding Features
The component structure makes it easy to add:
- Message history persistence
- File uploads
- Voice input
- More interactive features

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## License

MIT
