// const io = require('socket.io')(3000 || process.env.PORT, {
//     cors: {
//         origin: "*"
//     }
// });

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: ["https://reverent-hoover-b95640.netlify.app/"]
    }
});


const users = {};

io.on('connection', socket => {

    //If any new user joins, let the other users who are connected to server previously let they know.
    socket.on('new-user-joined', name => {
        // console.log(`New user: ${name}`);
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name); // watch out in client.js
    });

    // If someone sends a message, broadcast it to the other people
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] }); // watchout in index.js
    });


    // if Someone leaves the chat let the other user know || "disconnect" is the built-in event
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));