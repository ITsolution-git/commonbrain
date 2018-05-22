const http = require("http");
var app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app);
// var io = require("socket.io")(server);
// io.origins("*:*");
// io.on("connection", function(socket) {
//   console.log("a user connected");
// });

// const Pusher = require("pusher");

// const pusher = new Pusher({
//   appId: "528462",
//   key: "edc0fafa92d65aa9bace",
//   secret: "f5f7bb64d29de2bb3092",
//   cluster: "us2",
//   encrypted: true
// });

console.log("running on http://localhost/" + port);
server.listen(port);
