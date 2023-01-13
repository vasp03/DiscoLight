var gain = 1;

var sqr1Color = 0;
var sqr2Color = 0;
var sqr3Color = 0;

var sqr1Style = 0;
var sqr2Style = 0;
var sqr3Style = 0;

var flickerSqr1 = false;
var flickerSqr2 = false;
var flickerSqr3 = false;

var sqr1Counter = 0;
var sqr2Counter = 0;
var sqr3Counter = 0;

var sqr1StrobeAmount = 10;
var sqr2StrobeAmount = 10;
var sqr3StrobeAmount = 10;

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
        const lowEndMax = 80;

        let lowEndSum = 0;
        let lowEndCount = 0;

        const midEndMin = 1000;
        const midEndMax = 4000;

        let midEndSum = 0;
        let midEndCount = 0;

        const highEndMin = 8000;
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

        oldRange = [0, 255 * gain]
        newRange = [0, 50]

        const avgLowEnd = Math.round(map((lowEndSum / lowEndCount * gain), oldRange, newRange));
        const avgMidEnd = Math.round(map((midEndSum / midEndCount * gain), oldRange, newRange));
        const avgHighEnd = Math.round(map((highEndSum / highEndCount * gain), oldRange, newRange));

        if (lowEndCount > 0) {
            avg = avgLowEnd + " " + avgMidEnd + " " + avgHighEnd
            console.log(
                "Average: ", avgLowEnd, avgMidEnd, avgHighEnd,
                "Style:", sqr1Color, sqr2Color, sqr3Color, sqr1Style, sqr2Style, sqr3Style, gain,
                "Strobe", sqr1StrobeAmount, sqr2StrobeAmount, sqr3StrobeAmount
            );
        }

        const noColor = `hsl(0, 50%, 0%)`

        const colorLowSqr1 = `hsl(${sqr1Color}, 100%, ${avgLowEnd}%)`;
        const colorMidSqr1 = `hsl(${sqr1Color}, 100%, ${avgMidEnd}%)`;
        const colorHighSqr1 = `hsl(${sqr1Color}, 100%, ${avgHighEnd}%)`;

        const colorLowSqr2 = `hsl(${sqr2Color}, 100%, ${avgLowEnd}%)`;
        const colorMidSqr2 = `hsl(${sqr2Color}, 100%, ${avgMidEnd}%)`;
        const colorHighSqr2 = `hsl(${sqr2Color}, 100%, ${avgHighEnd}%)`;

        const colorLowSqr3 = `hsl(${sqr3Color}, 100%, ${avgLowEnd}%)`;
        const colorMidSqr3 = `hsl(${sqr3Color}, 100%, ${avgMidEnd}%)`;
        const colorHighSqr3 = `hsl(${sqr3Color}, 100%, ${avgHighEnd}%)`;

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
            case "3":
                if (sqr1Counter >= sqr1StrobeAmount) {
                    sqr1Counter = 0
                    if (flickerSqr1) {
                        document.getElementById("sqr1").style.backgroundColor = `hsl(${sqr1Color}, 100%, 50%)`;
                        flickerSqr1 = false;
                    } else {
                        document.getElementById("sqr1").style.backgroundColor = `hsl(${sqr1Color}, 100%, 0%)`;
                        flickerSqr1 = true;
                    }
                } else {
                    sqr1Counter++
                }
                break;
            default:
                document.getElementById("sqr1").style.backgroundColor = noColor;
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
            case "3":
                if (sqr2Counter >= sqr2StrobeAmount) {
                    sqr2Counter = 0
                    if (flickerSqr2) {
                        document.getElementById("sqr2").style.backgroundColor = `hsl(${sqr2Color}, 100%, 50%)`;
                        flickerSqr2 = false;
                    } else {
                        document.getElementById("sqr2").style.backgroundColor = `hsl(${sqr2Color}, 100%, 0%)`;
                        flickerSqr2 = true;
                    }
                } else {
                    sqr2Counter++
                }
                break;
            default:
                document.getElementById("sqr2").style.backgroundColor = noColor;
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
            case "3":
                if (sqr3Counter >= sqr3StrobeAmount) {
                    sqr3Counter = 0
                    if (flickerSqr3) {
                        document.getElementById("sqr3").style.backgroundColor = `hsl(${sqr3Color}, 100%, 50%)`;
                        flickerSqr3 = false;
                    } else {
                        document.getElementById("sqr3").style.backgroundColor = `hsl(${sqr3Color}, 100%, 0%)`;
                        flickerSqr3 = true;
                    }
                } else {
                    sqr3Counter++
                }
                break;
            default:
                document.getElementById("sqr3").style.backgroundColor = noColor;
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

    sqr1Color = showStyle[0];
    sqr1Style = showStyle[1];

    sqr2Color = showStyle[2];
    sqr2Style = showStyle[3];

    sqr3Color = showStyle[4];
    sqr3Style = showStyle[5];

    gain = showStyle[6];

    sqr1StrobeAmount = showStyle[7];
    sqr2StrobeAmount = showStyle[8];
    sqr3StrobeAmount = showStyle[9];
}