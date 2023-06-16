// Sidebar.jsx

import React, { useState } from "react";
import Sidebar_Header from "./Sidebar_Header";
import Sidebar_Chats from "./Sidebar_Chats";
import Settings from "../../Settings";
import NewChat from "../../NewChat";

const Sidebar = ({ sidebar, onSelectChat, user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState(false);
  const [newChat, setNewChat] = useState(false);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Filter the sidebar chats based on the search term
  const filteredSidebar = sidebar.filter((chat) =>
    chat.chat_name.some((name) => name.name.includes(searchTerm))
  );

  const openSettings = () => {
    setSettings(true);
  };

  const closeSettings = () => {
    setSettings(false);
  };

  const openNewChat = () => {
    setNewChat(true);
  };

  const closeNewChat = () => {
    setNewChat(false);
  };

  return (
    <div className="sidebar">
      <Sidebar_Header
        handleSearch={handleSearch}
        searchValue={searchTerm}
        openSettings={openSettings}
        openNewChat={openNewChat}
      />
      <Sidebar_Chats sidebar={filteredSidebar} onSelectChat={onSelectChat} />

      <Settings settings={settings} closeSettings={closeSettings} user={user} />
      <NewChat newChat={newChat} closeNewChat={closeNewChat} user={user} />
    </div>
  );
};

export default Sidebar;
