import { Grid } from "./Grid.js";
import { Util } from "./Util.js";

export class ColumnResizer {
    /**
     * 
     * @param {Util} util 
     * @param {Grid} grid 
     */
    constructor(util, grid) {
        this.util = util;
        this.grid = grid;
    }

    /**
     * Handles mouse down to start resize.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const { x, y, gridX, gridY } = this.util.getMousePos(e);
        let colIndex = null;

        if (gridY <= this.grid.headerHeight) {
            colIndex = this.util.getColIndexNearBorder(gridX)
        }

        if (colIndex !== null) {
            this.isResizingCol = true;
            this.resizingColIndex = colIndex;
            this.startX = x;
            this.startWidth = this.grid.columns[colIndex].width;
        }
    }

    /**
     * Handles mouse move for resize hover & dragging.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        const { x, y, gridX, gridY } = this.util.getMousePos(e);

        if (!this.isResizingCol) {
            let hoverColIndex = this.util.getColIndexNearBorder(gridX);

            if (hoverColIndex !== null) {
                this.util.canvas.style.cursor = "e-resize";
            }
            else {
                this.util.canvas.style.cursor = "cell";
            }
        }  
        
        else {
            const dx = x - this.startX;
            const newWidth = Math.max(10, this.startWidth + dx);
            this.grid.columns[this.resizingColIndex].width = newWidth;
            this.util.renderGrid();
        }
    }

    /**
     * Handles mouse up to stop resizing.
     */
    onMouseUp() {
        this.isResizingCol = false;
    }

    /**
     * 
     * @param {object} pointer 
     * @returns {boolean}
     */
    hitTest(pointer) {
        let y = this.grid.headerWidth;
        for (let j = 0; j < this.grid.columns.length; j++) {
            const col = this.grid.columns[j];
            const colRight = y + col.width;

            const RESIZE_MARGIN = 5;
            if (Math.abs(pointer.x - colRight) <= RESIZE_MARGIN && pointer.y <= this.grid.headerHeight) {
                // this.resizingRowIndex = i;
                return true;
            }

            y += col.width;
        }
        return false;
    }
}