import express from "express";
const router = express.Router();
import fetch from "node-fetch";
import { authenticateToken } from "./tokenHandler.js";
import { validatePhone } from "./validators.js";
import { chatDB, userDB } from "./database.js";
import fs from "fs";
import { mongoSockets } from "./socketHandler.js";

router.post(
  "/",
  authenticateToken,
  //validatePhone("phone"),
  async (req, res) => {
    const { phone } = req.body;
    try {
      const user = await userDB.findOne({ phone });

      if (user) {
        const id = req.user.id;
        if (id === user._id.toString()) {
          res.status(400).json({ message: "You can't add yourself" });
          return;
        }
        const uid = user._id.toString();

        const checkExist = await chatDB.findOne({ participants: [id, uid] });
        if (checkExist) {
          res.status(400).json({ message: "Chat already exists" });
          return;
        }
        let imageBuffer;
        if (user.picture) {
          const response = await fetch(user.picture);
          imageBuffer = await response.buffer();
        } else {
          const fallbackImagePath = "./public/img/fallbackProfile.jpg";
          imageBuffer = fs.readFileSync(fallbackImagePath);
        }
        const base64Picture1 = imageBuffer.toString("base64");

        const name = user.name;
        const picture = base64Picture1;

        const data = {
          name,
          picture,
        };

        res.status(200).json({ data });
      } else {
        res.status(400).json({ message: "No User Found" });
      }
    } catch (e) {
      console.log({ error: e, code: "NCH-01" });
      res.status(500).json({ message: "Server error. Error Code: NCH-01" });
    }
  }
);

router.post("/add", authenticateToken, async (req, res) => {
  const { phone } = req.body;
  const id = req.user.id;

  try {
    const userData = await userDB.findOne({ phone });
    if (userData) {
      const oid = userData._id.toString();
      if (id === oid) {
        res.status(400).json({ message: "You can't add yourself" });
        return;
      }

      const checkExist = await chatDB.findOne({ participants: [id, oid] });
      if (checkExist) {
        res.status(400).json({ message: "Chat already exists" });
        return;
      }

      const data = {
        participants: [id, oid],
        messages: [],
        unseen: [],
      };

      await chatDB.insertOne(data);
      const socket = mongoSockets[oid];
      console.log("SOCKET IS")
      console.log(socket);
      socket.emit("new_chat", { chatId: data._id.toString() });
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ message: "No User Found" });
    }
  } catch (e) {
    console.log({ error: e, code: "NCH-02" });
    res.status(500).json({ message: "Server error. Error Code: NCH-02" });
  }
});

export default router;
