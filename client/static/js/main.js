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
        moodText.innerHTML = "Mood: " + mood;
        colourBarUpdate(mood);
        if(mood < 0) title.innerHTML = "#Triggered";
        else title.innerHTML = "#NotTriggered";
      });
    }
  })();
};

function colourBarUpdate(mood) {
    var obj = document.getElementById('greenBarFiller');
    var obj2 = document.getElementById('redBarFiller');
    
    if (mood > 5)
        mood = 5;
    
    if (mood > 0) {
        obj.style.width = mood*10 + "%";
        obj2.style.width = "0";
    }
    else {
        obj.style.width = "0";
        obj2.style.width = mood*10 + "%";
        obj2.style.left = 50 - mood*10 + "%";
    }
}
