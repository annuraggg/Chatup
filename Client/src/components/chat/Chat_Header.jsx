import React from "react";

const Chat_Header = ({ selectedChat }) => {
  let name = "";
  if (selectedChat) {
    selectedChat.chat_name.forEach((chat, index) => {
      if (index !== 0) {
        name = name + ",";
      }
      name = name + chat.name;
    });
  }

  return (
    <div className="chat_header">
      <div className="image">
        <img srcSet="" alt="" />
      </div>
      <div className="name">{name}</div>
    </div>
  );
};

export default Chat_Header;
