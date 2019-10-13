const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public/");

app.use(express.static(publicDirPath));

// This is the messages
let messages = [];

io.on("connection", (socket) => {
    console.log("Accepting new connection ...");
    io.emit("updatedMessage", messages);
    socket.on("new_message", (message) => {
        messages.push(message);
        console.log("Sending updated message back to the client ...");
        io.emit("updatedMessage", messages);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});