import { Grid } from "./Grid.js";
import { Config } from "./Config.js";

export class Util {
    /**
     * 
     * @param {HTMLCanvasElement} canvas - Canvas Element
     * @param {HTMLElement} container 
     * @param {Grid} grid - Canvas Grid
     * @param {Config} config - Config
     */
    constructor(canvas, container, grid, config) {
        this.canvas = canvas;
        this.container = container;
        this.grid = grid;
        this.config = config;
        this.RESIZE_MARGIN = 5;
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gridX = x + this.container.scrollLeft;
        const gridY = y + this.container.scrollTop;
        return { x, y, gridX, gridY };
    }

    /**
     * Find column index near border.
     * @param {number} mouseX 
     * @returns {number|null}
     */
    getColIndexNearBorder(mouseX) {
        let x = this.config.headerWidth;
        for (let i = 0; i < this.grid.columns.length; i++) {
            x += this.grid.columns[i].width;
            if (Math.abs(mouseX - x) < this.RESIZE_MARGIN) {
                return i;
            }
        }
        return null;
    }

    /**
     * Find row index near border.
     * @param {number} mouseY 
     * @returns {number|null}
     */
    getRowIndexNearBorder(mouseY) {
        let y = this.config.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            y += this.grid.rows[i].height;
            if (Math.abs(mouseY - y) < this.RESIZE_MARGIN) {
                return i;
            }
        }
        return null;
    }

    getColIndexAtX(gridX) {
        let x = this.grid.headerWidth;
        for (let i = 0; i < this.grid.columns.length; i++) {
            const w = this.grid.columns[i].width;
            if (gridX >= x && gridX < x + w) return i;
            x += w;
        }
        return null;
    }

    getRowIndexAtY(gridY) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            const h = this.grid.rows[i].height;
            if (gridY >= y && gridY < y + h) return i;
            y += h;
        }
        return null;
    }

    renderGrid() {
        this.grid.render(
            this.container.scrollLeft,
            this.container.scrollTop,
            this.container.clientWidth,
            this.container.clientHeight
        );
        // this.selectionManager.renderSelection(this.selectionManager.selectedRowIndex, this.selectionManager.selectedColIndex, this.container.scrollLeft, this.container.scrollTop);
    }
}