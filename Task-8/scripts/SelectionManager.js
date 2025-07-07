import { Grid } from "./Grid.js";

export class SelectionManager {
    /**
     * @param {Grid} grid - The grid instance
     * @param {HTMLElement} container - The scroll container
     */
    constructor(grid, container) {
        this.grid = grid;
        this.container = container;

        this.selection = null;                // single selection (cell, range, row, column)
        this.selectionType = null;            // 'cell' | 'range' | 'row' | 'column' | null
        this.multiSelections = [];            // for ctrl+click or ctrl+drag

        this.anchorRow = null;
        this.anchorCol = null;

        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
        this.dragType = null;
        this.isCtrl = false;

        this.clickedRowIndex = null;
        this.clickedColIndex = null;

        this._addEventListeners();
    }

    _addEventListeners() {
        this.grid.canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
        window.addEventListener("mouseup", this._onMouseUp.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));
        this.container.addEventListener("scroll", () => this._renderWithSelection());
        window.addEventListener("resize", () => this._renderWithSelection());
    }

    _onMouseDown(e) {
        if (this.grid.canvas.style.cursor === "e-resize" || this.grid.canvas.style.cursor === "n-resize") {
            return;
        }
        this.isCtrl = e.ctrlKey || e.metaKey;
        const pos = this._getMousePos(e);
        this.clickedRowIndex = this._getRowIndexAtY(pos.gridY);
        this.clickedColIndex = this._getColIndexAtX(pos.gridX);

        if (pos.gridY <= this.grid.headerHeight && pos.gridX > this.grid.headerWidth) {
            this.dragType = 'column';
            this.isDragging = true;
            this.dragStart = pos;
            this.dragCurrent = pos;
        }
        else if (pos.gridX <= this.grid.headerWidth && pos.gridY > this.grid.headerHeight) {
            this.dragType = 'row';
            this.isDragging = true;
            this.dragStart = pos;
            this.dragCurrent = pos;
        }
        else if (this.clickedRowIndex !== null && this.clickedColIndex !== null) {
            this.dragType = 'cell';
            this.isDragging = true;
            this.dragStart = pos;
            this.dragCurrent = pos;
        }
    }

    _onMouseMove(e) {
        if (!this.isDragging) {
            return;
        }

        if (this.grid.canvas.style.cursor === "e-resize" || this.grid.canvas.style.cursor === "n-resize") {
            return;
        }

        this.dragCurrent = this._getMousePos(e);

        const colIndexNow = this._getColIndexAtX(this.dragCurrent.gridX);
        const rowIndexNow = this._getRowIndexAtY(this.dragCurrent.gridY);

        if (this.dragType === 'cell' && colIndexNow !== null && rowIndexNow !== null) {
            const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
            const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
            const startCol = Math.min(this.clickedColIndex, colIndexNow);
            const endCol = Math.max(this.clickedColIndex, colIndexNow);

            this.selection = { type: 'cell', startRow, endRow, startCol, endCol };
            this.selectionType = 'cell';
        }
        else if (this.dragType === 'column' && colIndexNow !== null) {
            // When dragging columns, continue selecting columns even if mouse moves outside column header area
            const startCol = Math.min(this.clickedColIndex, colIndexNow);
            const endCol = Math.max(this.clickedColIndex, colIndexNow);

            this.selection = { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
            this.selectionType = 'multipleCols';
        }
        else if (this.dragType === 'row' && rowIndexNow !== null) {
            // When dragging rows, continue selecting rows even if mouse moves outside row header area
            const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
            const endRow = Math.max(this.clickedRowIndex, rowIndexNow);

            this.selection = { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
            this.selectionType = 'multipleRows';
        }

        this._renderWithSelection();
    }

    _onMouseUp(e) {
        if (!this.isDragging) {
            this._handleClickLogic(e);  // normal click
        }
        else {
            const colIndexNow = this._getColIndexAtX(this.dragCurrent.gridX);
            const rowIndexNow = this._getRowIndexAtY(this.dragCurrent.gridY);

            if (this.dragType === 'cell' && colIndexNow !== null && rowIndexNow !== null) {
                const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
                const endRow = Math.max(this.clickedRowIndex, rowIndexNow);
                const startCol = Math.min(this.clickedColIndex, colIndexNow);
                const endCol = Math.max(this.clickedColIndex, colIndexNow);

                const draggedEnough = (startRow !== endRow) || (startCol !== endCol);

                if (draggedEnough) {
                    if (this.isCtrl) {
                        this._toggleMultiSelection({
                            type: 'cell', startRow, endRow, startCol, endCol
                        });
                    }
                    else {
                        this.selection = { type: 'cell', startRow, endRow, startCol, endCol };
                        this.selectionType = 'cell';
                        this.multiSelections = [];
                    }
                } else {
                    // treat as normal click
                    this._handleClickLogic(e);
                }
            }
            else if (this.dragType === 'column' && colIndexNow !== null) {
                // For column drag, continue even if mouse moves outside column header area
                const startCol = Math.min(this.clickedColIndex, colIndexNow);
                const endCol = Math.max(this.clickedColIndex, colIndexNow);

                const draggedEnough = (startCol !== endCol);

                if (draggedEnough) {
                    if (this.isCtrl) {
                        this._toggleMultiSelection({
                            type: 'multipleCols', startColIndex: startCol, endColIndex: endCol
                        });
                    }
                    else {
                        this.selection = { type: 'multipleCols', startColIndex: startCol, endColIndex: endCol };
                        this.selectionType = 'multipleCols';
                        this.multiSelections = [];
                    }
                } else {
                    this._handleClickLogic(e);
                }
            }
            else if (this.dragType === 'row' && rowIndexNow !== null) {
                // For row drag, continue even if mouse moves outside row header area
                const startRow = Math.min(this.clickedRowIndex, rowIndexNow);
                const endRow = Math.max(this.clickedRowIndex, rowIndexNow);

                const draggedEnough = (startRow !== endRow);

                if (draggedEnough) {
                    if (this.isCtrl) {
                        this._toggleMultiSelection({
                            type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow
                        });
                    }
                    else {
                        this.selection = { type: 'multipleRows', startRowIndex: startRow, endRowIndex: endRow };
                        this.selectionType = 'multipleRows';
                        this.multiSelections = [];
                    }
                } else {
                    this._handleClickLogic(e);
                }
            }
            else {
                // Drag ended outside valid area, treat as normal click
                this._handleClickLogic(e);
            }

            this._renderWithSelection();
        }

        this.isDragging = false;
        this.dragStart = null;
        this.dragCurrent = null;
    }

    _handleClickLogic(e) {
        if (this.grid.canvas.style.cursor === "e-resize" || this.grid.canvas.style.cursor === "n-resize") {
            return;
        }
        const pos = this._getMousePos(e);
        const x = pos.gridX;
        const y = pos.gridY;
        const isCtrl = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;

        // Clicked on row header
        if (x <= this.grid.headerWidth && y > this.grid.headerHeight) {
            const rowIndex = this._getRowIndexAtY(y);
            if (rowIndex !== null) {
                if (isCtrl) {
                    this._toggleMultiSelection({ type: 'row', rowIndex });
                } else if (isShift && this.selection?.type === 'row') {
                    const start = Math.min(this.selection.selectedRows[0], rowIndex);
                    const end = Math.max(this.selection.selectedRows[0], rowIndex);
                    this.selection = { type: 'row', selectedRows: Array.from({ length: end - start + 1 }, (_, i) => start + i) };
                    this.selectionType = 'row';
                } else {
                    this.selection = { type: 'row', selectedRows: [rowIndex] };
                    this.selectionType = 'row';
                    this.multiSelections = [];
                }
                this._renderWithSelection();
                return;
            }
        }

        // Clicked on column header
        if (y <= this.grid.headerHeight && x > this.grid.headerWidth) {
            const colIndex = this._getColIndexAtX(x);
            if (colIndex !== null) {
                if (isCtrl) {
                    this._toggleMultiSelection({ type: 'column', colIndex });
                } else if (isShift && this.selection?.type === 'column') {
                    const start = Math.min(this.selection.selectedCols[0], colIndex);
                    const end = Math.max(this.selection.selectedCols[0], colIndex);
                    this.selection = { type: 'column', selectedCols: Array.from({ length: end - start + 1 }, (_, i) => start + i) };
                    this.selectionType = 'column';
                } else {
                    this.selection = { type: 'column', selectedCols: [colIndex] };
                    this.selectionType = 'column';
                    this.multiSelections = [];
                }
                this._renderWithSelection();
                return;
            }
        }

        // Normal cell click
        const rowIndex = this._getRowIndexAtY(y);
        const colIndex = this._getColIndexAtX(x);
        if (rowIndex !== null && colIndex !== null) {
            if (isCtrl) {
                this._toggleMultiSelection({ type: 'cell', startRow: rowIndex, endRow: rowIndex, startCol: colIndex, endCol: colIndex });
            } else if (isShift && this.selection?.type === 'cell') {
                const startRow = Math.min(this.selection.startRow, rowIndex);
                const endRow = Math.max(this.selection.endRow, rowIndex);
                const startCol = Math.min(this.selection.startCol, colIndex);
                const endCol = Math.max(this.selection.endCol, colIndex);
                this.selection = { type: 'cell', startRow, startCol, endRow, endCol };
                this.selectionType = 'cell';
            } else {
                this.selection = { type: 'cell', startRow: rowIndex, startCol: colIndex, endRow: rowIndex, endCol: colIndex };
                this.selectionType = 'cell';
                this.multiSelections = [];
            }
            this._renderWithSelection();
        }
    }

    _toggleMultiSelection(sel) {
        const index = this.multiSelections.findIndex(s =>
            s.type === sel.type &&
            (
                (s.type === 'row' && s.rowIndex === sel.rowIndex) ||
                (s.type === 'column' && s.colIndex === sel.colIndex) ||
                (s.type === 'cell' && s.startRow === sel.startRow && s.startCol === sel.startCol && s.endRow === sel.endRow && s.endCol === sel.endCol) ||
                (s.type === 'multipleCols' && s.startColIndex === sel.startColIndex && s.endColIndex === sel.endColIndex) ||
                (s.type === 'multipleRows' && s.startRowIndex === sel.startRowIndex && s.endRowIndex === sel.endRowIndex)
            )
        );
        if (index !== -1) {
            this.multiSelections.splice(index, 1);
        } else {
            this.multiSelections.push(sel);
        }
    }

    _getMousePos(e) {
        const rect = this.grid.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + this.container.scrollLeft;
        const y = e.clientY - rect.top + this.container.scrollTop;
        return { gridX: x, gridY: y };
    }

    _getColIndexAtX(gridX) {
        let x = this.grid.headerWidth;
        for (let i = 0; i < this.grid.columns.length; i++) {
            const w = this.grid.columns[i].width;
            if (gridX >= x && gridX < x + w) return i;
            x += w;
        }
        return null;
    }

    _getRowIndexAtY(gridY) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            const h = this.grid.rows[i].height;
            if (gridY >= y && gridY < y + h) return i;
            y += h;
        }
        return null;
    }

    _renderWithSelection() {
        this.grid.render(this.container.scrollLeft, this.container.scrollTop, this.container.clientWidth, this.container.clientHeight);
        if (this.selection) this.renderSelection();
    }

    renderSelection() {
        const ctx = this.grid.ctx;
        ctx.save();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 1.5;

        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;

        switch (this.selectionType) {
            case 'cell':
                {
                    this._renderRangeSelection(scrollLeft, scrollTop, this.selection);
                    break;
                }

            case 'row':
                {
                    this.selection.selectedRows.forEach(r => this._renderRowSelection(scrollLeft, scrollTop, r, r));
                    break;
                }

            case 'column':
                {
                    this.selection.selectedCols.forEach(c => this._renderColSelection(scrollLeft, scrollTop, c, c));
                    break;
                }

            case 'multipleCols':
                {
                    this._renderColSelection(scrollLeft, scrollTop, this.selection.startColIndex, this.selection.endColIndex);
                    break;
                }

            case 'multipleRows':
                {
                    this._renderRowSelection(scrollLeft, scrollTop, this.selection.startRowIndex, this.selection.endRowIndex);
                    break;
                }
        }

        this.multiSelections.forEach(sel => {
            if (sel.type === 'cell') this._renderRangeSelection(scrollLeft, scrollTop, sel);
            if (sel.type === 'row') this._renderRowSelection(scrollLeft, scrollTop, sel.rowIndex, sel.rowIndex);
            if (sel.type === 'column') this._renderColSelection(scrollLeft, scrollTop, sel.colIndex, sel.colIndex);
            if (sel.type === 'multipleCols') this._renderColSelection(scrollLeft, scrollTop, sel.startColIndex, sel.endColIndex);
            if (sel.type === 'multipleRows') this._renderRowSelection(scrollLeft, scrollTop, sel.startRowIndex, sel.endRowIndex);
        });

        ctx.restore();
    }

    _renderRangeSelection(scrollLeft, scrollTop, sel) {
        const start = this.grid.getCellRect(sel.startRow, sel.startCol);
        const end = this.grid.getCellRect(sel.endRow, sel.endCol);
        const x = Math.min(start.x, end.x) - scrollLeft;
        const y = Math.min(start.y, end.y) - scrollTop;
        const width = Math.max(start.x + start.width, end.x + end.width) - Math.min(start.x, end.x);
        const height = Math.max(start.y + start.height, end.y + end.height) - Math.min(start.y, end.y);
        this.grid.ctx.strokeRect(x, y, width, height);
    }

    _renderRowSelection(scrollLeft, scrollTop, startRowIndex, endRowIndex) {
        const selectionRect = this.grid.getRowRect(startRowIndex, endRowIndex);

        this.grid.ctx.fillStyle = "#107d41ff";
        this.grid.ctx.fillRect(0, selectionRect.y - scrollTop, this.grid.headerWidth, selectionRect.height);

        this.grid.ctx.fillStyle = "#f0ffffff";
        for (let i = startRowIndex; i <= endRowIndex; i++) {
            const c = this.grid.getRowRect(i, i);
            this.grid.ctx.fillText(i+1, this.grid.headerWidth / 2 , c.y + c.height / 2 - scrollTop);
        }

        this.grid.ctx.strokeRect(selectionRect.x - scrollLeft, selectionRect.y - scrollTop, selectionRect.width, selectionRect.height);
    }

    _renderColSelection(scrollLeft, scrollTop, startColIndex, endColIndex) {
        const selectionRect = this.grid.getColRect(startColIndex, endColIndex);

        this.grid.ctx.fillStyle = "#107d41ff";
        this.grid.ctx.fillRect(selectionRect.x - scrollLeft, 0, selectionRect.width, this.grid.headerHeight);

        this.grid.ctx.fillStyle = "#f0ffffff";
        for (let i = startColIndex; i <= endColIndex; i++) {
            const c = this.grid.getColRect(i, i);
            this.grid.ctx.fillStyle = "#e0e0e0ff";
            this.grid.ctx.beginPath();
            this.grid.ctx.moveTo(c.x + c.width - scrollLeft, 0)
            this.grid.ctx.lineTo(c.x + c.width - scrollLeft, this.grid.headerHeight)
            this.grid.ctx.stroke();
            this.grid.ctx.fillText(this.grid.columnName(i), c.x + c.width / 2 - scrollLeft, this.grid.headerHeight / 2);
        }

        this.grid.ctx.strokeRect(selectionRect.x - scrollLeft, selectionRect.y - scrollTop, selectionRect.width, selectionRect.height);
        this.grid.ctx.fillStyle = "rgba(233, 242, 237, 0.2)";
        this.grid.ctx.fillRect(selectionRect.x - scrollLeft, selectionRect.y - scrollTop + this.grid.headerHeight, selectionRect.width, selectionRect.height);
    }
}