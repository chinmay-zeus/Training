import { BaseSelector } from "./BaseSelector.js";

export class ColumnSelector extends BaseSelector {
    constructor(grid, selectionManager, util) {
        super(grid, selectionManager, util);
        this.selectionType = 'multipleCols';
        this.clickedColIndex = null;
    }

    hitTest(pointer, e, mode) {
        if (mode === 'hover') return false;
        return (pointer.y <= this.grid.headerHeight && pointer.x > this.grid.headerWidth);
    }

    initDragData(pos) {
        this.clickedColIndex = this.util.getColIndexAtX(pos.gridX);
    }

    updateSelection() {
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        const startCol = Math.min(this.clickedColIndex, colIndexNow);
        const endCol = Math.max(this.clickedColIndex, colIndexNow);
        this.selectionManager.selection = { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
        this.selectionManager.selectionType = 'multipleCols';
    }

    hasDraggedEnough() {
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        return this.clickedColIndex !== colIndexNow;
    }

    buildSelectionObject() {
        const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);
        const startCol = Math.min(this.clickedColIndex, colIndexNow);
        const endCol = Math.max(this.clickedColIndex, colIndexNow);
        return { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
    }
}
