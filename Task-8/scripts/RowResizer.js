import { Grid } from "./Grid.js";
import { SelectionManager2 } from "./SelectionManager2.js";
import { Util } from "./Util.js";

export class RowResizer {
    /**
     * 
     * @param {Util} util - Utility class reference
     * @param {Grid} grid - Excel like grid
     * @param {SelectionManager2} selectionManager - Selection Manager Object Reference
     */
    constructor(util, grid, selectionManager) {
        this.util = util;
        this.grid = grid;
        this.selectionManager = selectionManager;
    }

    /**
     * Handles mouse down to start resize.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const { x, y, gridX, gridY } = this.util.getMousePos(e);
        let rowIndex = null;

        if (gridX <= this.grid.headerWidth) {
            rowIndex = this.util.getRowIndexNearBorder(gridY);
        }

        if (rowIndex !== null) {
            this.isResizingRow = true;
            this.resizingRowIndex = rowIndex;
            this.startY = y;
            this.startHeight = this.grid.rows[rowIndex].height;
        }
    }

    /**
     * Handles mouse move for resize hover & dragging.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        const { x, y, gridX, gridY } = this.util.getMousePos(e);

        if (!this.isResizingRow) {
            let hoverRowIndex = this.util.getRowIndexNearBorder(gridY);

            if (hoverRowIndex !== null) {
                this.util.canvas.style.cursor = "n-resize";
            }
            else {
                this.util.canvas.style.cursor = "cell";
            }
        }  
        
        else {
            const dy = y - this.startY;
            const newHeight = Math.max(10, this.startHeight + dy);
            this.grid.rows[this.resizingRowIndex].height = newHeight;
            this.selectionManager.renderWithSelection();
        }
    }

    /**
     * Handles mouse up to stop resizing.
     */
    onMouseUp() {
        this.isResizingRow = false;
    }

    /**
     * 
     * @param {object} pointer 
     * @returns {boolean}
     */
    hitTest(pointer) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            const row = this.grid.rows[i];
            const rowBottom = y + row.height;

            const RESIZE_MARGIN = 5;
            if (Math.abs(pointer.y - rowBottom) <= RESIZE_MARGIN && pointer.x <= this.grid.headerWidth) {
                return true;
            }

            y += row.height;
        }
        return false;
    }
}