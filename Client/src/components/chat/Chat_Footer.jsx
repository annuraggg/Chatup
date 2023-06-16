import React, { useState } from "react";
import socket from "../../socket.js";

const Chat_Footer = ({ selectedChat, sentMessage }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const chatId = selectedChat.chat_id;
    const time = new Date().toISOString();

    socket.emit("send_message", {
      chatId,
      to: selectedChat.chat_name,
      message,
      time,
    });

    sentMessage(chatId, selectedChat.chat_name, message, time);

    setMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="chat_footer">
      <input
        type="text"
        className="message"
        placeholder="Enter a Message to Send"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
      <i className="fa-solid fa-paper-plane-top" onClick={sendMessage}></i>
    </div>
  );
};

export default Chat_Footer;
