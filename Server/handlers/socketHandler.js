import { io } from "../index.js";
import jwt from "jsonwebtoken";
import { chatDB, userDB, messageDB } from "./database.js";
import express from "express";
import { ObjectId } from "mongodb";
export const router = express.Router();

export const mongoSockets = {};

export default async function initializeSocket() {
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth.jwtToken;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
      } else {
        socket.mongoID = decoded.id;
        console.log("SACKET");
        console.log(socket.mongoID);
        mongoSockets[socket.mongoID] = socket;
      }

      socket.on("joinRoom", (rooms) => {
        socket.join(rooms);
      });
    });

    // *Handle send_message event
    socket.on("send_message", async (data) => {
      const message_id = new ObjectId();
      const sendData = {
        _id: message_id,
        chatId: data.chatId,
        sender_id: socket.id,
        content: data.message,
        timestamp: data.time,
      };

      socket.to(data.chatId).emit("receive_message", sendData);

      try {
        const chatId = data.chatId;
        const chat = await chatDB.findOne({ _id: new ObjectId(chatId) });
        let receiver;
        chat.participants.forEach((participant) => {
          if (participant !== socket.mongoID) {
            receiver = participant;
          }
        });

        const unseen = chat.unseen;
        if (!unseen.includes(receiver)) {
          await chatDB.updateOne(
            { _id: new ObjectId(chatId) },
            {
              $push: {
                messages: message_id.toString(),
                unseen: receiver,
              },
            }
          );
        } else {
          await chatDB.updateOne(
            { _id: new ObjectId(chatId) },
            {
              $push: { messages: message_id.toString() },
            }
          );
        }

        const messageObj = {
          _id: message_id,
          sender_id: socket.mongoID,
          content: data.message,
          timestamp: data.time,
        };

        await messageDB.insertOne(messageObj);
      } catch (error) {
        console.log(error);
      }
    });
  });

  io.on("disconnect", () => {
    delete socketsByCustomField[socket.customField];
  });
}
