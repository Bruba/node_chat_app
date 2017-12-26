const path = require ('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

//setting up express. we don't configur express by passing in arguments. instead we configure express by calling method on app
// to create routes, add middleware or startup the server
let app = express();

//setting up heroku
const port = process.env.PORT||3000;

//create a server using http library
const server = http.createServer(app);
//configure the server to use socketio
const io = socketIO(server);

//configuring express static middleware
app.use(express.static(publicPath));
io.on('connection',(socket) => {
    console.log('new user connected');
    //socket.emit from admin to welcome new user
    socket.emit('newMessage',generateMessage('Admin', 'welcome to the chat'));

    //socket.broadcast.emit from admin to other users informing them that a new user joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user Joined'));


    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });
    //specifying a listener for the location event
    socket.on('createLocationMessage', (coords)=> {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnect', ()=> {
        console.log('User was disconnected from server');
    });

});

server.listen(port, ()=>{
    console.log(`server is running on ${port}`);
});

