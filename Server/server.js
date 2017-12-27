const path = require ('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
//setting up express. we don't configure express by passing in arguments. instead we configure express by calling method on app
// to create routes, add middleware or startup the server
let app = express();

//setting up heroku
const port = process.env.PORT||3000;

//create a server using http library
const server = http.createServer(app);
//configure the server to use socketio
const io = socketIO(server);
let users = new Users();

//configuring express static middleware
app.use(express.static(publicPath));
io.on('connection',(socket) => {
    console.log('new user connected');

    //create a listener event for join
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and Room Name are required')
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        // socket.leave('The Office Fans'); to leave a group

        //chaining to specific rooms

        // io.emit -> io.to('The Office Fans').emit emits evey message to every user
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit emits messages to every user expect the one who sends it
        // socket.emit emits an event to one particular user
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();

    });


    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        //console.log('createMessage', message);

        callback();
    });
    //specifying a listener for the location event
    socket.on('createLocationMessage', (coords)=> {
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }

    });

    socket.on('disconnect', ()=> {
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left`));
        }

    });

});

server.listen(port, ()=>{
    console.log(`server is running on ${port}`);
});

