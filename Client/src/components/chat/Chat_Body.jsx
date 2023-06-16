import React, { useRef, useEffect } from "react";

const Chat_Body = ({ selectedChat }) => {
  let currentDate = null;
  let currentTime = null;

  const chatBodyRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  };

  return (
    <div className="chat_body" id="chat_body" ref={chatBodyRef}>
      {selectedChat.messages.map((message, index) => {
        const messageDate = new Date(message.timestamp);
        const messageTime = messageDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
        });

        let showDate = false;
        let showTime = true;

        if (!currentDate || currentDate.getDate() !== messageDate.getDate()) {
          currentDate = messageDate;
          currentTime = messageTime;
          showDate = true;
          showTime = true;
        } else if (currentTime !== messageTime) {
          currentTime = messageTime;
          showTime = true;
        }

        return (
          <div key={index}>
            {showDate && (
              <div className="date-wrapper">
                <div className="date">
                  {messageDate.toLocaleDateString([], {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
            <div className={message.type === "sender" ? "sender" : "receiver"}>
              <div className="avatar">
              </div>
              <div className="message">
                <div className="mess">{message.content}</div>
                {showTime && <div className="time">{messageTime}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chat_Body;
