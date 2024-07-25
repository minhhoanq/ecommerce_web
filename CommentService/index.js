const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const FeedbackServices = require("./src/services/feedback.service");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./src/routes/feedback.route");
const { RPCObserver } = require("./src/utils/kafka");
const feedbackService = require("./src/services/feedback.service");
dotenv.config();

const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const port = process.env.PORT || 7000;

global.__basedir = __dirname;
global._io = io;

// Router
RPCObserver("FEED_BACK", feedbackService);
app.use("/", router);

// Connect socket
global._io.on("connection", FeedbackServices.connection);

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}`);
});

module.exports = app;
