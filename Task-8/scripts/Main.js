import { Grid } from "./Grid.js";
import { Resizer } from "./Resizer.js";
import { SelectionManager } from "./SelectionManager.js";
import { EventHandler } from "./EventHandler.js";
import { InteractionManager } from "./InteractionManager.js";
import { RowResizer } from "./RowResizer.js";
import { Util } from "./Util.js";
import { Config } from "./Config.js";
import { ColumnResizer } from "./ColumnResizer.js";
import { RowSelector } from "./RowSelector.js";
import { SelectionManager2 } from "./SelectionManager2.js";
import { ColumnSelector } from "./ColumnSelector.js";
import { CellSelector } from "./CellSelector.js";

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
const manager2 = new SelectionManager2(grid, container);

const resizer = new Resizer(grid, manager, canvas, container);
const config = new Config(TOTAL_ROWS, TOTAL_COLS, CELL_WIDTH, CELL_HEIGHT, HEADER_HEIGHT, HEADER_WIDTH, SCALE)
const util = new Util(canvas, container, grid, config)
const rowResizer = new RowResizer(util, grid, manager2)
const columnResizer = new ColumnResizer(util, grid, manager2)
const rowSelector = new RowSelector(grid, manager2, util);
const colSelector = new ColumnSelector(grid, manager2, util);
const cellSelector = new CellSelector(grid, manager2, util);


/*  
 * Sync scroll with canvas transform & re-render
 */
container.addEventListener("scroll", () => {
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    canvas.style.transform = `translate(${scrollLeft}px, ${scrollTop}px)`;
    grid.render(scrollLeft, scrollTop, container.clientWidth, container.clientHeight);
    manager2.renderWithSelection();
});

// const dispatcher = new EventHandler(grid.canvas, container, [ manager, resizer ]);
const handler = new InteractionManager(canvas, container, [rowResizer, columnResizer, rowSelector, colSelector, cellSelector]);
