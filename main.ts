let radioGroup = 123;
let message = "";
let messageComplete = false;
let armIsMoving = false;
let armX = 0;
let armXMax = 190;
let armXMin = 90;
let armYMax = -10;
let armYMin = 100;
let armY = 0;
let armGrip = 0;
radio.setGroup(radioGroup);

basic.forever(function() {
    if (input.buttonIsPressed(Button.A))
    {
        moveArmX(false);
    }

    if (input.buttonIsPressed(Button.B)) {
        moveArmX(true);
    }

    basic.pause(100);
})

input.onButtonPressed(Button.A, function() {
    //sendString("chassis speed x 0 y 0 z 20;");
    // sendString("robotic_arm moveto x 190 y -10;");
})

input.onButtonPressed(Button.B, function () {
    //sendString("chassis speed x 0 y 0 z 0;");
    //sendString("robotic_arm moveto x 90 y 0;");
})

function moveArmX (out:boolean)
{

    if (armIsMoving)
    {
        return;
    }

    armIsMoving = true;
    let increment = 5;
    if (updateArmPosition())
    {
        let newPosition = out ? armX + increment : armX - increment;

        if (newPosition > armXMax)
        {
            newPosition = armXMax;
        }
        else (newPosition < armXMin)
        {
            newPosition = armXMin;
        }

        sendString("robotic_arm moveto x " + newPosition + " y "+ armY +";");
        basic.pause(50);
        armIsMoving = false;
    }
    else
    {
        music.play(music.tonePlayable(Note.C, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
    }
}

function updateArmPosition() : boolean
{
    let response = getCommandResponse("robotic_arm position ?;");
    if (response == "")
    {
        return false;
    }

    response = response.substr(0, response.length - 1)
    let parts = response.split(" ");

    if (parts.length == 2)
    {
        armX = parseInt(parts[0]);
        armY = parseInt(parts[1]);
        basic.showNumber(armX)
        basic.showNumber(armY)
        return true;
    }
    basic.showString("X")
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
    while (!messageComplete && (input.runningTime() - start) < 5000)
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