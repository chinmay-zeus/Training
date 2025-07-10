import { Grid } from "./Grid.js";
import { SelectionManager2 } from "./SelectionManager2.js";
import { Util } from "./Util.js";

export class ColumnResizer {
    /**
     * 
     * @param {Util} util - Utility class reference
     * @param {Grid} grid - Excel like grid
     * @param {SelectionManager2} selectionManager - Selection Manager Object Reference
     */
    constructor(util, grid, selectionManager) {
        this.util = util;
        this.grid = grid;
        this.selectionManager =  selectionManager;
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

            console.log(`${hoverColIndex}`);

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
            this.selectionManager.renderWithSelection();
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
                return true;
            }

            y += col.width;
        }
        return false;
    }
}