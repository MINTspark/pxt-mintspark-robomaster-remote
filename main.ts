let radioGroup = 123;
let message = "";
let messageComplete = false;
radio.setGroup(radioGroup);

input.onButtonPressed(Button.A, function() {
    sendString("chassis speed x 0.4 y 0.4 z 0;");
})

input.onButtonPressed(Button.B, function () {
    sendString("chassis speed x 0 y 0 z 0;");
})

function sendString(message:string)
{
    let length = message.length;
    radio.sendString("start");

    do
    {
        if (length <= 20)
        {
            radio.sendString(message);
            length = 0;
        }
        else{
            radio.sendString(message.substr(0, 19));
            message = message.substr(19);
            length -= 19;
        }     
    } while (length > 0)

    radio.sendString("end");
}

radio.onReceivedString(function (receivedString: string) {
        if (receivedString == "start") {
            messageComplete = false;
            message = "";
        }
        else if (receivedString == "end") {
            messageComplete = true;
        }
        else {
            message += receivedString;
        }
})