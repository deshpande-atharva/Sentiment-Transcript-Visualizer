# 🌊 Sentiment Aura Visualizer

A real-time audio sentiment visualization application that transforms spoken words into a living, breathing coastal metropolis. The cityscape dynamically responds to emotional tone - from stormy seas during negative sentiment to sunny skies with calm waters during positive moments.

![Demo Screenshot](assets/images/sentiment0.png)
![Demo Screenshot](assets/images/sentiment+ve.png)
![Demo Screenshot](assets/images/sentiment-ve.png)


## ✨ Features

### 🎤 Real-Time Audio Processing
- Live speech-to-text transcription using Deepgram API
- WebSocket streaming for instant feedback
- Automatic sentence detection and finalization

### 🧠 AI-Powered Sentiment Analysis
- Claude AI integration for emotion detection
- Sentiment scoring from -1 (very negative) to +1 (very positive)
- Intelligent keyword extraction from speech

### 🎨 Dynamic Visual Experience

**Coastal Metropolis Scene:**
- 🏙️ Detailed cityscape with multi-layered buildings
- 🌊 Realistic ocean with Perlin noise-based wave physics
- 🌤️ Dynamic weather system (storms, rain, sunshine)
- ⚡ Lightning effects during intense negative emotions
- 🚢 Sailing boats and marine life
- 🐦 Seagulls and atmospheric elements

**Sentiment-Responsive Elements:**
- **Negative Sentiment**: Dark stormy skies, rough seas, heavy rain, lightning strikes
- **Neutral Sentiment**: Overcast conditions, moderate waves, calm atmosphere
- **Positive Sentiment**: Bright sunny skies, calm waters, vibrant colors, sparkling ocean

### 🎭 Visual Mappings

| Sentiment Range | Sky Color | Ocean State | Special Effects |
|----------------|-----------|-------------|-----------------|
| -1.0 to -0.65  | Dark Storm | Rough Seas | ⛈️ Lightning + Heavy Rain |
| -0.65 to -0.25 | Rainy | Choppy Waters | 🌧️ Rain |
| -0.25 to 0.25  | Overcast | Moderate Seas | ☁️ Clouds |
| 0.25 to 0.6    | Partly Cloudy | Gentle Waves | ⛅ Sun Peek |
| 0.6 to 1.0     | Clear & Sunny | Calm Waters | ☀️ Sun Rays + Sparkles |

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **p5.js** (via react-p5) - Canvas-based generative art
- **Axios** - HTTP client
- **WebSocket API** - Real-time audio streaming
- **Web Audio API** - Microphone access and processing

### Backend
- **FastAPI** - Python web framework
- **httpx** - Async HTTP client
- **python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server

### External APIs
- **Deepgram** - Real-time speech-to-text transcription
- **Anthropic Claude** - Sentiment analysis and keyword extraction

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python 3.12
- Deepgram API key ([Get $200 free credits](https://console.deepgram.com/signup))
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/deshpande-atharva/Sentiment-Transcript-Visualizer.git
cd Sentiment-Transcript-Visualizer
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key_here
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3. Backend Setup
```bash
cd ../backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-dotenv httpx
```

Create `backend/.env`:
```env
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key_here
```

## 🎮 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
python main.py
```
Backend will run on `http://localhost:8000`

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will open at `http://localhost:3000`

## 💻 Usage

1. **Click "Start"** - Allow microphone access when prompted
2. **Speak naturally** - Your words will appear as live transcription
3. **Watch the visualization** - The cityscape responds to your emotional tone
4. **Click "Stop & Analyze"** - See the final sentiment analysis with keywords

### Test Sentences

Try these to see dramatic visual changes:

**Negative:**
> "I'm so frustrated and angry. Everything is going terribly wrong and I feel awful."

**Neutral:**
> "The quarterly meeting is scheduled for next Tuesday at three PM."

**Positive:**
> "I'm absolutely thrilled and grateful! This is wonderful and amazing!"

## 🏗️ Project Structure
```
sentiment-aura/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuraVisualization.jsx  # Main p5.js visualization
│   │   │   ├── TranscriptDisplay.jsx  # Live transcript panel
│   │   │   ├── TranscriptDisplay.css
│   │   │   ├── KeywordsDisplay.jsx    # Floating keywords
│   │   │   └── KeywordsDisplay.css
│   │   ├── App.js                     # Main React component
│   │   ├── App.css
│   │   └── index.js
│   ├── .env                           # API keys (not committed)
│   └── package.json
├── backend/
│   ├── main.py                        # FastAPI server
│   ├── .env                           # API keys (not committed)
│   └── requirements.txt
├── .gitignore
└── README.md
```

## 🎨 Technical Highlights

### Perlin Noise Wave System
Uses multi-layered Perlin noise to create realistic ocean wave physics:
- 8 wave layers with different frequencies and amplitudes
- Dynamic intensity based on sentiment
- Foam particle generation during storms
- Caustic light patterns underwater

### Real-Time Data Flow
```
Microphone → WebSocket → Deepgram → Transcript
                                        ↓
                                   Backend API
                                        ↓
                                   Claude AI
                                        ↓
                            Sentiment + Keywords
                                        ↓
                                  Visualization
```

### Sentiment Color Mapping
- **Red/Orange** tones for negative emotions (danger, warning)
- **Yellow/White** for neutral states (calm, balanced)
- **Green/Blue** for positive emotions (harmony, peace)

## 🎯 Key Implementation Details

- **Audio Processing**: ScriptProcessorNode converts Float32 audio to Int16 for Deepgram
- **State Management**: React hooks for smooth sentiment transitions
- **Animation**: 60 FPS p5.js canvas with easing functions
- **Error Handling**: Graceful degradation for API failures and network issues
- **Responsive Design**: Adapts to any screen size

## 📊 Performance Optimizations

- Efficient particle systems with object pooling
- Conditional rendering based on sentiment thresholds
- Optimized gradient rendering
- Depth-sorted rendering for proper layering

## 🔐 Security

- API keys stored in environment variables
- `.env` files excluded from version control
- CORS properly configured
- Input validation on backend

## 🐛 Troubleshooting

**Microphone not working?**
- Ensure HTTPS or localhost
- Check browser permissions
- Verify Deepgram API key

**Backend 500 errors?**
- Check Anthropic API key format
- Verify backend is running on port 8000
- Check backend terminal for detailed errors

**Visualization not updating?**
- Open browser console (F12) for errors
- Verify sentiment values are being received
- Check network tab for failed requests

## 🎓 Learning Resources

- [Perlin Noise Flow Fields](https://sighack.com/post/getting-creative-with-perlin-noise-fields)
- [Deepgram Documentation](https://developers.deepgram.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [p5.js Reference](https://p5js.org/reference/)

## 📝 Future Enhancements

- [ ] Multiple visualization themes
- [ ] Sentiment history graph
- [ ] Export transcript and analysis
- [ ] Voice emotion tone analysis
- [ ] Multi-language support
- [ ] Recording playback feature

## 👨‍💻 Author

**Atharva Deshpande**
- GitHub: [@deshpande-atharva](https://github.com/deshpande-atharva)
- LinkedIn: [Atharva Deshpande](https://www.linkedin.com/in/atharva-deshpande0205)
- Portfolio: [Portfolio](https://deshpande-atharva.github.io/)

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🙏 Acknowledgments

- Built as a take-home assignment for Memory Machines
- Inspired by natural phenomena and emotional landscapes
- Special thanks to the open-source community

---

⭐ **Star this repo if you found it interesting!**

🐛 **Found a bug?** Open an issue  
💡 **Have suggestions?** Pull requests welcome!