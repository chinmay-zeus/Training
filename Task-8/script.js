const SCALE = window.devicePixelRatio || 1;

const CELL_WIDTH = 64;
const CELL_HEIGHT = 20;

const CURRENT_ROWS = 100;
const CURRENT_COLUMNS = 40;

const TOTAL_COLUMNS = 500;
const TOTAL_ROWS = 100000;

const CANVAS_WIDTH = CELL_WIDTH * CURRENT_COLUMNS * SCALE;
const CANVAS_HEIGHT = CELL_HEIGHT * CURRENT_ROWS * SCALE;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');


function InitializeCanvas() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.width = `${CELL_WIDTH * CURRENT_COLUMNS}px`
    canvas.style.height = `${CELL_HEIGHT * CURRENT_ROWS}px`
    ctx.scale(SCALE, SCALE);
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = "#f5f5f5";
    ctx.font = "11pt Calibri";
    ctx.textBaseline = "middle";
}

function DrawGrid() {
    for (let col = 1; col <= CURRENT_COLUMNS; col++) {
        let x = col * CELL_WIDTH + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }

    for (let row = 1; row <= CURRENT_ROWS; row++) {
        let y = row * CELL_HEIGHT + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
}

InitializeCanvas();
DrawGrid();
