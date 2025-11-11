import { TestResults, advanceToFrame, getShapes, runMouseClick, canvasStatus } from "../../lib/test-utils.js";

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

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    // check there is a button element
    const buttons = document.getElementsByTagName("button");
    if (buttons.length === 0) {
        TestResults.addFail("No buttons found.");
    } else if (buttons.length > 1) {
        TestResults.addFail(`Only 1 button is expected. Found ${buttons.length}.`);
    } else {
        const btnParent = buttons[0].parentElement.tagName.toLowerCase();
        if (btnParent === "body") {
            TestResults.addFail("The button has not been moved into the <code>&lt;main&gt;</code> element. Check the instructions again.")
        } else if (btnParent === "main") {
            TestResults.addPass("The button has been moved into the <code>&lt;main&gt;</code> element.");
        } else {
            TestResults.addFail(`The button should have been moved into the <code>&lt;main&gt;</code> element. It appears to be in a different element.`);
        }
        const btnWidth = buttons[0].offsetWidth;
        const btnHeight = buttons[0].offsetHeight;
        const btnTop = buttons[0].offsetTop;
        const btnLeft = buttons[0].offsetLeft;
        if (btnWidth === width) {
            TestResults.addPass("The button is the same width as the canvas.");
        } else {
            TestResults.addFail(`Expected the button to be the same width as the canvas (${width}px). The button is ${btnWidth}px wide.`);
        }
        if (btnLeft === 0) {
            TestResults.addPass("The left edge of the button is at 0px.");
        } else {
            TestResults.addFail(`Expected the left edge of the button to be at 0px. It is at ${btnLeft}.`);
        }
        if (btnTop === height - btnHeight) {
            TestResults.addPass("The button is at the bottom of the canvas.");
        } else if (btnTop > height)  {
            TestResults.addFail("Expected the button to be at the bottom of the canvas. It appears to be below the canvas. Move it up so that it's bottom edge is at the bottom of the canvas.");
        } else {
            TestResults.addFail(`Expected the button to be at the bottom of the canvas. Found it at ${btnTop}px.`);
        }
        // check that clicking the button makes at least one new shape appear
        let actualShapes = getShapes();
        const loadShapeNumber = actualShapes.length;
        buttons[0].click();
        advanceToFrame(frameCount + 1);
        for (const e of canvasStatus.errors) {
            TestResults.addFail(`In frame ${frameCount}, ${e}`);
        }
        actualShapes = getShapes();
        if (actualShapes.length > loadShapeNumber) {
            TestResults.addPass(`When the button is clicked ${actualShapes.length - loadShapeNumber} shape(s) is/are drawn.`);
        } else if (actualShapes.length === loadShapeNumber) {
            TestResults.addFail("Clicking the button doesn't add any new shapes. Check that you have implemented an event handler and connected it to the button so that it is called when the button is clicked.");
        }
        const shapeCount = actualShapes.length;
        mouseX = -1;
        mouseY = -1;
        if (runMouseClick()) {
            TestResults.addWarning("A general mouse event function has been implemented. This is not necessary for this exercise. Make sure you have a mouse click listener attached to the button itself.");
            advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            actualShapes = getShapes();
            if (actualShapes.length > shapeCount) {
                TestResults.addFail("Clicking the mouse away from the button adds new shapes. This may be due to the unexpected general mouse event function.");
            }
        }
    }
    
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
