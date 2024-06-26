import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
// import passport from "passport";
// const passportSetup = require("./utils/passport");
import cookieSession from "cookie-session";
import router from "./presentation/routes";

const app = express();
// app.use(cookieParser());

app.use(
    cookieSession({
        name: "session",
        keys: ["lama"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

// app.use(passport.initialize());
// app.use(passport.session());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
// app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/api/v1", router);

// handling error
app.use((_req, _res, next) => {
    const error = new Error("Not found") as any;
    error.status = 404;
    next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: error.status || "error",
        reasonStatuscode: `error ${statusCode}`,
        message: error.message || "Server error",
    });
});

export default app;
