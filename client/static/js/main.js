var socket;

window.onload = function(){
  var inputText = document.getElementById("input-text");
  var sendBtn = document.getElementById("submit-btn");
  var responseText = document.getElementById("response");
  var moodText = document.getElementById("mood");

  sendBtn.onclick = function(){
    console.log("sending message: " + inputText.value);
    socket.emit("send-message", inputText.value);
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
