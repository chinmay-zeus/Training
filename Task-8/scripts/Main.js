import { Grid } from "./Grid.js";
import { Resizer } from "./Resizer.js";
import { SelectionManager } from "./SelectionManager.js";
import { EventHandler } from "./EventHandler.js";

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

/*  
 * Set spacer size to enable scrolling
 */
spacer.style.width = `${TOTAL_COLS * CELL_WIDTH + HEADER_WIDTH}px`;
spacer.style.height = `${TOTAL_ROWS * CELL_HEIGHT + HEADER_HEIGHT}px`;

/*  
 * Initialize grid
 */
const grid = new Grid(
    canvas, ctx,
    container.clientWidth, container.clientHeight,
    TOTAL_ROWS, TOTAL_COLS,
    CELL_WIDTH, CELL_HEIGHT,
    HEADER_HEIGHT, HEADER_WIDTH,
    SCALE
);

/*  
 * Initial render
 */
grid.render(0, 0, container.clientWidth, container.clientHeight);

/*  
 * Setup resize handling
 */
const manager = new SelectionManager(grid, container);

const resizer = new Resizer(grid, manager, canvas, container);


/*  
 * Sync scroll with canvas transform & re-render
 */
container.addEventListener("scroll", () => {
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    canvas.style.transform = `translate(${scrollLeft}px, ${scrollTop}px)`;
    grid.render(scrollLeft, scrollTop, container.clientWidth, container.clientHeight);
    manager.renderSelection(manager.selectedRowIndex, manager.selectedColIndex, scrollLeft, scrollTop);
});

const dispatcher = new EventHandler(grid.canvas, container, [ manager, resizer ]);
