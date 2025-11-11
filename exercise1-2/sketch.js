let button;

function setup() {
    createCanvas(400, 400);
    button = createColorPicker();
    button2 = createColorPicker();

    let main = select("main")
    button.parent(main)
    button2.parent(main)
    button.position(10, height - 40)
    button.size(50, 30)
    button2.position(170, height - 40)
    button2.size(50, 30)

}

function draw() {
    background(button.value())
    fill(button2.value())

    textSize(10)
    textAlign(CENTER, CENTER)
    text("background", 100, height - 25)
    text("fill", 230, height - 25)
    textSize(50)
    text("UUUHHHHH", width / 2, height / 2)


}
