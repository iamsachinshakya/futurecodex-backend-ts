import express, { Request, Response } from "express";
import logger from "./utils/logger";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    logger.info("GET /");
    res.status(200).json({ message: "Hello World 🌍" });
});

export default app;
