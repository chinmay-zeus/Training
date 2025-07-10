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
        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
        this.dragType = null;
        this.isCtrl = false;

        this.clickedRowIndex = null;
    }

    hitTest(pointer, e, mode) {
        if (mode === 'hover') {
            return false;
        }
        return (pointer.x <= this.grid.headerWidth && pointer.y > this.grid.headerHeight) && e;
    }

    onMouseDown(e) {
        this.selectionManager.isCtrl = e.ctrlKey || e.metaKey;
        const pos = this.util.getMousePos(e);
        this.clickedRowIndex = this.util.getRowIndexAtY(pos.gridY);

        this.dragType = 'row';
        this.isDragging = true;
        this.dragStart = pos;
        this.dragCurrent = pos;
    }

    onMouseMove(e) {
        if (!this.isDragging) {
            return;
        }

        this.dragCurrent = this.util.getMousePos(e);
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);

        if (this.dragType === 'row' && rowIndexNow !== null) {
            const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
            const endRow = Math.max(this.clickedRowIndex, rowIndexNow);

            this.selectionManager.selection = { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
            this.selectionManager.selectionType = 'multipleRows';
        }

        this.selectionManager.renderWithSelection();
    }

    onMouseUp(e) {
        if (!this.isDragging) {
            this.selectionManager.handleClickLogic(e)
        }

        else {
            const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);

            const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
            const endRow = Math.max(this.clickedRowIndex, rowIndexNow);

            const draggedEnough = (startRow !== endRow);

            if (draggedEnough) {
                if (this.selectionManager.isCtrl) {
                    this.selectionManager.toggleMultiSelection({
                        type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow
                    });
                }
                else {
                    this.selectionManager.selection = { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
                    this.selectionManager.selectionType = 'multipleRows';
                    this.selectionManager.multiSelections = [];
                }
            } else {
                this.selectionManager.handleClickLogic(e);
            }
            this.selectionManager.renderWithSelection();
        }

        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
    }
}