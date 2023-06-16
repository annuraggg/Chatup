import { io } from "socket.io-client";
import Cookies from "js-cookie";

// Create and configure the socket instance
const jwtToken = Cookies.get("jwt")
const socket = io(`${import.meta.env.VITE_MAIN_SERVER}`, {
  auth: {
    jwtToken: jwtToken,
  },
});

export default socket;
