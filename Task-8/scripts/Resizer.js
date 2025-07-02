/**
 * Supports column and row resizing in the Excel clone.
 * Uses mouse events to detect drag on header borders.
 */
export class Resizer {
    /**
     * @param {Grid} grid - The grid instance
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {HTMLElement} container - Scroll container
     */
    constructor(grid, selectionManager, canvas, container) {
        this.grid = grid;
        this.selectionManager = selectionManager;
        this.canvas = canvas;
        this.container = container;

        this.isResizingCol = false;
        this.isResizingRow = false;
        this.resizingColIndex = null;
        this.resizingRowIndex = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.RESIZE_MARGIN = 5;

        this._addEventListeners();
    }

    /**
     * Adds mouse event listeners.
     * @private
     */
    _addEventListeners() {
        this.canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
        window.addEventListener("mouseup", this._onMouseUp.bind(this));
    }

    /**
     * Handles mouse move for resize hover & dragging.
     * @param {MouseEvent} e 
     * @private
     */
    _onMouseMove(e) {
        const { x, y, gridX, gridY } = this._getMousePos(e);

        if (!this.isResizingCol && !this.isResizingRow) {
            let hoverColIndex = null;
            let hoverRowIndex = null;

            if (gridY <= this.grid.headerHeight) {
                hoverColIndex = this._getColIndexNearBorder(gridX);
            }
            if (gridX <= this.grid.headerWidth) {
                hoverRowIndex = this._getRowIndexNearBorder(gridY);
            }

            if (hoverColIndex !== null) {
                this.canvas.style.cursor = "col-resize";
            } else if (hoverRowIndex !== null) {
                this.canvas.style.cursor = "row-resize";
            } else {
                this.canvas.style.cursor = "default";
            }

        } else if (this.isResizingCol) {
            const dx = x - this.startX;
            const newWidth = Math.max(20, this.startWidth + dx);
            this.grid.columns[this.resizingColIndex].width = newWidth;
            this._renderGrid();

        } else if (this.isResizingRow) {
            const dy = y - this.startY;
            const newHeight = Math.max(10, this.startHeight + dy);
            this.grid.rows[this.resizingRowIndex].height = newHeight;
            this._renderGrid();
        }
    }

    /**
     * Handles mouse down to start resize.
     * @param {MouseEvent} e 
     * @private
     */
    _onMouseDown(e) {
        const { x, y, gridX, gridY } = this._getMousePos(e);
        let colIndex = null;
        let rowIndex = null;

        if (gridY <= this.grid.headerHeight) {
            colIndex = this._getColIndexNearBorder(gridX);
        }
        if (gridX <= this.grid.headerWidth) {
            rowIndex = this._getRowIndexNearBorder(gridY);
        }

        if (colIndex !== null) {
            this.isResizingCol = true;
            this.resizingColIndex = colIndex;
            this.startX = x;
            this.startWidth = this.grid.columns[colIndex].width;

        } else if (rowIndex !== null) {
            this.isResizingRow = true;
            this.resizingRowIndex = rowIndex;
            this.startY = y;
            this.startHeight = this.grid.rows[rowIndex].height;
        }
    }

    /**
     * Handles mouse up to stop resizing.
     * @private
     */
    _onMouseUp() {
        this.isResizingCol = false;
        this.isResizingRow = false;
    }

    /**
     * Get mouse position relative to grid.
     * @param {MouseEvent} e 
     * @returns {{x:number, y:number, gridX:number, gridY:number}}
     * @private
     */
    _getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gridX = x + this.container.scrollLeft;
        const gridY = y + this.container.scrollTop;
        return { x, y, gridX, gridY };
    }

    /**
     * Find column index near border.
     * @param {number} mouseX 
     * @returns {number|null}
     * @private
     */
    _getColIndexNearBorder(mouseX) {
        let x = this.grid.headerWidth;
        for (let i = 0; i < this.grid.columns.length; i++) {
            x += this.grid.columns[i].width;
            if (Math.abs(mouseX - x) < this.RESIZE_MARGIN) return i;
        }
        return null;
    }

    /**
     * Find row index near border.
     * @param {number} mouseY 
     * @returns {number|null}
     * @private
     */
    _getRowIndexNearBorder(mouseY) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            y += this.grid.rows[i].height;
            if (Math.abs(mouseY - y) < this.RESIZE_MARGIN) return i;
        }
        return null;
    }

    /**
     * Renders grid at current scroll.
     * @private
     */
    _renderGrid() {
        this.grid.render(
            this.container.scrollLeft,
            this.container.scrollTop,
            this.container.clientWidth,
            this.container.clientHeight
        );
        this.grid.renderSelection(this.selectionManager.selectedRowIndex, this.selectionManager.selectedColIndex, this.container.scrollLeft, this.container.scrollTop);
    }
}
