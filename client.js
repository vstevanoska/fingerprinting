function canvasFingerprinting()
{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    for (let i = 0; i < 20; i++) {
        
        for (let j = 0; j < 20; j++) {

            context.fillStyle = `rgb(${Math.floor(255 - 10 * i)}, ${Math.floor(255 - 10 * j)}, 0)`;
            context.fillRect(j * 10, i * 10, 10, 10);
        }
    }
    
    var canvasOutput = canvas.toDataURL();

    return canvasOutput;
}

function fontFingerprinting()
{
    var supportedFonts = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT', 'Comic Sans MS'];

    var bodyElement = document.getElementById("body");
    var divElement = document.createElement('div');

    var result = [];

    supportedFonts.forEach(font => {

        var spanElement = document.createElement('span');

        spanElement.style.fontFamily = font;
        spanElement.style.fontSize = "100px";
        
        spanElement.innerHTML = "Vaja 2 - Spletni sledilniki";

        divElement.style.fontFamily = font;
        divElement.appendChild(spanElement);
        bodyElement.appendChild(divElement);

        var width = spanElement.offsetWidth;
        var height = spanElement.offsetHeight;

        divElement.removeChild(divElement.firstChild);

        result.push([width, height]);
    });

    return result;
}

function userAgentFingerprinting()
{
    return window.navigator.userAgent;
}

function timezoneFingerprinting()
{
    return new Date().getTimezoneOffset();
}

function screenFingerprinting()
{
    var screenDetails = [];

    screenDetails.push(window.screen.availWidth);
    screenDetails.push(window.screen.availHeight);
    screenDetails.push(window.screen.colorDepth);

    return screenDetails;
}

async function fingerprint()
{
    var canvasFingerprint = canvasFingerprinting();
    var fontFingerprint = fontFingerprinting();
    var userAgentFingerprint = userAgentFingerprinting();
    var timezoneFingerprint = timezoneFingerprinting();
    var screenFingerprint = screenFingerprinting();

    var uniqueFingerprint = canvasFingerprint.toString() + fontFingerprint.toString() + userAgentFingerprint.toString() + timezoneFingerprint.toString() + screenFingerprint.toString();

    var encoder = new TextEncoder();
    var data = encoder.encode(uniqueFingerprint);
    var hashedData = await crypto.subtle.digest("SHA-512", data);
    var hashArray = Array.from(new Uint8Array(hashedData));

    var hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hash;
}

const xhttp = new XMLHttpRequest();
xhttp.onload = function() {

    var response = this.responseText;

    var textObject = document.getElementById("visited");

    if (response === "true")
        textObject.innerHTML = "You've visited this site before.";
    else
        textObject.innerHTML = "You haven't visited this site before.";
}

fingerprint().then(result => {
    xhttp.open("GET", "http://localhost:3000?hash=" + result);
    xhttp.send();
});