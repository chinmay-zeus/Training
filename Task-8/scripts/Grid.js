import { Row } from "./Row.js";
import { Column } from "./Column.js";

export class Grid {

    /**
     * 
     * @param {HTMLCanvasElement} canvas - canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
     * @param {number} viewWidth
     * @param {number} viewHeight
     * @param {number} totalRows Total rows to be rendered
     * @param {number} totalColumns Total columns to be rendered
     * @param {number} cellWidth width of each cell
     * @param {number} cellHeight height of each cell
     * @param {number} headerHeight 
     * @param {number} headerWidth 
     * @param {number} dpr device pixel ratio for the correction
     */
    constructor(canvas, ctx, viewWidth, viewHeight, totalRows, totalColumns, cellWidth, cellHeight, headerHeight, headerWidth, dpr) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        /** @type {number} */
        this.totalRows = totalRows;

        /** @type {number} */
        this.totalColumns = totalColumns;

        /** @type {number} */
        this.cellWidth = cellWidth;

        /** @type {number} */
        this.cellHeight = cellHeight;

        /** @type {number} */
        this.headerHeight = headerHeight;

        /** @type {number} */
        this.headerWidth = headerWidth;

        /** @type {number} */
        this.scale = dpr || 1;

        /** @type {Row[]} */
        this.rows = [];

        /** @type {Column[]} */
        this.columns = [];

