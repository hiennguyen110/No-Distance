const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const Filter = require("bad-words");
const {generateMessage, generateLocationMessage} = require("./utils/message.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public/");

app.use(express.static(publicDirPath));

// This is the messages
io.on("connection", (socket) => {
    const filter = new Filter();
    console.log("Accepting new connection ...");
    
    socket.emit("greetingMess", generateMessage("Hey, welcome to the town :}}}"));
    socket.broadcast.emit("newUser", generateMessage("Added new user"));

    socket.on("new_message", (message, callback) => {
        if (filter.isProfane(message)){
            return callback("This message contains some bad words ...");
        } else {
            console.log("Sending updated message back to the client ...");
            io.emit("updatedMessage", generateMessage(message));
            callback(generateMessage("Passed !!!"));
        }
    });

    socket.on("user-location", (location, callback) => {
        console.log("New location recieved from the user ...");
        console.log("Latitude: ", location.latitude);
        console.log("Longtitude: ", location.longtitude);
        io.emit("iLocation", location.latitude, location.longtitude, generateLocationMessage(location.locationLink));
        return callback("Location has been shared to the public ...");
    });

    socket.on("disconnect", () => {
        io.emit("updatedMessage", generateMessage("A friend has left the town :[[["));
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// The server will recieve the message from a client
// The message will be checked if there is some bad words in it or not
// The message will be returned back to the client using callback function

// On the client side
// In the sending function, the client will get a message using the callback