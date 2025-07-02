import { Grid } from "./Grid.js";

/**
 * Handles user interactions like cell selection.
 */
export class SelectionManager {
    /**
     * @param {Grid} grid - The grid instance
     * @param {HTMLElement} container - The scroll container
     */
    constructor(grid, container) {
        /** @type {Grid} */
        this.grid = grid;

        /** @type {HTMLElement} */
        this.container = container;

        /** @type {number|null} */
        this.selectedRowIndex = null;

        /** @type {number|null} */
        this.selectedColIndex = null;

        this._addEventListeners();
    }

    /**
     * Adds click event listener to canvas.
     * @private
     */
    _addEventListeners() {
        this.grid.canvas.addEventListener("click", this._onClick.bind(this));

        // Re-render selection on scroll or resize
        this.container.addEventListener("scroll", this._renderGrid.bind(this));
        window.addEventListener("resize", this._renderGrid.bind(this));
    }

    /**
     * Handles cell click to select cell.
     * @param {MouseEvent} e 
     * @private
     */
    _onClick(e) {
        const rect = this.grid.canvas.getBoundingClientRect();
        const viewX = e.clientX - rect.left;
        const viewY = e.clientY - rect.top;

        const gridX = viewX + this.container.scrollLeft;
        const gridY = viewY + this.container.scrollTop;

        const colIndex = this._getColIndexAtX(gridX);
        const rowIndex = this._getRowIndexAtY(gridY);

        if (colIndex !== null && rowIndex !== null) {
            this.selectedColIndex = colIndex;
            this.selectedRowIndex = rowIndex;
            this._renderGrid();
        }
    }

    /**
     * Computes column index based on absolute X coordinate.
     * @param {number} gridX 
     * @returns {number|null}
     * @private
     */
    _getColIndexAtX(gridX) {
        let x = this.grid.headerWidth;
        for (let i = 0; i < this.grid.columns.length; i++) {
            const colWidth = this.grid.columns[i].width;
            if (gridX >= x && gridX < x + colWidth) {
                return i;
            }
            x += colWidth;
        }
        return null;
    }

    /**
     * Computes row index based on absolute Y coordinate.
     * @param {number} gridY 
     * @returns {number|null}
     * @private
     */
    _getRowIndexAtY(gridY) {
        let y = this.grid.headerHeight;
        for (let i = 0; i < this.grid.rows.length; i++) {
            const rowHeight = this.grid.rows[i].height;
            if (gridY >= y && gridY < y + rowHeight) {
                return i;
            }
            y += rowHeight;
        }
        return null;
    }

    /**
     * Renders grid and selection.
     * @private
     */
    _renderGrid() {
        this.grid.render(
            this.container.scrollLeft,
            this.container.scrollTop,
            this.container.clientWidth,
            this.container.clientHeight
        );

        if (this.selectedRowIndex !== null && this.selectedColIndex !== null) {
            this.grid.renderSelection(
                this.selectedRowIndex,
                this.selectedColIndex,
                this.container.scrollLeft,
                this.container.scrollTop
            );
        }
    }
}
