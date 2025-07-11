import { SelectionManager2 } from './SelectionManager2.js';
import { Util } from './Util.js';

export class BaseSelector {
    /**
     * Base class for selectors that handle pointer events for selection.
     * @param {Grid} grid - The grid instance
     * @param {HTMLElement} container - The scroll container
     * @param {SelectionManager2} selectionManager - The selection manager instance.
     * @param {Util} util - Utility functions for mouse position and other operations.
     */
    constructor(grid, selectionManager, util) {
        this.grid = grid;
        this.selectionManager = selectionManager;
        this.util = util;
        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
        this.dragType = null;
    }

    onMouseDown(e) {
        const pos = this.util.getMousePos(e);
        this.selectionManager.isCtrl = e.ctrlKey || e.metaKey;
        this.isDragging = true;
        this.dragStart = pos;
        this.dragCurrent = pos;
        this.initDragData(pos); 
    }

    onMouseMove(e) {
        if (!this.isDragging) {
            return;
        }
        this.dragCurrent = this.util.getMousePos(e);
        this.updateSelection();
        this.selectionManager.renderWithSelection();
    }

    onMouseUp(e) {
        if (!this.isDragging) {
            this.selectionManager.handleClickLogic(e);
        } else {
            this.dragCurrent = this.util.getMousePos(e);
            const draggedEnough = this.hasDraggedEnough(); 

            if (draggedEnough) {
                if (this.selectionManager.isCtrl) {
                    this.selectionManager.toggleMultiSelection(this.buildSelectionObject());
                } else {
                    this.selectionManager.selection = this.buildSelectionObject();
                    this.selectionManager.selectionType = this.selectionType;
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
