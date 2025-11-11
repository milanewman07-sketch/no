let button;

function setup() {
    createCanvas(400, 400);
    button = createButton('add circle');

    let main = select("main")
    button.parent(main)
    button.position(0, height - 30)
    button.size(width, 30)

    button.mouseClicked(drawthing)
}

function draw() {

}

function drawthing() {
    ellipse(random(width), random(height), random(100), random(100))
}