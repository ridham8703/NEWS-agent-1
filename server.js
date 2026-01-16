import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoute from "../routes/chatroute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ask", chatRoute);

// ❌ REMOVE app.listen()
// ✅ EXPORT app instead

export default app;
