let radioGroup = 123;
radio.setGroup(radioGroup);

input.onButtonPressed(Button.A, function() {
    radio.sendString("chassis speed x 0.4 y 0.4 z 0;")
})

input.onButtonPressed(Button.B, function () {
    radio.sendString("chassis speed x 0 y 0 z 0;")
})