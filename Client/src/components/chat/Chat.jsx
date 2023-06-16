// Chat.jsx

import React, { useState, useEffect } from "react";
import Chat_Header from "./Chat_Header";
import Chat_Body from "./Chat_Body";
import Chat_Footer from "./Chat_Footer";

const Chat = ({ selectedChat, messageCount, sentMessage }) => {
  if (!selectedChat) {
    return (
      <div className="no_chat">
        <div className="🤚">
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="🌴"></div>
          <div className="👍"></div>
        </div>
        <p>Select a chat to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="chat">
      <Chat_Header selectedChat={selectedChat} />
      <Chat_Body selectedChat={selectedChat} />
      <Chat_Footer selectedChat={selectedChat} sentMessage={sentMessage} />
    </div>
  );
};

export default Chat;
