// Chat.jsx

import React, { useState, useEffect } from "react";
import Chat_Header from "./Chat_Header";
import Chat_Body from "./Chat_Body";
import Chat_Footer from "./Chat_Footer";

const Chat = ({ selectedChat, messageCount, sentMessage }) => {
  const showSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("active");
    const chat = document.querySelector(".chat");
    const nochat = document.querySelector(".no_chat");
    chat.classList.add("notactive");
    nochat.classList.add("notactive");
  };

  if (!selectedChat) {
    return (
      <div className="no_chat">
        <i className="fa-solid fa-bars" onClick={showSidebar} id="ham"></i>
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
