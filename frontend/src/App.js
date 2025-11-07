import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import TranscriptDisplay from "./components/TranscriptDisplay";
import KeywordsDisplay from "./components/KeywordsDisplay";
import AuraVisualization from "./components/AuraVisualization";
import axios from "axios";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [fullTranscript, setFullTranscript] = useState("");
  const [sentiment, setSentiment] = useState(0);
  const [targetSentiment, setTargetSentiment] = useState(0);
  const [emotion, setEmotion] = useState("neutral");
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);

  const websocketRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  // Smooth sentiment transition animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment((prev) => {
        const diff = targetSentiment - prev;
        if (Math.abs(diff) < 0.01) {
          return targetSentiment;
        }
        return prev + diff * 0.1; // Smooth lerp
      });
    }, 50);

    return () => clearInterval(interval);
  }, [targetSentiment]);

  const startRecording = async () => {
    console.log("🎤 Start button clicked");

    // Reset state
    setTranscript([]);
    setFullTranscript("");
    setSentiment(0);
    setTargetSentiment(0);
    setEmotion("neutral");
    setKeywords([]);
    setError(null);

    try {
      console.log("📡 Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;
      console.log("✅ Microphone access granted");

      const deepgramKey = process.env.REACT_APP_DEEPGRAM_API_KEY;

      if (!deepgramKey) {
        throw new Error(
          "Deepgram API key not found. Please check your .env file."
        );
      }

      const wsUrl =
        "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1";
      console.log("🌐 Connecting to Deepgram...");

      const deepgramWs = new WebSocket(wsUrl, ["token", deepgramKey]);
      websocketRef.current = deepgramWs;

      deepgramWs.onopen = () => {
        console.log("✅ Deepgram WebSocket connected");

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          if (deepgramWs.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);

            const int16Data = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            deepgramWs.send(int16Data.buffer);
          }
        };

        console.log("🎙️ Audio processing started");
      };

      deepgramWs.onmessage = async (message) => {
        const data = JSON.parse(message.data);

        if (data.type === "Metadata") {
          return;
        }

        const transcriptText = data.channel?.alternatives?.[0]?.transcript;

        if (transcriptText && transcriptText.trim() !== "") {
          console.log("📝 Transcript chunk:", transcriptText);

          setTranscript((prev) => [...prev, transcriptText]);

          if (data.is_final) {
            setFullTranscript((prev) => prev + " " + transcriptText);
          }
        }
      };

      deepgramWs.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setError(
          "Connection error with transcription service. Please try again."
        );
      };

      deepgramWs.onclose = (event) => {
        console.log("🔌 WebSocket closed:", event.code);
        if (event.code !== 1000 && event.code !== 1005) {
          setError("Transcription service disconnected unexpectedly.");
        }
      };

      setIsRecording(true);
      console.log("✅ Recording started successfully");
    } catch (error) {
      console.error("❌ Error starting recording:", error);
      setError(
        error.message ||
          "Could not access microphone. Please check permissions."
      );
    }
  };

  const stopRecording = async () => {
    console.log("⏹️ Stop button clicked");

    // Disconnect audio processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);

    // Analyze the full transcript
    if (fullTranscript.trim() !== "") {
      console.log("📊 Analyzing full transcript:", fullTranscript);
      setIsAnalyzing(true);

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        if (!backendUrl) {
          throw new Error(
            "Backend URL not configured. Please check your .env file."
          );
        }

        const response = await axios.post(
          `${backendUrl}/process_text`,
          { text: fullTranscript.trim() },
          { timeout: 30000 }
        );

        console.log("🎯 Final analysis:", response.data);

        // Smooth transition to target sentiment
        setTargetSentiment(response.data.sentiment);
        setEmotion(response.data.emotion);
        setKeywords(response.data.keywords);
        setError(null);
      } catch (error) {
        console.error("❌ Error analyzing full transcript:", error);
        if (error.code === "ECONNABORTED") {
          setError("Analysis timed out. Please try again with shorter speech.");
        } else if (error.response) {
          setError(
            `Analysis failed: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          setError(
            "Cannot connect to backend. Please make sure the server is running."
          );
        } else {
          setError(error.message || "An error occurred during analysis.");
        }
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setError("No speech detected. Please try speaking again.");
    }
  };

  return (
    <div className="App">
      <AuraVisualization
        sentiment={sentiment}
        emotion={emotion}
        keywords={keywords}
      />

      <div className="overlay">
        <div className="controls">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? "recording" : ""}
            disabled={isAnalyzing}
          >
            {isAnalyzing
              ? "⏳ Analyzing..."
              : isRecording
              ? "⏹ Stop & Analyze"
              : "🎤 Start"}
          </button>
          <div className={`recording-indicator ${isRecording ? "active" : ""}`}>
            {isRecording
              ? "🔴 Recording"
              : isAnalyzing
              ? "🧠 Analyzing"
              : "⚫ Not Recording"}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Analyzing sentiment and extracting keywords...</p>
          </div>
        )}

        <TranscriptDisplay transcript={transcript} />
        <KeywordsDisplay keywords={keywords} />
      </div>
    </div>
  );
}

export default App;
