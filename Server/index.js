import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { engine } from "express-handlebars";
import signupHandler from "./handlers/signupHandler.js";
import chatHandler from "./handlers/chatHandler.js";
import updateProfileHandler from "./handlers/updateProfileHandler.js";
import newChatHandler from "./handlers/newChatHandler.js";
import seenHandler from "./handlers/seenHandler.js";
import initializeSocket from "./handlers/socketHandler.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export { io };

const publicPath = path.join(process.cwd(), "public");

const { PORT } = process.env;

app.use(express.static(publicPath));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.set("view engine", "handlebars");
app.set("views", "views");
app.engine("handlebars", engine());

import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// * ROUTES

app.use("/signup", signupHandler);
app.use("/chat", chatHandler);
app.use("/updateProfile", updateProfileHandler);
app.use("/newChat", newChatHandler);
app.use("/seen", seenHandler);

app.get("/", (req, res) => {
  res.render("index");
})

initializeSocket();

server.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
