import React from "react";
import "./KeywordsDisplay.css";

function KeywordsDisplay({ keywords }) {
  return (
    <div className="keywords-display">
      <h3>Keywords</h3>
      <div className="keywords-container">
        {keywords.map((keyword, index) => (
          <span
            key={`${keyword}-${index}`}
            className="keyword-tag"
            style={{
              animationDelay: `${index * 0.15}s`,
              "--float-delay": `${index * 0.15}s`,
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KeywordsDisplay;
