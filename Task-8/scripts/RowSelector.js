import { BaseSelector } from "./BaseSelector.js";

export class RowSelector extends BaseSelector {
    constructor(grid, selectionManager, util) {
        super(grid, selectionManager, util);
        this.selectionType = 'multipleRows';
        this.clickedRowIndex = null;
    }

    hitTest(pointer, e, mode) {
        if (mode === 'hover') return false;
        return (pointer.x <= this.grid.headerWidth && pointer.y > this.grid.headerHeight);
    }

    initDragData(pos) {
        this.clickedRowIndex = this.util.getRowIndexAtY(pos.gridY);
    }

    updateSelection() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
        const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
        this.selectionManager.selection = { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
        this.selectionManager.selectionType = 'multipleRows';
    }

    hasDraggedEnough() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        return this.clickedRowIndex !== rowIndexNow;
    }

    buildSelectionObject() {
        const rowIndexNow = this.util.getRowIndexAtY(this.dragCurrent.gridY);
        const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
        const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
        return { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
    }
}