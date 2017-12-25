var socket = io();
socket.on('connect', function(){
    console.log('connected to server');
});
socket.on('disconnect', function(){
    console.log('disconnected from server');

});
//listening to a custom event
socket.on('newMessage', function(message){
    console.log('new Message', message);
});