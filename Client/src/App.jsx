import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Sidebar from "./components/Sidebar/Sidebar";
import "./assets/css/normalize.css";
import "./assets/fa/css/all.css";
import "./assets/css/App.css";
import Chat from "./components/chat/Chat";
import socket from "./socket.js";

console.log(import.meta.env.VITE_MAIN_SERVER)
const App = () => {
  const [sidebar, setSidebar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwtToken = Cookies.get("jwt");

    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_MAIN_SERVER}/chat/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`,
          },
        });

        if (res.status !== 200) {
          window.location.href = `${import.meta.env.VITE_MAIN_SERVER}/signup`;
          return;
        }

        const response = await res.json();
        setUser(response.user);

        if (response.status === "success") {
          const data = response.data;
          const uid = response.user._id;
          const newSidebar = data.map((chat) => {
            let read = true;
            if (chat.unseen.includes(uid)) {
              read = false;
            }

            const id = chat._id;
            const chat_name = chat.participants.filter(
              (participant) => participant !== jwtToken
            );
            let date;
            if (chat.messages.length === 0) {
              date = new Date();
            } else {
              const last_time_object =
                chat.messages[chat.messages.length - 1].timestamp;
              date = new Date(last_time_object);
            }

            const today = new Date();
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            let last_time;
            if (isToday) {
              last_time = date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
              });
            } else {
              const options = {
                day: "numeric",
                month: "short",
              };

              if (date.getFullYear() !== today.getFullYear()) {
                options.year = "numeric";
              }

              last_time = date.toLocaleDateString("en-US", options);
            }

            let last_message;
            if (chat.messages.length === 0) {
              last_message = "No messages yet";
            } else {
              last_message = chat.messages[chat.messages.length - 1].content;
            }
            return {
              id: response.userid,
              chat_id: id,
              chat_name: chat_name,
              last_time: last_time,
              last_message: last_message,
              messages: chat.messages,
              picture: chat.picture,
              read: read,
            };
          });
          newSidebar.sort((a, b) => {
            const latestMessageA = a.messages[a.messages.length - 1];
            const latestMessageB = b.messages[b.messages.length - 1];

            if (!latestMessageA || !latestMessageB) {
              return 0;
            }

            const timestampA = new Date(latestMessageA.timestamp).getTime();
            const timestampB = new Date(latestMessageB.timestamp).getTime();

            if (isNaN(timestampA) || isNaN(timestampB)) {
              return 0; 
            }

            return timestampB - timestampA; 
          });

          setSidebar(newSidebar);
          setIsLoading(false);
          newSidebar.forEach((chat) => {
            socket.emit("joinRoom", chat.chat_id);
          });
        } else {
          console.log("Error");
          alert("Error. You can report this to me at bugs@anuragsawant.tech")
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        alert("You can report this to me at bugs@anuragsawant.tech with a screenshot of the console log")
      }
    };

    fetchData();
  }, []);

  const handleSelectChat = (chatId) => {
    const selectedChat = sidebar.find((chat) => chat.chat_id === chatId);
    const updatedMessages = selectedChat.messages.map((message) => {
      fetch(`${import.meta.env.VITE_MAIN_SERVER}/seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify({
          chatId: chatId,
        }),
      });

      if (message.sender_id === selectedChat.id) {
        return { ...message, type: "sender" };
      } else {
        return { ...message, type: "receiver" };
      }
    });

    const updatedChat = { ...selectedChat, messages: updatedMessages };
    setSelectedChat(updatedChat);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setSidebar((prevSidebar) => {
        const updatedSidebar = prevSidebar.map((chat) => {
          if (chat.chat_id === data.chatId) {
            const updatedMessages = [
              ...chat.messages,
              {
                _id: data._id,
                content: data.content,
                type: chat.id === data.sender_id ? "sender" : "receiver",
                timestamp: data.timestamp,
              },
            ];

            const lastMessage = updatedMessages[updatedMessages.length - 1];
            const lastTime = new Date(lastMessage.timestamp);
            const today = new Date();
            const isToday =
              lastTime.getDate() === today.getDate() &&
              lastTime.getMonth() === today.getMonth() &&
              lastTime.getFullYear() === today.getFullYear();
            let formattedLastTime;
            if (isToday) {
              formattedLastTime = lastTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
              });
            } else {
              const options = {
                day: "numeric",
                month: "short",
              };

              if (lastTime.getFullYear() !== today.getFullYear()) {
                options.year = "numeric";
              }

              formattedLastTime = lastTime.toLocaleDateString("en-US", options);
            }

            return {
              ...chat,
              messages: updatedMessages,
              last_message: lastMessage.content,
              last_time: formattedLastTime,
              read: false,
            };
          }
          return chat;
        });

        return updatedSidebar;
      });

      setSelectedChat((prevChat) => {
        if (prevChat && prevChat.chat_id === data.chatId) {
          const updatedMessages = [
            ...prevChat.messages,
            {
              _id: data._id,
              content: data.content,
              type: prevChat.id === data.sender_id ? "sender" : "receiver",
              timestamp: data.timestamp,
            },
          ];
          return { ...prevChat, messages: updatedMessages };
        }
        return prevChat;
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sentMessage = (chatId, to, message, time) => {
    const newMessage = {
      content: message,
      type: "sender",
      timestamp: time,
    };

    setSelectedChat((prevSelectedChat) => ({
      ...prevSelectedChat,
      messages: [...prevSelectedChat.messages, newMessage],
    }));

    const lastTime = new Date(time);
    const today = new Date();
    const isToday =
      lastTime.getDate() === today.getDate() &&
      lastTime.getMonth() === today.getMonth() &&
      lastTime.getFullYear() === today.getFullYear();
    let formattedLastTime;
    if (isToday) {
      formattedLastTime = lastTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    } else {
      const options = {
        day: "numeric",
        month: "short",
      };

      if (lastTime.getFullYear() !== today.getFullYear()) {
        options.year = "numeric";
      }

      formattedLastTime = lastTime.toLocaleDateString("en-US", options);
    }

    setSidebar((prevSidebar) => {
      const updatedSidebar = prevSidebar.map((chat) => {
        if (chat.chat_id === chatId) {
          return {
            ...chat,
            last_message: message,
            last_time: formattedLastTime,
          };
        }
        return chat;
      });

      const ua = moveObjectToTop(updatedSidebar, "chat_id", chatId);

      function moveObjectToTop(arr, property, value) {
        const index = arr.findIndex((obj) => obj[property] === value);

        if (index !== -1) {
          const obj = arr.splice(index, 1)[0];
          arr.unshift(obj);
        }

        return arr;
      }

      return ua;
    });
  };

  if (isLoading) {
    return (
      <div className="loading">
        <svg viewBox="0 0 1320 300">
          <text x="50%" y="50%" dy=".35em" textAnchor="middle">
            Chatup
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="main" id="main">
      <Sidebar sidebar={sidebar} onSelectChat={handleSelectChat} user={user} />
      <Chat selectedChat={selectedChat} sentMessage={sentMessage} />
    </div>
  );
};

export default App;
