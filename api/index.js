import express from "express";
import cors from "cors";
import chatRoute from "../routes/chatroute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ask", chatRoute);

// export for serverless
export default app;

