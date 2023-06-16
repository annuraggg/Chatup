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

  const showSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("active");
    const chat = document.querySelector(".chat");
    chat.classList.add("notactive");
  }

  return (
    <div className="chat_header">
      <i className="fa-solid fa-bars" onClick={showSidebar}></i>
      <div className="name">{name}</div>
    </div>
  );
};

export default Chat_Header;
