import socketIO from 'socket.io';

const io = socketIO();
const socketAPI = {};

io.on('connection', (socket) => {
    console.log('a user connected');


    socket.on('chat message', (data) => {
      socket.broadcast.emit(`io to client ${data.receiverID}`, {
        message: data.message,
        id: data.receiverID,
        date: data.date,
      });
    });


    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  });

socketAPI.io = io;
export default socketAPI;
