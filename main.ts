let radioGroup = 123;
let message = "";
let messageComplete = false;
let armIsMoving = false;
let armX = 0;
let armXMax = 190;
let armXMin = 90;
let armYMax = 100;
let armYMin = -10;
let armY = 0;
let armGrip = 0;
let armReady = false;
radio.setGroup(radioGroup);

basic.forever(function() {
    if (input.buttonIsPressed(Button.A))
    {
        moveArmX(false);
    }
    else if (input.buttonIsPressed(Button.B)){
        moveArmX(true);
    }
    else if (input.pinIsPressed(TouchPin.P0)) {
        moveArmY(false);
    }
    else if (input.pinIsPressed(TouchPin.P2)) {
        moveArmY(true);
    }
    basic.pause(100)
})

input.onButtonPressed(Button.A, function() {
    //sendString("chassis speed x 0 y 0 z 20;");
    // sendString("robotic_arm moveto x 190 y -10;");
    //sendString("servo speed id 5 speed 20;");
    //moveArmX(false);
})

input.onButtonPressed(Button.B, function () {
    //sendString("chassis speed x 0 y 0 z 0;");
    //sendString("robotic_arm moveto x 90 y 0;");
    //sendString("servo speed id 5 speed 0;");
    //moveArmX(true);
})

input.onButtonPressed(Button.AB, function () {
    sendString("robotic_arm recenter;");
    if (updateArmPosition()) {
        armReady = true;
        basic.showIcon(IconNames.Happy)
    }
})


function moveArmX (out:boolean)
{
    if (armIsMoving || (armX >= armXMax && out) || (armX <= armXMin && !out))
    {
        return;
    }

    armIsMoving = true;
    let increment = 50;
    let newPosition = out ? armX + increment : armX - increment;

    if (newPosition > armXMax)
    {
        newPosition = armXMax;
    }
    else if (newPosition < armXMin)
    {
        newPosition = armXMin;
    }

    let newString = "robotic_arm moveto x " + newPosition + " y " + armY + ";"

    sendString(newString);
    basic.pause(500);
    armX = newPosition;
    armIsMoving = false;
}

function moveArmY(up: boolean) {
    if (armIsMoving || (armY >= armYMax && up) || (armY <= armYMin && !up)) {
        return;
    }

    armIsMoving = true;
    let increment = 50;
    let newPosition = up ? armY + increment : armY - increment;

    if (newPosition > armYMax) {
        newPosition = armYMax;
    }
    else if (newPosition < armYMin) {
        newPosition = armYMin;
    }

    let newString = "robotic_arm moveto x " + armX + " y " + newPosition + ";"

    sendString(newString);
    basic.pause(500);
    armY = newPosition;
    armIsMoving = false;
}


function updateArmPosition() : boolean
{
    let response = getCommandResponse("robotic_arm position ?;");
    if (response == "")
    {
        return false;
    }


    response = response.trim();
    response = response.substr(0, response.length - 1)
    let parts = response.trim().split(" ");

    if (parts.length == 2)
    {
        armX = parseInt(parts[0]);
        armY = parseInt(parts[1]);
        return true;
    }
    return false;
}

function getCommandResponse(command:string) : string
{
    let response = "";
    messageComplete = false;
    let start = input.runningTime();
    sendString(command);

    do
    {
        basic.pause(100);        
    } 
    while (!messageComplete && (input.runningTime() - start) < 10000)
    return message;
}

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