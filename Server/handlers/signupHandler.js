import express from "express";
import { validatePhone, validateOTP, validateName } from "./validators.js";
import { otpDB, userDB } from "./database.js";
import twilio from "twilio";
import jwt from "jsonwebtoken";

const router = express.Router();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

const twil = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

const handleErrorResponse = (res, message) => {
  return res.json({ status: "failed", message });
};

router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/phone/send", validatePhone("phone"), async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await twil.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });
    if (verification.status === "pending") {
      otpDB.insertOne({ phone: phone, status: "pending" });
      return res.json({ status: "success" });
    } else {
      return handleErrorResponse(
        res,
        "The error is on our side, please try again in a while. Error Code: SH-01"
      );
    }
  } catch (error) {
    console.log({error, code: "SH-02"});
    return handleErrorResponse(
      res,
      "The error is on our side, please try again in a while. Error Code: SH-02"
    );
  }
});

router.post("/phone/verify", async (req, res) => {
  const { phone, otp } = req.body;
  [validatePhone("phone"), validateOTP("otp")];
  try {
    const verification_check = await twil.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });
    if (verification_check.status === "approved") {
      otpDB.updateOne({ phone: phone }, { $set: { status: "approved" } });
      const user = await userDB.findOne({ phone });
      if (user) {
        otpDB.deleteOne({ phone: phone });
        const id = user._id;
        jwt.sign({ id }, process.env.JWT_SECRET, (err, token) => {
          if (err) {
            return handleErrorResponse(
              res,
              "The error is on our side, please try again in a while. Error Code: SH-03"
            );
          }
          return res.json({ status: "login", token });
        });
      } else {
        return res.json({ status: "success", type: "signup" });
      }
    } else {
      return res.json({ status: "failed", message: "Invalid OTP" });
    }
  } catch (error) {
    console.log({error, code: "SH-04"});
    return handleErrorResponse(
      res,
      "The error is on our side, please try again in a while. Error Code: SH-04"
    );
  }
});

router.post(
  "/data",
  [validatePhone("phone"), validateName("name")],
  async (req, res) => {
    const { name, phone } = req.body;

    const otp = await otpDB.findOne({ phone });
    if (!otp || otp.status !== "approved") {
      return handleErrorResponse(res, "Invalid Request");
    }

    const user = await userDB.findOne({ phone });
    if (user) {
      return handleErrorResponse(res, "Invalid Request");
    }

    try {
      otpDB.deleteOne({ phone: phone });
      await userDB.insertOne({ name, phone });
      const userInfo = await userDB.findOne({ phone });
      if (userInfo) {
        const id = userInfo._id;
        jwt.sign({ id }, process.env.JWT_SECRET, (err, token) => {
          if (err) {
            console.log({err, code: "SH-05"});
            return handleErrorResponse(
              res,
              "Something went wrong on our end. Please try again later. Error Code: SH-05"
            );
          } else {
            return res.json({ status: "success", token });
          }
        });
      }
    } catch (error) {
      return handleErrorResponse(
        res,
        "Something went wrong on our end. Please try again later."
      );
    }

    res.json({ status: "success" });
  }
);

export default router;
