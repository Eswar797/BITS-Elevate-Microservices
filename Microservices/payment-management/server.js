import { authenticateUser } from "./middlewares/authMiddleware.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import paymentManagementController from "./controllers/paymentControler.js";
import traceMiddleware from "./middlewares/traceMiddleware.js";

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

// Check if we're in test mode
const isTestMode = process.env.PAYMENT_BYPASS === 'true';
console.log(`Payment service running in ${isTestMode ? 'TEST' : 'NORMAL'} mode`);

// Routes - bypass authentication in test mode
if (isTestMode) {
  console.log('TEST MODE: Authentication check bypassed for easier testing');
  app.use('/api/paymentMangement', paymentManagementController);
} else {
  app.use('/api/paymentMangement', authenticateUser, paymentManagementController);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
