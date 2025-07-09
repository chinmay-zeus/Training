import { Grid } from "./Grid.js";
import { SelectionManager2 } from "./SelectionManager2.js";
import { Util } from "./Util.js";

export class RowSelector {
    /**
     * @param {Grid} grid - The grid instance
     * @param {HTMLElement} container - The scroll container
     * @param {SelectionManager2} selectionManager
     * @param {Util} util  
     */
    constructor(grid, container, selectionManager, util) {
        this.grid = grid;
        this.container = container;
        this.selectionManager = selectionManager
        this.util = util;
        this.startRow = null;

        this.anchorRow = null;
        this.anchorCol = null;

        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
        this.dragType = null;
        this.isCtrl = false;

        this.clickedRowIndex = null;
    }

    hitTest(pointer) {
        return (pointer.x <= this.grid.headerWidth && pointer.y > this.grid.headerHeight);
    }

    onMouseDown(e){
        const {x, y, gridX, gridY} = this.util.getMousePos(e);
        this.clickedRowIndex = this.util.getRowIndexAtY(gridY);

        if (gridX <= this.grid.headerWidth && gridY > this.grid.headerHeight) {
            this.dragType = 'row';
            this.isDragging = true;
            // this.dragStart = pos;
            // this.dragCurrent = pos;
        }
    }

    onMouseMove(e){
        if (!this.isDragging) {
            return;
        }
    }
}