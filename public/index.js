
var startBtn, stopBtn, phraseDiv, statusDiv;
var SDK, recognizer;

document.addEventListener("DOMContentLoaded", function () {
    createBtn = document.getElementById("createBtn");
    startBtn = document.getElementById("startBtn");
    stopBtn = document.getElementById("stopBtn");
    phraseDiv = document.getElementById("phraseDiv");
    statusDiv = document.getElementById("statusDiv");
    console.log(startBtn, statusDiv, phraseDiv, stopBtn)
    startBtn.addEventListener("click", function () {   
        if (!recognizer){
            Setup();
        }
        RecognizerStart(SDK, recognizer);
        startBtn.disabled = true;
        stopBtn.disabled = false;
                  
    });

    stopBtn.addEventListener("click", function () {
        RecognizerStop(SDK, recognizer);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    Initialize(function (speechSdk) {
        SDK = speechSdk;
        startBtn.disabled = false;
    });
});

function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK);
}

function UpdateStatus(status) {
    statusDiv.innerHTML = status;
}

function OnSpeechEndDetected() {
    stopBtn.disabled = true;
}

function UpdateRecognizedPhrase(text) {
    console.log(text);
    phraseDiv.innerHTML += text.replace('"',"") + " ";
    console.log(phraseDiv)
}

function OnComplete() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
}