        this._createRowsAndColumns();
        this._init(viewWidth, viewHeight);
    }

    /**
     * Initializes row & column data.
     * @private
     */

    _createRowsAndColumns() {
        for (let i = 0; i < this.totalRows; i++) {
            this.rows.push(new Row(i, this.cellHeight));
        }
        for (let j = 0; j < this.totalColumns; j++) {
            this.columns.push(new Column(j, this.cellWidth));
        }
    }

    /**
     * Initializes the canvas size and drawing context.
     * @param {number} viewWidth 
     * @param {number} viewHeight 
     * @private
     */

    _init(viewWidth, viewHeight) {
        this.canvas.width = viewWidth * this.scale;
        this.canvas.height = viewHeight * this.scale;
        this.canvas.style.width = `${viewWidth}px`;
        this.canvas.style.height = `${viewHeight}px`;
        this.ctx.scale(this.scale, this.scale);
        this.ctx.strokeStyle = "#e0e0e0ff";
        this.ctx.lineWidth = 0.5;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.headerBackgroundColor = "#f5f5f5ff";
        this.headerTextColor = "#616161ff";
        this.correctionFactor = 0.5;
    }

    /**
    * Renders only visible part of the grid
    * @param {number} scrollLeft - Horizontal scroll offset
    * @param {number} scrollTop - Vertical scroll offset
    * @param {number} viewWidth - Width of visible area
    * @param {number} viewHeight - Height of visible area
    */

    render(scrollLeft, scrollTop, viewWidth, viewHeight) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-scrollLeft, -scrollTop);

        const startRow = this._findStartRow(scrollTop);
        const endRow = this._findEndRow(scrollTop + viewHeight);
        const startCol = this._findStartCol(scrollLeft);
        const endCol = this._findEndCol(scrollLeft + viewWidth);

        this._renderColumnHeaders(startCol, endCol);
        this._renderRowHeaders(startRow, endRow);
        this._renderGrid(startRow, endRow, startCol, endCol);

        this.ctx.restore();
    }

    /**
     * 
     * @param {number} x - x cordinate of the rectangle
     * @param {number} y - y cordinate of the rectangle
     * @param {number} width - width of the rectangle
     * @param {number} height - height of the rectangle
     * @param {string} text - Cell lable
     */

    _drawHeaderCell(x, y, width, height, text) {
        this.ctx.fillStyle = this.headerBackgroundColor;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = this.headerTextColor;
        this.ctx.fillText(text, x + width / 2, y + height / 2);
    }

    /**
     * 
     * @param {number} startCol - starting column
     * @param {number} endCol - ending column
     */

    _renderColumnHeaders(startCol, endCol) {
        let x = this.headerWidth;
        for (let j = 0; j < startCol; j++) x += this.columns[j].width;

        for (let j = startCol; j <= endCol; j++) {
            const colWidth = this.columns[j].width;
            this.ctx.fillStyle = this.headerBackgroundColor;
            this.ctx.fillRect(x, 0, colWidth, this.headerHeight);

            this.ctx.fillStyle = this.headerTextColor;
            this.ctx.fillText(columnName(j), x + colWidth / 2, this.headerHeight / 2);

            x += colWidth;
        }
    }

    /**
     * 
     * @param {number} startRow - starting row
     * @param {number} endRow - ending row
     */

    _renderRowHeaders(startRow, endRow) {
        let y = this.headerHeight;
        for (let i = 0; i < startRow; i++) {
            y += this.rows[i].height;
        }

        for (let i = startRow; i <= endRow; i++) {
            const rowHeight = this.rows[i].height;
            this.ctx.fillStyle = this.headerBackgroundColor;
            this.ctx.fillRect(0, y, this.headerWidth, rowHeight);

            this.ctx.fillStyle = this.headerTextColor;
            this.ctx.fillText((i + 1).toString(), this.headerWidth / 2, y + rowHeight / 2);

            y += rowHeight;
        }
    }

    /**
     * 
     * @param {number} startRow - The starting row
     * @param {number} endRow - The ending row
     * @param {number} startCol - The starting column
     * @param {number} endCol - The ending column
     */


    _renderGrid(startRow, endRow, startCol, endCol) {
        this._renderGridRows(startRow, endRow, startCol, endCol);
        this._renderGridColumns(startCol, endCol, startRow, endRow);
        this.ctx.stroke();
    }

    /**
     * 
     * @param {number} startRow - The starting row
     * @param {number} endRow - The ending row
     * @param {number} startCol - The starting column
     * @param {number} endCol - The ending column
     */

    _renderGridRows(startRow, endRow, startCol, endCol) {
        this.ctx.beginPath();

        let y = this.headerHeight;

        for (let i = 0; i < startRow; i++) {
            y += this.rows[i].height;
        }

        for (let i = startRow; i <= endRow; i++) {
            const rowHeight = this.rows[i].height;
            let x = this.headerWidth;

            for (let k = 0; k < startCol; k++) {
                x += this.columns[k].width;
            }
            const endX = x + this._sumWidths(startCol, endCol);

            this.ctx.moveTo(0, y + this.correctionFactor);
            this.ctx.lineTo(endX, y + this.correctionFactor);

            y += rowHeight;
        }
    }

    /**
     * 
     * @param {number} startRow - The starting row
     * @param {number} endRow - The ending row
     * @param {number} startCol - The starting column
     * @param {number} endCol - The ending column
     */

    _renderGridColumns(startCol, endCol, startRow, endRow) {
        let x = this.headerWidth;
        for (let j = 0; j < startCol; j++) {
            x += this.columns[j].width;
        }

        for (let j = startCol; j <= endCol; j++) {
            const colWidth = this.columns[j].width;
            let y = this.headerHeight;

            for (let k = 0; k < startRow; k++) {
                y += this.rows[k].height;
            }
            const endY = y + this._sumHeights(startRow, endRow);

            const headerOffset = 10;
            this.ctx.moveTo(x + this.correctionFactor, headerOffset);
            this.ctx.lineTo(x + this.correctionFactor, endY);

            x += colWidth;
        }
    }

    /**
     * Sums column widths.
     * @param {number} startCol 
     * @param {number} endCol 
     * @returns {number}
     * @private
     */

    _sumWidths(startCol, endCol) {
        let sum = 0;
        for (let j = startCol; j <= endCol; j++) sum += this.columns[j].width;
        return sum;
    }

    /**
     * Sums row heights.
     * @param {number} startRow 
     * @param {number} endRow 
     * @returns {number}
     * @private
     */

    _sumHeights(startRow, endRow) {
        let sum = 0;
        for (let i = startRow; i <= endRow; i++) sum += this.rows[i].height;
        return sum;
    }

    /**
     * Finds first visible row index.
     * @param {number} scrollTop 
     * @returns {number}
     * @private
     */

    _findStartRow(scrollTop) {
        let y = this.headerHeight;
        for (let i = 0; i < this.rows.length; i++) {
            if (y + this.rows[i].height > scrollTop) {
                return i;
            }
            y += this.rows[i].height;
        }
        return this.rows.length - 1;
    }

    /**
     * Finds last visible row index.
     * @param {number} scrollBottom 
     * @returns {number}
     * @private
     */

    _findEndRow(scrollBottom) {
        let y = this.headerHeight;
        for (let i = 0; i < this.rows.length; i++) {
            y += this.rows[i].height;
            if (y >= scrollBottom) {
                return i;
            }
        }
        return this.rows.length - 1;
    }

    /**
     * Finds first visible column index.
     * @param {number} scrollLeft 
     * @returns {number}
     * @private
     */

    _findStartCol(scrollLeft) {
        let x = this.headerWidth;
        for (let j = 0; j < this.columns.length; j++) {
            if (x + this.columns[j].width > scrollLeft) return j;
            x += this.columns[j].width;
        }
        return this.columns.length - 1;
    }

    /**
     * Finds last visible column index.
     * @param {number} scrollRight 
     * @returns {number}
     * @private
     */

    _findEndCol(scrollRight) {
        let x = this.headerWidth;
        for (let j = 0; j < this.columns.length; j++) {
            x += this.columns[j].width;
            if (x >= scrollRight) return j;
        }
        return this.columns.length - 1;
    }

    /**
     * Draws green border around selected cell.
     * @param {number} rowIndex
     * @param {number} colIndex
     * @param {number} scrollLeft
     * @param {number} scrollTop
     */
    renderSelection(rowIndex, colIndex, scrollLeft, scrollTop) {
        const cellX = this.getColumnX(colIndex) - scrollLeft;
        const cellY = this.getRowY(rowIndex) - scrollTop;
        const cellWidth = this.columns[colIndex].width;
        const cellHeight = this.rows[rowIndex].height;

        this.ctx.save();
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 1.5; // make it visible like Excel
        this.ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);
        this.ctx.restore();
    }


    /**
     * Computes absolute X coordinate of left edge of a given column.
     * @param {number} colIndex
     * @returns {number}
     */
    getColumnX(colIndex) {
        let x = this.headerWidth;
        for (let i = 0; i < colIndex; i++) {
            x += this.columns[i].width;
        }
        return x;
    }

    /**
     * Computes absolute Y coordinate of top edge of a given row.
     * @param {number} rowIndex
     * @returns {number}
     */
    getRowY(rowIndex) {
        let y = this.headerHeight;
        for (let i = 0; i < rowIndex; i++) {
            y += this.rows[i].height;
        }
        return y;
    }

}

/**
 * Generates Excel-like column name (A, B, ..., AA, AB, etc.)
 * @param {number} index 
 * @returns {string}
 */

function columnName(index) {
    let name = "";

    while (index >= 0) {
        name = String.fromCharCode((index % 26) + 65) + name;
        index = Math.floor(index / 26) - 1;
    }

    return name;
}