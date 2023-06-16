import express from "express";
const router = express.Router();
import { authenticateToken } from "./tokenHandler.js";
import { chatDB } from "./database.js";
import { ObjectId } from "mongodb";

router.post("/", authenticateToken, async (req, res) => {
  const { chatId } = req.body;
  const id = req.user.id;
  await chatDB.updateOne(
    { _id: new ObjectId(chatId) },
    { $pull: { unseen: id } }
  );
});

export default router;
