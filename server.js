import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoute from "./routes/chatroute.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/ask", chatRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` AI News Agent API running on port ${PORT}`);
});


