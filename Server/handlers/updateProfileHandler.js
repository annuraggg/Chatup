import express from "express";
const router = express.Router();
import { authenticateToken } from "./tokenHandler.js";
import { userDB } from "./database.js";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";
import { validateName } from "./validators.js";

router.post("/image", authenticateToken, async (req, res) => {
  const { image } = req.body;
  const id = req.user.id;
  const user = await userDB.findOne({ _id: new ObjectId(id) });
  if (user) {
    const delImgId = user.cloudinary_publicID;
    if (delImgId) {
      const del = await cloudinary.uploader.destroy(delImgId);
      if (del) {
      } else {
        res.status(500).json({
          status: "failed",
          message: "Error Processing Your Request. Error Code: PH-01",
        });
      }
    }

    cloudinary.uploader
      .upload(image, {
        privacy: "private",
        resource_type: "auto",
      })
      .then((result) => {
        const picture = result.secure_url;
        const publicID = result.public_id;

        userDB
          .updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                picture: picture,
                cloudinary_publicID: publicID,
              },
            }
          )
          .then((result) => {
            res.json({
              status: "success",
              message: "Image uploaded successfully",
            });
          })
          .catch((error) => {
            console.log({error, code: "PH-02"});
            res.status(500).json({
              status: "failed",
              message: "Error Processing Your Request. Error Code: PH-02",
            });
          });
      })
      .catch((error) => {
        console.error({error, code: "PH-03"});
        res.status(500).json({
          status: "failed",
          message: "Error Processing Your Request. Error Code: PH-03",
        });
      });
  }
});

router.post("/", authenticateToken, validateName("name"), async (req, res) => {
  const { name } = req.body;
  const id = req.user.id;
  const user = await userDB.findOne({ _id: new ObjectId(id) });
  if (user) {
    const result = await userDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name,
        },
      }
    );
    if (result) {
      res.json({ status: "success", message: "Profile Updated" });
    }
  } else {
    res.status(500).json({
      status: "failed",
      message: "Error Processing Your Request. Error Code: PH-04",
    });
  }
});

export default router;
