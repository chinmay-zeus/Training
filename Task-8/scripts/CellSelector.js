import { BaseSelector } from "./BaseSelector.js";

export class CellSelector extends BaseSelector {
    constructor(grid, selectionManager, util) {
        super(grid, selectionManager, util);
        this.selectionType = 'cell';
        this.clickedRowIndex = null;
        this.clickedColIndex = null;
    }

    hitTest(pointer, e, mode) {
        if (mode === 'hover') return false;
        return (pointer.x > this.grid.headerWidth && pointer.y > this.grid.headerHeight);
    }

    initDragData(pos) {
        this.clickedRowIndex = this.util.getRowIndexAtY(pos.gridY);
        this.clickedColIndex = this.util.getColIndexAtX(pos.gridX);
    }

    updateSelection() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
        const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
        const startCol = Math.min(this.clickedColIndex, colIndexNow);
        const endCol = Math.max(this.clickedColIndex, colIndexNow);
        this.selectionManager.selection = { type: 'cell', startRow, endRow, startCol, endCol };
        this.selectionManager.selectionType = 'cell';
    }

    hasDraggedEnough() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        return this.clickedRowIndex !== rowIndexNow || this.clickedColIndex !== colIndexNow;
    }

    buildSelectionObject() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
        const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
        const startCol = Math.min(this.clickedColIndex, colIndexNow);
        const endCol = Math.max(this.clickedColIndex, colIndexNow);
        return { type: 'cell', startRow, endRow, startCol, endCol };
    }
}
