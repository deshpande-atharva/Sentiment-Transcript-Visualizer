import React, { useEffect, useRef } from "react";
import "./TranscriptDisplay.css";

function TranscriptDisplay({ transcript }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="transcript-display" ref={scrollRef}>
      <h3>Transcript</h3>
      <div className="transcript-content">
        {transcript.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
}

export default TranscriptDisplay;
