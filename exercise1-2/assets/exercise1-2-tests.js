import { TestResults, advanceToFrame, canvasStatus, coloursMatch } from "../../lib/test-utils.js";

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
    const pickers = document.querySelectorAll("input[type=color]");
    if (pickers.length === 2) {
        TestResults.addPass("There are two colour pickers on the page.");
        const picker1 = pickers[0];
        const picker2 = pickers[1];
        const col1 = "#00FF00";
        const col2 = "#FF0000";
        picker1.value = col1;
        picker2.value = col2;
        advanceToFrame(frameCount + 1);
        for (const e of canvasStatus.errors) {
            TestResults.addFail(`In frame ${frameCount}, ${e}`);
        }
        if ((coloursMatch(canvasStatus.backgroundColour, color(col1)) && coloursMatch(canvasStatus.fillColour, color(col2)))
            || (coloursMatch(canvasStatus.backgroundColour, color(col2)) && coloursMatch(canvasStatus.fillColour, color(col1)))) {
            TestResults.addPass("One of the colour pickers sets the background colour and the other sets the fill colour.");
        }
        else {
            let bgSet = false;
            let fillSet = false;
            if (coloursMatch(canvasStatus.backgroundColour, color(col1)) || coloursMatch(canvasStatus.backgroundColour, color(col2))) {
                bgSet = true;
                TestResults.addPass("One of the colour pickers sets the background colour.");
            }
            if (coloursMatch(canvasStatus.fillColour, color(col1)) || coloursMatch(canvasStatus.fillColour, color(col2))) {
                fillSet = true;
                TestResults.addPass("One of the colour pickers sets the fill colour.");
            }
            if (!bgSet) {
                TestResults.addFail("The background colour does not appear to be set by a colour picker.");
            }
            if (!fillSet) {
                TestResults.addFail("The fill colour does not appear to be set by a colour picker.");
            }
        }
        
    } else if (pickers.length < 2) {
        TestResults.addFail(`Expected two colour pickers. Found ${pickers.length}.`);
    } else {
        TestResults.addFail(`Expected two colour pickers. Found ${pickers.length}. Is <code>createColorPicker()</code> called in draw()? Make sure it's only called once for each picker.`);
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
