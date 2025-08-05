# Chatup

**Chatup** is a modern, full-stack real-time chat application enabling seamless person-to-person messaging. It features an interactive, responsive UI, user authentication, contact management, and efficient server communication using sockets. Chatup is designed to provide a fast, secure, and user-friendly chatting experience.

## Features

### 1. Real-Time Messaging
- Instantly send and receive messages using Socket.io/websockets.
- Messages are delivered and displayed in real-time with live updates to the chat interface.

### 2. Chat Management
- Sidebar lists all active chats, displaying avatars, last message, and read/unread status.
- Click a chat to open the conversation and view message history.
- "New Chat" modal lets users start a conversation with any registered phone number.
- Prevents creating duplicate chats and adding yourself as a contact.

### 3. User Experience
- Responsive and animated interface using React and CSS.
- Blurring and transition effects for modals (e.g., starting a new chat).
- Avatars are dynamically generated and loaded from base64 images.
- Unread message indicators (dot) and visual feedback on message receipt.

### 4. Message Features
- Each message displays sender/receiver status and timestamp.
- Smart formatting for timestamps (shows time for today's messages, date for older ones).
- Message input supports quick sending via "Enter" key or send button.

### 5. Authentication and Security
- JWT-based authentication for API requests.
- Secure endpoints for fetching chats, sending/receiving messages, and adding new contacts.

### 6. Backend Logic
- Node.js/Express server with REST APIs for chat, user, and message management.
- MongoDB stores users, chats, and messages.
- User avatars and images are fetched and encoded for efficient transfer.
- Error handling for duplicate chats, self-add attempts, and missing users.

## How It Works

- **Starting a Chat:** Users can search for contacts by phone number. If found, they can start a new chat unless it already exists or is their own number.
- **Sending Messages:** In a chat, users type their message and send it. The server broadcasts the message to both sender and receiver sockets, updating chat history and sidebar.
- **Receiving Messages:** The client listens for incoming messages via a socket connection and updates the active chat and sidebar in real-time.
- **Chat UI:** Displays avatars of participants, message history, and last message details. Unread messages are marked with a dot indicator.

## Tech Stack

- **Frontend:** React, CSS, Cropper.js, Animate.css, jQuery
- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Authentication:** JWT
- **Other:** Base64 image encoding, RESTful APIs

## Getting Started

1. **Clone the repository.**
2. **Install dependencies:**
   - Server: `npm install`
   - Client: `npm install` in the `Client` directory
3. **Configure environment variables:** Set up MongoDB connection and JWT secret.
4. **Start the server:** `npm start`
5. **Start the client:** `npm run dev` in the `Client` directory
6. **Visit the app:** Open your browser at `http://localhost:3000` (default client port).

## Folder Structure

- `Client/` - React frontend source code
- `Server/` - Node.js/Express backend and API handlers
- `public/img/` - Default avatar images
- `Server/handlers/` - Route handlers for chats, new chats, authentication
- `Server/views/` - Handlebars templates for server-rendered pages

## Authors

- [@annuraggg](https://github.com/annuraggg)

## License

MIT License

---

*Chatup provides an efficient and modern solution for peer-to-peer messaging, focusing on performance, usability, and extensibility for personal or team communication projects.*
