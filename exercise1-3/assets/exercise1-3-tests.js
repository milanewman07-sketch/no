import { BACKGROUND, TestResults, advanceToFrame, getShapes, checkCanvasSize, coloursMatch, testSettingIsCalled, CIRCLE, canvasStatus } from "../../lib/test-utils.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

function checkControlType(name, found) {
    if (found.length === 0) {
        TestResults.addFail(`There is no ${name} on the page.`);
        return false;
    }
    else if (found.length === 1) {
        TestResults.addPass(`There is one ${name} on the page.`);
        return true;
    } else {
        TestResults.addFail(`Expected one ${name} at frame ${frameCount}. Found ${found.length}. Check that the ${name} is only created once. The create method should not be called in <code>draw()</code> because it will create a new ${name} every frame.`);
        return false;
    }
}

function shapeIsIn(shape, shapeArr) {
    for (const s of shapeArr) {
        if (s.isEqualTo(shape, false)) {
            return true;
        }
    }
    return false;
}

function shapesDrawnWithSettings(shapes, picker, slider, msg) {
    const circlesAtMouse = shapes.filter(s => s.type === CIRCLE && s.x === mouseX && s.y === mouseY);
    if (circlesAtMouse.length === 1) {
        TestResults.addPass(`${msg}, a circle is drawn at the mouse location.`);
        const isColour = picker === undefined ? false : coloursMatch(circlesAtMouse[0].fillColour, color(picker.value));
        const isSize = slider === undefined ? false : circlesAtMouse[0].w === parseFloat(slider.value);
        if (picker) {
            if (isColour) {
                TestResults.addPass(`${msg} the shape drawn has the selected fill colour.`);
            } else {
                TestResults.addFail(`${msg} the fill colour of the shape that is drawn does not match the colour selected in the colour picker.`);
            }
        }
        if (slider) {
            if (isSize) {
                TestResults.addPass(`${msg} the shape drawn is the chosen size.`);
            } else {
                TestResults.addFail(`${msg} the shape that is drawn is not the size specified by the slider.`);
            }
        }
    } else {
        TestResults.addFail(`${msg} expected a circle to be drawn at the mouse location. Found ${circlesAtMouse.length} circle(s) at the mouse coordinates.`);
    }
    
}

function checkShapesAreDrawn(picker, slider, btn) {
    const startShapes = [...getShapes()];
    mouseX = 100;
    mouseY = 100;
    mouseIsPressed = true;
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    advanceToFrame(frameCount + 1);
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    const shapes2 = [...getShapes()];
    // Need to separate the shapes that may be drawn for the controls e.g. panel background, text
    const newShapes = shapes2.filter(s => !shapeIsIn(s, startShapes));
    if (newShapes.length >= 1) {
        shapesDrawnWithSettings(newShapes, picker, slider, `When the mouse is pressed at ${mouseX}, ${mouseY},`);
        let msg = "When "
        if (picker) {
            picker.value = "#00CC00";
            msg += "the colour picker value is changed";
        }
        if (slider) {
            const current = parseFloat(slider.value);
            const sliderMax = parseFloat(slider.max);
            let newVal = current < sliderMax ? current + 1 : current - 1;
            slider.value = newVal;
            msg += picker ? " and the slider value is changed" : "the slider value is changed";
        }
        msg += picker || slider ? " and the mouse is pressed at 105, 105, " : " the mouse is pressed at 105, 105, ";
        mouseX = 105;
        mouseY = 105;
        mouseIsPressed = true;
        advanceToFrame(frameCount + 1);
        for (const e of canvasStatus.errors) {
            TestResults.addFail(`In frame ${frameCount}, ${e}`);
        }
        const nextShapes = [...getShapes()].filter(s => !shapeIsIn(s, startShapes));
        shapesDrawnWithSettings(nextShapes, picker, slider, msg);
    } else {
        TestResults.addFail("No shapes are drawn when the mouse is pressed.");
    }
    
}


async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkCanvasSize(800, 600);
    if (testSettingIsCalled(BACKGROUND, false, true, false)) {
        TestResults.addWarning("Unless it is in a conditional, calling <code>background()</code> in <code>draw()</code> will prevent shapes that are drawn from remaining visible on screen for more than one frame.");
    }
    // colour picker
    const pickers = document.querySelectorAll("input[type=color]");
    // slider
    const sliders = document.querySelectorAll("input[type=range]");
    // button
    const buttons = document.getElementsByTagName("button");
    if (pickers.length === 1 && sliders.length === 1 && buttons.length === 1) {
        TestResults.addPass("The expected input controls are on the page.");    
        checkShapesAreDrawn(pickers[0], sliders[0], buttons[0]);

    } else {
        const hasPicker = checkControlType("colour picker", pickers);
        const hasSlider = checkControlType("slider", sliders);
        const hasButton = checkControlType("button", buttons);
        checkShapesAreDrawn(hasPicker ? pickers[0]: undefined, hasSlider ? sliders[0]: undefined, hasButton ? buttons[0]: undefined);

    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
