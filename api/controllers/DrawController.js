module.exports = {
  index: function() {
    var io, socketIO;
    console.log('huhu');
    socketIO = require("socket.io");
    io = socketIO.listen(server);
    return io.sockets.on("connection", function(socket) {
      console.log("connection");
      socket.on("message", function(data) {
        console.log("message");
        io.sockets.emit("message", {
          value: data.value
        });
      });
      return socket.on("disconnect", function() {
        console.log("disconnect");
      });
    });
  },
  room: function() {}
};
