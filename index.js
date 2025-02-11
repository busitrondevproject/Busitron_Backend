import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import cors from "cors";
import { app } from "./app.js";

dotenv.config();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Unable to connect mongoDB server.... ${err}`);
    });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
