import app from "./src/app";
import dotenv from "dotenv";
dotenv.config();

const server = app.listen(process.env.PORT, async () => {
    console.log("Server runing on port: " + process.env.PORT);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Exit server express!"));
});
