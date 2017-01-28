var socket;

window.onload = function(){
  var inputText = document.getElementById("input-text");
  var sendBtn = document.getElementById("submit-btn");
  var responseText = document.getElementById("response");
  var moodText = document.getElementById("mood");

  var divText = document.getElementById("div-text");

  var listenBtn = document.getElementById("listen-btn");
  var stopBtn = document.getElementById("stop-btn");

  sendBtn.onclick = function(){
    console.log("sending message: " + inputText.value);
    socket.emit("send-message", inputText.value);
  };

  listenBtn.onclick = function(){
    fetch("/api/speech-to-text/token").then(function(response){
      return response.text();
    }).then(function(token){
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        token: token,
        outputElement: "#div-text"
      });

      stream.on("error", function(err){
        console.log(err);
      });

      stopBtn.onclick = function(){
        stream.stop();
        console.log(divText.innerHTML);
        socket.emit("send-message", divText.innerHTML);
      };
    }).catch(function(error){
      console.log(error);
    });
  };

  (function(){
    if(!socket){
      socket = io();

      socket.on("send-reply", function(response){
        responseText.innerHTML = response;
      });

      socket.on("send-mood", function(mood){
        moodText.innerHTML = "Mood: " + mood;
      });
    }
  })();
};
