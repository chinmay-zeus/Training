    import { Grid } from "./Grid.js";
    import { SelectionManager2 } from "./SelectionManager2.js";
    import { Util } from "./Util.js";

    export class ColumnSelector {
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

            this.clickedColIndex = null;
        }

        hitTest(pointer, e, mode) {
            if (mode === 'hover') {
                return false;
            }
            return (pointer.y <= this.grid.headerHeight && pointer.x > this.grid.headerWidth);
        }

        onMouseDown(e) {
            this.selectionManager.isCtrl = e.ctrlKey || e.metaKey;
            const pos = this.util.getMousePos(e);
            this.clickedColIndex = this.util.getColIndexAtX(pos.gridX);

                this.dragType = 'col';
                this.isDragging = true;
                this.dragStart = pos;
                this.dragCurrent = pos;
        }

        onMouseMove(e) {
            if (!this.isDragging) {
                return;
            }

            this.dragCurrent = this.util.getMousePos(e);
            const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);

            if (this.dragType === 'col' && colIndexNow !== null) {
                const startCol = Math.min(this.clickedColIndex, colIndexNow);
                const endCol = Math.max(this.clickedColIndex, colIndexNow);

                this.selectionManager.selection = { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
                this.selectionManager.selectionType = 'multipleCols';
            }

            this.selectionManager.renderWithSelection();
        }

        onMouseUp(e) {
            if (!this.isDragging) {
                this.selectionManager.handleClickLogic(e)
            }

            else {
                const colIndexNow = this.util.getColIndexAtX(this.dragCurrent.gridX);

                if (this.dragType === 'col' && colIndexNow !== null) {
                    const startCol = Math.min(this.clickedColIndex, colIndexNow);
                    const endCol = Math.max(this.clickedColIndex, colIndexNow);

                    const draggedEnough = (startCol !== endCol);

                    if (draggedEnough) {
                        if (this.selectionManager.isCtrl) {
                            this.selectionManager.toggleMultiSelection({
                                type: 'multipleCols', startColIndex: startCol, endColIndex: endCol
                            });
                        }
                        else {
                            this.selectionManager.selection = { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
                            this.selectionManager.selectionType = 'multipleCols';
                            this.selectionManager.multiSelections = [];
                        }
                    } else {
                        this.selectionManager.handleClickLogic(e);
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