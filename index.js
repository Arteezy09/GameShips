var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

var room = 0;
var users = [];

io.on('connection', (socket) => {

    socket.on('join1', (data) => {
      socket.join(++room);
      users[room] = data.arr;
      socket.emit('room', { room: room });
    });

    socket.on('join2', (data) => {
      var room = io.nsps['/'].adapter.rooms[data.room];
      if (room && room.length === 1) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('newGame', { room: data.room, arr: data.arr, turn: 1 });
        socket.emit('newGame', { room: data.room, arr: users[data.room], turn: 0 });
      } 
      else {
        socket.emit('message', { message: 'Комнаты не существует или она заполнена!' });
      }
    });

    socket.on('click', (data) => {
      socket.broadcast.to(data.room).emit('click', { index: data.index, turn: data.turn });
    });

    socket.on('endGame', (data) => {
      socket.broadcast.to(data.room).emit('endGame', { win: 0 });
      socket.emit('endGame', { win: 1 });
    });
});



