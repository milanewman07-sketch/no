let button3;

function setup() {
    createCanvas(400, 400);

    strokeWeight(0)
    button = createColorPicker();
    button2 = createSlider();
    button3 = createButton("clear")

    let main = select("main")
    button.parent(main)
    button2.parent(main)
    button3.parent(main)
    button.position(10, height - 40)
    button.size(50, 30)
    button2.position(170, height - 40)
    button2.size(100, 30)
    button3.position(324, height - 40)
    button3.size(60, 30)

    button3.mouseClicked(clear)

    background(255)

}

function draw() {
    fill(150)
    rect(0, height - 50, width, 50)
    fill(0)
    textSize(10)
    textAlign(CENTER, CENTER)
    text("colour", 80, height - 25)
    text("size", 290, height - 25)

}

function clear() {
    background(255)
}

function mouseDragged() {
    fill(button.value())
    circle(mouseX, mouseY, button2.value())
}
