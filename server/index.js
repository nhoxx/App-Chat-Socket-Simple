var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  }); 
  // thêm cors này để tránh bị Exception, ở đây làm nhanh nên cho phép tất cả các trang đều cors được. 

socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id); 

  socket.emit("getId", socket.id);

  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
});
