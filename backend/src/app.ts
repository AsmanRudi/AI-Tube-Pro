import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Semua API
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
    res.json({
        app: "AI Tube Pro API",
        version: "1.0.0",
        status: "running"
    });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;