var express   = require("express");
var app       = express();
var comp      = require("compression");
var http      = require("http").createServer(app);
var io        = require("socket.io").listen(http);

var Semantria = require('semantria-node');
var session = new Semantria.Session(
        "49af1bde-4726-4e1c-b7ae-a242337063f7",
        "e3af47b5-4078-432a-9d9e-35f648ce0ffa"
    );

var cleverbot = require("cleverbot.io");
var clever = new cleverbot('kyZYjP2JiUwC20IJ','bTCuN7rZLroqzrH9q1PfauT2eiYVJhkZ');
clever.setNick("TriggerBot");
clever.create(function(err, session){
  if(err) console.log(err);
});


var moodValue = 0;

io.on("connection", function(socket){
  socket.emit("send-mood", moodValue); //init

  socket.on("send-message", function(message){
    console.log("Message: " + message);
    var messageMood = getMood(message);
    moodValue += messageMood;
    console.log("Message: " + message + ", " + messageMood);

    clever.ask(message, function(err, response){
      if(err) console.log(err);
      else{
        console.log("Response: " + response);
        var responseMood = getMood(response);
        moodValue += responseMood;
        console.log("Response: " + response + ", " + responseMood);

        if(moodValue > 5) moodValue = 5;
        else if(moodValue < -5) moodValue = -5;

        socket.emit("send-reply", response);
        io.sockets.emit("send-mood", Math.round(moodValue * 1000) / 1000);
      }
    });
  });

});

function getMood(message){
  if(!message) return 0;

  var documentId = (new Date()).getTime();
  var result = session.queueDocument({
      id: "" + documentId,
      text: message
  });
  if(!result[0]) console.log(result);
  else if(result[0].status === "PROCESSED"){
      var data = session.getDocument(documentId);
      return data.sentiment_score;
  }
  return 0;
}

app.use('/api/speech-to-text/', require('./stt-token.js'));

app.use(comp());
app.use(express.static(__dirname + '/../client'));
var port = process.env.PORT  || 5000;
http.listen(port, function(){
  console.log("listening on:" + port);
});
