import { Config } from "./Config";
import { Grid } from "./Grid";

export class Util {
    /**
     * 
     * @param {HTMLCanvasElement} canvas - Canvas Element
     * @param {Grid} grid - Canvas Grid
     * @param {Config} config - Config
     */
    constructor(canvas, grid, config) {
        this.canvas = canvas;
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
     * @private
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
     * @private
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
}