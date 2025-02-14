import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
	cors({
		origin: ["http://localhost:5173","http://localhost:5174","http://localhost:5175"],
		credentials: true,
	})
);

import authRouter from "./route/auth.route.js";
import Email from './route/email.route.js';

app.use("/api/v1/email",Email);
app.use("/api/v1/auth", authRouter);

export { app };
