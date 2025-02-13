import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

import authRouter from "./route/auth.route.js";
import content from './route/email.routes.js';

app.use("/api/v1/auth", authRouter);
app.use("/email",content);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export { app };
