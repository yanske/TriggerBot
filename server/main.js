var express = require("express");
var app     = express();
var comp    = require("compression");
var http    = require("http").createServer(app);
var io      = require("socket.io").listen(http);

var sockets = {};

var moodValue = 0;

io.on("connection", function(socket){
  socket.on("send-message", function(message){
    socket.emit("send-reply", message + " aylmao", moodValue);
    moodValue++;
  });

});


app.use(comp());
app.use(express.static(__dirname + '/../client'));
var port = process.env.PORT  || 5000;
http.listen(port, function(){
  console.log("listening on:" + port);
});
