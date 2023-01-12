var showStyle = "start";

var ws = new WebSocket("ws://127.0.0.1:5000/");
ws.onmessage = function(event) {
    var data = JSON.parse(event.data);
    showStyle = data.data;
    updateHTML();
}

function updateHTML() {
    var element = document.getElementById("data2");

    switch (showStyle) {
        case "start":
            element.style.display = "none";
            break;
   
        default:
            element.style.display = "block";
            break;
    }
}