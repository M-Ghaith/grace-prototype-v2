import React from 'react';


const ChatMessage = ({content}) => {
  const lines = content.content.split("\n");
  return (
    <div
      key={content.timestamp || Date.now()} // Use timestamp as key or generate new one
      className={`chat-message ${
        content.role === "assistant" ? "chatgpt" : ""
      } ${content.role}`}
    >
      <div className="chat-message-center">
        <div className={`avatar ${content.role === "assistant" ? "chatgpt" : ""}`}>
        </div>
        <div className="message">
          {lines.map((line, index) => (<div key={index}>{line}</div>))}
          </div>
      </div>
    </div>
  );
};

export default ChatMessage;
