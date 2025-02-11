import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(cookieParser());

import authRouter from "./route/auth.route.js";

app.use(
    "/api/v1/auth",
    (req, res, next) => {
        console.log("onm iddle ware");
        next();
    },
    authRouter
);

export { app };
