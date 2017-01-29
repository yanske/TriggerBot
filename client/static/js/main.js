var socket;
var count = 0;
var loading;
var thinking = false;

var lines = [];
for(var i=1;i<=7;i++){
  lines[i-1] = document.getElementById("line" + i);
  lines[i-1].style.fontWeight = i % 2 === 0 ? "bold" : "normal";
}

window.onload = function(){
  var inputText = document.getElementById("input-text");
  var sendBtn = document.getElementById("submit-btn");
  var moodText = document.getElementById("mood");

  var listenBtn = document.getElementById("listen-btn");

  var title = document.getElementById("name");


  inputText.focus();
  inputText.onkeypress = function(e){
    var keyCode = e.keyCode || window.event.which;
    if(keyCode === 13){
      sendMessage();
      return false;
    }
  };

  sendBtn.onclick = function(){
    sendMessage();
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
        sendMessage();
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
        document.getElementById("line1").innerHTML = response;
      });

      socket.on("send-mood", function(mood){
        thinking = false;
        moodText.innerHTML = "Mood: " + mood;
        colourBarUpdate(mood);
        if(mood < 0) title.innerHTML = "#Triggered";
        else title.innerHTML = "#NotTriggered";

        if(mood === -5) title.className = "shake-constant shake-crazy";
        else if(mood < -4) title.className = "shake-constant shake-hard";
        else if(mood < -3) title.className = "shake-constant shake";
        else if(mood < -2) title.className = "shake-constant shake-little";
        else title.className = "";
      });
    }
  })();
};

function sendMessage(){
  if(!thinking){
    var inputText = document.getElementById("input-text");
    thinking = true;

    addLog(inputText.value);
    socket.emit("send-message", inputText.value);
    inputText.value = "";

    addLog("Thinking.");

    count = 0;
    loading = setInterval(function(){
      document.getElementById("line1").innerHTML = "Thinking." + new Array(count % 4 + 1).join('.');
      count++;
    }, 500);
  }
}

function addLog(text){
  var lineNum = lines.length;
  for(var i = lineNum-1;i > 0; i--){
    lines[i].innerHTML = lines[i-1].innerHTML;
  }
  lines[0].innerHTML = text;

  for(var i=0;i<lineNum;i++){
    lines[i].style.fontWeight = lines[i].style.fontWeight === "bold" ? "normal" : "bold";
  }
}

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
