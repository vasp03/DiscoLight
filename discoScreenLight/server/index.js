var gain = 1;

var sqr1Color = 0;
var sqr2Color = 0;
var sqr3Color = 0;

var sqr1Style = 0;
var sqr2Style = 0;
var sqr3Style = 0;

var ws = new WebSocket("ws://127.0.0.1:5000/");
ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    showStyle = data.data;
    updateHTML(showStyle);
}
// Get microphone input
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
    // Create an audio context
    const audioCtx = new AudioContext();

    // Create an analyser node
    const analyser = audioCtx.createAnalyser();

    // Create a microphone source node
    const microphone = audioCtx.createMediaStreamSource(stream);

    // Connect the microphone to the analyser
    microphone.connect(analyser);

    // Create a Uint8Array to store the audio data
    const data = new Uint8Array(analyser.frequencyBinCount);

    // Update the color of the div element based on the microphone input
    const updateColor = () => {
        // Get the audio data from the analyser
        analyser.getByteFrequencyData(data);

        const lowEndMin = 20;
        const lowEndMax = 100;

        let lowEndSum = 0;
        let lowEndCount = 0;

        const midEndMin = 101;
        const midEndMax = 2000;

        let midEndSum = 0;
        let midEndCount = 0;

        const highEndMin = 2001;
        const highEndMax = 25000;

        let highEndSum = 0;
        let highEndCount = 0;

        for (let i = 0; i < data.length; i++) {
            // volume += data[i];
            const frequency = audioCtx.sampleRate * i / analyser.fftSize;
            if (frequency >= lowEndMin && frequency <= lowEndMax) {
                lowEndSum += data[i];
                lowEndCount++;
            }

            if (frequency >= midEndMin && frequency <= midEndMax) {
                midEndSum += data[i];
                midEndCount++;
            }

            if (frequency >= highEndMin && frequency <= highEndMax) {
                highEndSum += data[i];
                highEndCount++;
            }
        }

        const avgLowEnd = Math.round(map(((lowEndSum / lowEndCount) * gain), [0, 255], [0, 50]));
        const avgMidEnd = Math.round(map(((midEndSum / midEndCount) * gain), [0, 255], [0, 50]));
        const avgHighEnd = Math.round(map(((highEndSum / highEndCount) * gain), [0, 255], [0, 50]));

        if (lowEndCount > 0) {
            avg = avgLowEnd + " " + avgMidEnd + " " + avgHighEnd
            console.log("Average: ", avgLowEnd, avgMidEnd, avgHighEnd);
        }

        const colorLowSqr1 = `hsl(${sqr1Color}, 50%, ${avgLowEnd}%)`;
        const colorMidSqr1 = `hsl(${sqr1Color}, 50%, ${avgMidEnd}%)`;
        const colorHighSqr1 = `hsl(${sqr1Color}, 50%, ${avgHighEnd}%)`;

        const colorLowSqr2 = `hsl(${sqr2Color}, 50%, ${avgLowEnd}%)`;
        const colorMidSqr2 = `hsl(${sqr2Color}, 50%, ${avgMidEnd}%)`;
        const colorHighSqr2 = `hsl(${sqr2Color}, 50%, ${avgHighEnd}%)`;

        const colorLowSqr3 = `hsl(${sqr3Color}, 50%, ${avgLowEnd}%)`;
        const colorMidSqr3 = `hsl(${sqr3Color}, 50%, ${avgMidEnd}%)`;
        const colorHighSqr3 = `hsl(${sqr3Color}, 50%, ${avgHighEnd}%)`;

        switch (sqr1Style) {
            case "0":
                document.getElementById("sqr1").style.backgroundColor = colorLowSqr1;
                break;
            case "1":
                document.getElementById("sqr1").style.backgroundColor = colorMidSqr1;
                break;
            case "2":
                document.getElementById("sqr1").style.backgroundColor = colorHighSqr1;
                break;
            default:
                document.getElementById("sqr1").style.backgroundColor = colorLowSqr1;
                break;
        }

        switch (sqr2Style) {
            case "0":
                document.getElementById("sqr2").style.backgroundColor = colorLowSqr2;
                break;
            case "1":
                document.getElementById("sqr2").style.backgroundColor = colorMidSqr2;
                break;
            case "2":
                document.getElementById("sqr2").style.backgroundColor = colorHighSqr2;
                break;
            default:
                document.getElementById("sqr2").style.backgroundColor = colorLowSqr2;
                break;
        }

        switch (sqr3Style) {
            case "0":
                document.getElementById("sqr3").style.backgroundColor = colorLowSqr3;
                break;
            case "1":
                document.getElementById("sqr3").style.backgroundColor = colorMidSqr3;
                break;
            case "2":
                document.getElementById("sqr3").style.backgroundColor = colorHighSqr3;
                break;
            default:
                document.getElementById("sqr3").style.backgroundColor = colorLowSqr3;
                break;
        }


        // Call the updateColor function again
        requestAnimationFrame(updateColor);
    }
    updateColor();
}).catch(error => {
    console.log("Error getting microphone input:", error);
});

function map(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function updateHTML(showStyle) {
    showStyle = showStyle.split(",")
    document.getElementById("avg").textContent = showStyle;

    sqr1Color = showStyle[0].toString();
    sqr1Style = showStyle[1].toString();

    sqr2Color = showStyle[2].toString();
    sqr2Style = showStyle[3].toString();

    sqr3Color = showStyle[4].toString();
    sqr3Style = showStyle[5].toString();

    gain = showStyle[6].toString();
}