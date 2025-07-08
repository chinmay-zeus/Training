import { Grid } from "./Grid.js";
import { Util } from "./Util.js";

export class RowResizer {
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
     * @private
     */
    onMouseDown(e) {
        const { x, y, gridX, gridY } = this._getMousePos(e);
        let colIndex = null;
        let rowIndex = null;

        if (gridY <= this.grid.headerHeight) {
            colIndex = this._getColIndexNearBorder(gridX);
        }


        if (colIndex !== null) {
            this.isResizingCol = true;
            this.resizingColIndex = colIndex;
            this.startX = x;
            this.startWidth = this.grid.columns[colIndex].width;

        } else if (rowIndex !== null) {
            this.isResizingRow = true;
            this.resizingRowIndex = rowIndex;
            this.startY = y;
            this.startHeight = this.grid.rows[rowIndex].height;
        }
    }

    /**
     * Handles mouse move for resize hover & dragging.
     * @param {MouseEvent} e 
     * @private
     */
    onMouseMove(e) {
        const { x, y, gridX, gridY } = this.util.getMousePos(e);

        if (!this.isResizingRow) {
            let hoverRowIndex = this.util.getRowIndexNearBorder(gridY);

            if (hoverRowIndex !== null) {
                this.canvas.style.cursor = "n-resize";
            }

        }  else {
            const dy = y - this.startY;
            const newHeight = Math.max(10, this.startHeight + dy);
            this.grid.rows[this.resizingRowIndex].height = newHeight;
            this._renderGrid();
        }
    }

    /**
     * Handles mouse up to stop resizing.
     * @private
     */
    onMouseUp() {
        this.isResizingCol = false;
        this.isResizingRow = false;
    }

    hitTest(pointer) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            const row = this.grid.rows[i];
            const rowBottom = y + row.height;

            const RESIZE_MARGIN = 5;
            if (Math.abs(pointer.y - rowBottom) <= RESIZE_MARGIN && pointer.x <= this.grid.headerWidth) {
                this.resizingRowIndex = i;
                return true;
            }

            y += row.height;
        }
        return false;
    }
}