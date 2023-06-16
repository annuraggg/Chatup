import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";
const {
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD,
  MONGO_DB_CLUSTER,
  MONGO_DB_DATABASE,
} = process.env;
const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_CLUSTER}/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const otpDB = mongoClient.db(MONGO_DB_DATABASE).collection("otp");
export const userDB = mongoClient.db(MONGO_DB_DATABASE).collection("user");
export const chatDB = mongoClient.db(MONGO_DB_DATABASE).collection("chats");
export const messageDB = mongoClient.db(MONGO_DB_DATABASE).collection("messages")
