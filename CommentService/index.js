const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const SocketServices = require("./src/services/comment.service");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const port = process.env.PORT || 3000;

global.__basedir = __dirname;
global._io = io;

// Router
app.use("/api/v1", require("./src/routes/comment.route"));

// Connect socket
global._io.on("connection", SocketServices.connection);

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}`);
});

module.exports = app;
