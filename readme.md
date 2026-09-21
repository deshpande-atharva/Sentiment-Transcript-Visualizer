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

### Tooling
- **Docker / Docker Compose** - Containerized backend and nginx-served frontend
- **pytest + respx** - Backend API tests with the Anthropic API mocked
- **Jest + React Testing Library** - Frontend tests with browser APIs stubbed
- **ruff / ESLint** - Python and JavaScript linting
- **GitHub Actions** - Lint, test, build and Docker image validation

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
pip install -r requirements.txt

# ...or include the test/lint tooling
pip install -r requirements-dev.txt
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

## 🐳 Running with Docker

Both services are containerized. Copy the root env template and fill in your keys:

```bash
cp .env.example .env
```

Then build and start the stack:

```bash
docker compose up --build
```

The frontend is served by nginx at `http://localhost:3000` and the backend at
`http://localhost:8000`. Compose waits for the backend's health check to pass
before starting the frontend.

To stop:

```bash
docker compose down          # stop and remove containers
docker compose stop          # stop but keep containers
```

**Note on the Deepgram key:** Create React App inlines `REACT_APP_*` variables into
the JavaScript bundle at build time, so `REACT_APP_DEEPGRAM_API_KEY` is passed as a
Docker build argument and is readable by anyone who loads the page. This is true of
`npm start` as well — it is a property of the current client-side transcription
design, not of the container. Use a restricted, rotatable key. The proper fix is to
have the backend mint short-lived Deepgram tokens.

## 🧪 Testing

Backend (pytest, with the Anthropic API mocked via `respx` — no network calls, no API key required):

```bash
cd backend
pip install -r requirements-dev.txt
pytest                    # 21 tests
ruff check .              # lint
```

Frontend (Jest + React Testing Library, with `getUserMedia`, `WebSocket`,
`AudioContext` and `axios` stubbed):

```bash
cd frontend
npm run test:ci           # 36 tests, single run
npm test                  # watch mode
npm run lint
```

Tests never contact Deepgram or Anthropic, so they are deterministic and run
without credentials.

## ⚙️ CI

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`:

| Job | What it validates |
|-----|-------------------|
| `backend` | `ruff` lint and the pytest suite on Python 3.12 |
| `frontend` | ESLint, the Jest suite, and a production `npm run build` on Node 20 |
| `docker` | `docker compose config`, builds both images, then boots each container and asserts the backend health endpoint and the served frontend bundle respond |

The Docker job runs only after the lint/test jobs pass. There is no deployment
step — CI stops at verified image builds.

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
│   │   │   ├── AuraVisualization.jsx        # Main p5.js visualization
│   │   │   ├── TranscriptDisplay.jsx        # Live transcript panel
│   │   │   ├── TranscriptDisplay.test.js
│   │   │   ├── KeywordsDisplay.jsx          # Floating keywords
│   │   │   ├── KeywordsDisplay.test.js
│   │   │   └── *.css
│   │   ├── test-utils/
│   │   │   └── browserMocks.js              # WebSocket / Web Audio / getUserMedia doubles
│   │   ├── App.js                           # Main React component
│   │   ├── App.recording.test.js            # Mic, socket, PCM encoding, teardown
│   │   ├── App.analysis.test.js             # Backend call, sentiment state, errors
│   │   ├── App.css
│   │   └── index.js
│   ├── Dockerfile                           # Multi-stage build -> nginx
│   ├── nginx.conf                           # SPA fallback, caching, /healthz
│   ├── .dockerignore
│   ├── .env                                 # API keys (not committed)
│   └── package.json
├── backend/
│   ├── tests/
│   │   ├── conftest.py                      # TestClient + Anthropic response fixtures
│   │   ├── test_health.py
│   │   ├── test_process_text.py             # Success path, API contract, validation
│   │   └── test_resilience.py               # Upstream failures, malformed LLM output
│   ├── main.py                              # FastAPI server
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pyproject.toml                       # pytest + ruff config
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── .env                                 # API keys (not committed)
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── readme.md
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

- Secrets are supplied via environment variables; no keys in source or Dockerfiles
- `.env` files excluded from version control (`.env.example` is the only committed template)
- CORS restricted to an explicit origin allow-list in `backend/main.py`
- Request bodies validated by Pydantic before any external call is made
- Both containers run as non-root users (`appuser` uid 1001, `nginx` uid 101)

**Known limitation:** the Deepgram key is used directly by the browser, so it is
inlined into the client bundle and is not secret. See the Docker section above.

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