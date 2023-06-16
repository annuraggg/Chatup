import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { chatDB, userDB, messageDB } from "./database.js";
import { authenticateToken } from "./tokenHandler.js";
import { ObjectId } from "mongodb";
import fs from "fs";

const router = express.Router();

router.post("/get", authenticateToken, async (req, res) => {
  let base64Picture;
  const id = req.user.id;

  try {
    const chats = await chatDB.find({ participants: id }).toArray();

    const chatDataPromises = chats.map(async (chat) => {
      const participantPromises = chat.participants
        .filter((participant) => participant !== id)
        .map(async (participant) => {
          const user = await userDB.findOne({ _id: new ObjectId(participant) });

          let imageBuffer;
          const up = user.picture;
          if (up) {
            const response = await fetch(up);
            imageBuffer = await response.buffer();
          } else {
            const fallbackImagePath = "./public/img/fallbackProfile.jpg";
            imageBuffer = fs.readFileSync(fallbackImagePath);
          }

          base64Picture = imageBuffer.toString("base64");

          return {
            ...user,
            picture: base64Picture,
          };
        });

      const messagePromises = chat.messages.map(async (message) => {
        const foundMessage = await messageDB.findOne({
          _id: new ObjectId(message),
        });
        return foundMessage;
      });

      const [participants, messages, unseen] = await Promise.all([
        Promise.all(participantPromises),
        Promise.all(messagePromises),
      ]);

      return {
        _id: chat._id,
        participants,
        messages,
        unseen: chat.unseen
      };
    });

    const user = await userDB.findOne({ _id: new ObjectId(id) });
    const up = user.picture;

    let imageBuffer;
    if (up) {
      const response = await fetch(up);
      imageBuffer = await response.buffer();
    } else {
      const fallbackImagePath = "./public/img/fallbackProfile.jpg";
      imageBuffer = fs.readFileSync(fallbackImagePath);
    }

    const base64Picture1 = imageBuffer.toString("base64");

    user.picture = base64Picture1;

    const chatData = await Promise.all(chatDataPromises);
    res.json({
      status: "success",
      data: chatData,
      userid: req.user.id,
      user: user,
    });
  } catch (error) {
    console.log({error, code: "CH-01"});
    res.json({ status: "failed", message: "Error fetching chats. Error Code: CH-01" });
  }
});

export default router;
