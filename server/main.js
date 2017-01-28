var express = require("express");
var app     = express();
var comp    = require("compression");
var http    = require("http").createServer(app);
var io      = require("socket.io").listen(http);

var Semantria = require('semantria-node');
var session = new Semantria.Session(
        "49af1bde-4726-4e1c-b7ae-a242337063f7",
        "e3af47b5-4078-432a-9d9e-35f648ce0ffa"
    );


//var sockets = {};

var moodValue = 0;

io.on("connection", function(socket){
  //sockets[socket.id] = socket;
  socket.emit("send-mood", moodValue);

  socket.on("send-message", function(message){
    var messageMood = getMood(message);
    moodValue += messageMood;
    console.log(message + ": " + messageMood);

    socket.emit("send-reply", message + " aylmao");
    io.sockets.emit("send-mood", moodValue);
  });

});

function getMood(message){
  var documentId = (new Date).getTime();
  var result = session.queueDocument({
      id: "" + documentId,
      text: message
  });
  if (result && result[0].status === "PROCESSED"){
      var data = session.getDocument(documentId);
      return data.sentiment_score;
  }
}

app.use('/api/speech-to-text/', require('./stt-token.js'));

app.use(comp());
app.use(express.static(__dirname + '/../client'));
var port = process.env.PORT  || 5000;
http.listen(port, function(){
  console.log("listening on:" + port);
});
