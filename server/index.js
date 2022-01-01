// const io = require('socket.io')(3000 || process.env.PORT, {
//     cors: {
//         origin: "*"
//     }
// });

// const express = require("express")
// const http = require("http");
// var app = express();
// const cors = require('cors');
// app.use(cors());
// var server = app.listen(4000 || process.env.PORT);
// var io = require('socket.io')(server, {
//     cors: {
//       origin: '*',
//     }
// });

var express = require('express'),
    app = express(), 
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path');
server.listen(3000 || process.env.PORT);

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
