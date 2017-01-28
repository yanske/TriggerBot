var socket;

window.onload = function(){
  var inputText = document.getElementById("input-text");
  var sendBtn = document.getElementById("submit-btn");
  var responseText = document.getElementById("response");
  var moodText = document.getElementById("mood");

  var listenBtn = document.getElementById("listen-btn");

  var title = document.getElementById("name");

  sendBtn.onclick = function(){
    socket.emit("send-message", inputText.value);
  };

  listenBtn.onclick = function(){
    fetch("/api/speech-to-text/token").then(function(response){
      return response.text();
    }).then(function(token){
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        token: token,
        outputElement: "#input-text"
      });

      stream.on("error", function(err){
        console.log(err);
      });

      sendBtn.onclick = function(){
        if(stream) stream.stop();
        socket.emit("send-message", inputText.value);
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
        if(mood < 0) title.innerHTML = "#Triggered";
        else title.innerHTML = "#NotTriggered";
      });
    }
  })();
};
