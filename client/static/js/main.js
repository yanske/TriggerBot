var socket;
var count = 0;
var loading;
window.onload = function(){
  var inputText = document.getElementById("input-text");
  var sendBtn = document.getElementById("submit-btn");
  var responseText = document.getElementById("response");
  var moodText = document.getElementById("mood");

  var listenBtn = document.getElementById("listen-btn");

  var title = document.getElementById("name");

  sendBtn.onclick = function(){
    socket.emit("send-message", inputText.value);

    count = 0;
    loading = setInterval(function(){
      document.getElementById("response").innerHTML = "Thinking." + new Array(count % 4 + 1).join('.');
      count++;
    }, 500);
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

        count = 0;
        loading = setInterval(function(){
          document.getElementById("response").innerHTML = "Thinking." + new Array(count % 4 + 1).join('.');
          count++;
        }, 500);
      };
    }).catch(function(error){
      console.log(error);
    });
  };

  (function(){
    if(!socket){
      socket = io();

      socket.on("send-reply", function(response){
        clearInterval(loading);
        responseText.innerHTML = response;
      });

      socket.on("send-mood", function(mood){
        if(mood > 5) mood = 5;
        else if(mood < -5) mood = -5;
        moodText.innerHTML = "Mood: " + (Math.round(mood * 1000) / 1000);
        colourBarUpdate(mood);
        if(mood < 0) title.innerHTML = "#Triggered";
        else title.innerHTML = "#NotTriggered";
      });
    }
  })();
};

function colourBarUpdate(mood) {
    var greenBar = document.getElementById('greenBarFiller');
    var redBar = document.getElementById('redBarFiller');

    if(mood > 0) {
        greenBar.style.width = mood*10 + "%";
        redBar.style.width = "0";
    }
    else {
        greenBar.style.width = "0";
        redBar.style.width = -mood*10 + "%";
        redBar.style.left = 50 + mood*10 + "%";
    }
}
