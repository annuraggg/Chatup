import React from "react";

const Sidebar_Header = ({
  handleSearch,
  searchValue,
  openSettings,
  openNewChat,
}) => {
  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    handleSearch(searchTerm);
  };

  const handleSettings = () => {
    openSettings();
  };

  const handleNewChat = () => {
    openNewChat();
  };

  return (
    <div className="header">
      <div className="search">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Enter a Text to Search"
          value={searchValue}
          onChange={handleInputChange}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
      <div className="buttons">
        <button className="btn" onClick={handleNewChat}>
          New Chat
        </button>
        <button className="btn" onClick={handleSettings}>
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar_Header;
