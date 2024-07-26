import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
// import passport from "passport";
// const passportSetup = require("./utils/passport");
import cookieSession from "cookie-session";
import router from "./presentation/routes";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import initEs from "./infrastructure/elasticsearch/index";
import { container } from "./infrastructure/di/inversify.config";
import { TYPES } from "./shared/constants/types";
import { OrderService } from "./application/usecases/order/order.service";
import { RPCObserver } from "./infrastructure/rabbitmq";
import dotenv from "dotenv";
dotenv.config();

const app = express();
// app.use(cookieParser());

app.use(
    cookieSession({
        name: "session",
        keys: ["lama"],
        maxAge: 24 * 60 * 60 * 100,
    })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

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

//init elasticsearch
initEs.init({
    ELASTICSEARCH_IS_ENABLED: true,
});

const service = container.get<OrderService>(TYPES.OrderService);
RPCObserver(process.env.FEEDBACK_MAIN_RPC as string, service);
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
