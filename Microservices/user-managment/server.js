import authController from "./controllers/authController.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import traceMiddleware from "./middlewares/traceMiddleware.js";
import userManagementController from "./controllers/userManagementController.js";

const app = express();

app.use(cors());
dotenv.config();
const PORT = process.env.PORT;
app.use(bodyParser.json());

const URL = process.env.MONGODB_URI;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(traceMiddleware);

// Connect to MongoDB
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb disconnected!");
});

//routes
app.use("/api/auth", authController);
app.use("/api/userManagement", authenticateUser, userManagementController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
