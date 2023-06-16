import React from "react";

const Sidebar_Chats = ({ sidebar, onSelectChat }) => {
  const getChat = (id, index) => {
    const dot = document.getElementById(`dot-${index}`);
    dot.className = "no-dot";
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("active");
    const chat = document.querySelector(".chat");
    chat.classList.remove("notactive");
    onSelectChat(id);
  };

  return (
    <div className="chats">
      {sidebar.map((chat, index) => (
        <div
          className="chat"
          key={chat.chat_id}
          onClick={() => {
            getChat(chat.chat_id, index);
          }}
        >
          {chat.chat_name.map((name, index) => (
            <div className="avatar" key={index}>
              <img
                srcSet={"data:image/png;base64," + name.picture}
                alt="avatar"
              />
            </div>
          ))}
          <div className="chat-info">
            <div className="chat-info-top">
              {chat.chat_name.map((name, index) => (
                <h3 key={index}>{name.name}</h3>
              ))}
              <p>{chat.last_time}</p>
            </div>
            <div className="chat-info-bottom">
              <p>{chat.last_message}</p>
              <div
                className={chat.read === true ? "dot-hide" : "dot"}
                id={`dot-${index}`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar_Chats;
