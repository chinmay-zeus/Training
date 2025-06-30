import { Grid } from "./Grid.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".container");
const spacer = document.querySelector(".spacer");

const TOTAL_ROWS = 100000;
const TOTAL_COLS = 500;
const CELL_WIDTH = 64;
const CELL_HEIGHT = 20;
const HEADER_WIDTH = 80;
const HEADER_HEIGHT = 35;
const SCALE = window.devicePixelRatio || 1;

spacer.style.width = `${TOTAL_COLS * CELL_WIDTH + HEADER_WIDTH}px`;
spacer.style.height = `${TOTAL_ROWS * CELL_HEIGHT + HEADER_HEIGHT}px`;

const grid = new Grid(canvas, ctx, container.clientWidth, container.clientHeight, TOTAL_ROWS, TOTAL_COLS, CELL_WIDTH, CELL_HEIGHT, HEADER_HEIGHT, HEADER_WIDTH, SCALE);

grid.render(0, 0, container.clientWidth, container.clientHeight);

container.addEventListener("scroll", () => {
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    canvas.style.transform = `translate(${scrollLeft}px, ${scrollTop}px)`;
    grid.render(scrollLeft, scrollTop, container.clientWidth, container.clientHeight);
});


let isResizingCol = false;
let resizingColIndex = null;
let startX = 0;
let startWidth = 0;

let isResizingRow = false;
let resizingRowIndex = null;
let startY = 0;
let startHeight = 0;

const RESIZE_MARGIN = 5;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const gridX = x + scrollLeft;
    const gridY = y + scrollTop;

    if (!isResizingCol && !isResizingRow) {
        let hoverColIndex = null;
        let hoverRowIndex = null;

        if (gridY <= grid.headerHeight) { 
            hoverColIndex = getColIndexNearBorder(gridX);
        }
        if (gridX <= grid.headerWidth) {
            hoverRowIndex = getRowIndexNearBorder(gridY);
        }

        if (hoverColIndex !== null) {
            canvas.style.cursor = "col-resize";
        } else if (hoverRowIndex !== null) {
            canvas.style.cursor = "row-resize";
        } else {
            canvas.style.cursor = "default";
        }
    } else if (isResizingCol) {
        const dx = x - startX;
        const newWidth = Math.max(20, startWidth + dx);
        grid.columns[resizingColIndex].width = newWidth;
        grid.render(container.scrollLeft, container.scrollTop, container.clientWidth, container.clientHeight);
    } else if (isResizingRow) {
        const dy = y - startY;
        const newHeight = Math.max(10, startHeight + dy);
        grid.rows[resizingRowIndex].height = newHeight;
        grid.render(container.scrollLeft, container.scrollTop, container.clientWidth, container.clientHeight);
    }
});

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const gridX = x + scrollLeft;
    const gridY = y + scrollTop;

    let colIndex = null;
    let rowIndex = null;

    // 👇 Only allow col resize in header area
    if (gridY <= grid.headerHeight) {
        colIndex = getColIndexNearBorder(gridX);
    }

    // 👇 Only allow row resize in header column area
    if (gridX <= grid.headerWidth) {
        rowIndex = getRowIndexNearBorder(gridY);
    }

    if (colIndex !== null) {
        isResizingCol = true;
        resizingColIndex = colIndex;
        startX = x;
        startWidth = grid.columns[colIndex].width;
    } else if (rowIndex !== null) {
        isResizingRow = true;
        resizingRowIndex = rowIndex;
        startY = y;
        startHeight = grid.rows[rowIndex].height;
    }
});

window.addEventListener("mouseup", () => {
    isResizingCol = false;
    isResizingRow = false;
});


function getColIndexNearBorder(mouseX) {
    let x = grid.headerWidth;
    for (let i = 0; i < grid.columns.length; i++) {
        const col = grid.columns[i];
        x += col.width;
        if (Math.abs(mouseX - x) < RESIZE_MARGIN) {
            return i;
        }
    }
    return null;
}

function getRowIndexNearBorder(mouseY) {
    let y = grid.headerHeight;
    for (let i = 0; i < grid.rows.length; i++) {
        const row = grid.rows[i];
        y += row.height;
        if (Math.abs(mouseY - y) < RESIZE_MARGIN) {
            return i;
        }
    }
    return null;
}

