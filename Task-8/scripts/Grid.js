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

        for (let i = 0; i < totalRows; i++) {
            this.rows.push(new Row(i, cellHeight));
        }
        for (let j = 0; j < totalColumns; j++) {
            this.columns.push(new Column(j, cellWidth));
        }

        this._init(viewWidth, viewHeight);
    }

    /**
    * Initializes the rows and columns arrays.
    */

    _init(viewWidth, viewHeight) {
        for (let i = 0; i < this.totalRows; i++) {
            this.rows.push(new Row(i, this.cellHeight));
        }
        for (let j = 0; j < this.totalColumns; j++) {
            this.columns.push(new Column(j, this.cellWidth));
        }

        this.canvas.width = viewWidth * this.scale;
        this.canvas.height = viewHeight * this.scale;
        this.canvas.style.width = `${viewWidth}px`;
        this.canvas.style.height = `${viewHeight}px`;
        this.ctx.scale(this.scale, this.scale);
        this.ctx.strokeStyle = "#e0e0e0ff";
        this.ctx.lineWidth = 0.1;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.headerBackgroundColor = "#f5f5f5ff";
        this.headerTextColor = "#616161ff";
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
        this.ctx.beginPath();

        const startRow = Math.floor(scrollTop / this.cellHeight);
        const endRow = Math.min(this.totalRows, Math.ceil((scrollTop + viewHeight) / this.cellHeight));
        const startCol = Math.floor(scrollLeft / this.cellWidth);
        const endCol = Math.min(this.totalColumns, Math.ceil((scrollLeft + viewWidth) / this.cellWidth));

        this._renderColumnHeaders(startCol, endCol);
        this._renderRowHeaders(startRow, endRow);
        this._renderGrid(startRow, endRow, startCol, endCol);

        this.ctx.restore();
    }

    _drawHeaderCell(x, y, width, height, text) {
        this.ctx.fillStyle = this.headerBackgroundColor;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = this.headerTextColor;
        this.ctx.fillText(text, x + width / 2, y + height / 2);
    }

    _renderColumnHeaders(startCol, endCol) {
        let x = this.headerWidth;
        for (let j = 0; j < this.columns.length; j++) {
            const col = this.columns[j];
            if (j >= startCol && j <= endCol) {
                const text = columnName(j);
                this._drawHeaderCell(x, 0, col.width, this.headerHeight, text);
            }
            x += col.width;
        }
    }

    _renderRowHeaders(startRow, endRow) {
        let y = this.headerHeight;
        for (let i = 0; i < this.rows.length; i++) {
            const row = this.rows[i];

            if (i >= startRow && i <= endRow) {
                const text = (i + 1).toString(); 
                this._drawHeaderCell(0, y, this.headerWidth, this.cellHeight, text);
            }
            y += row.height;
        }
    }

    _renderGrid(startRow, endRow, startCol, endCol) {
        for (let i = startRow; i <= endRow; i++) {
            const y = i * this.cellHeight + 0.5 + this.headerHeight;
            this.ctx.moveTo(startCol * this.cellWidth, y);
            this.ctx.lineTo(endCol * this.cellWidth + this.headerWidth, y);
            this.ctx.stroke();
        }

        for (let j = startCol; j <= endCol; j++) {
            const x = j * this.cellWidth + 0.5 + this.headerWidth;
            this.ctx.moveTo(x, startRow * this.cellHeight);
            this.ctx.lineTo(x, endRow * this.cellHeight + this.headerHeight);
            this.ctx.stroke();
        }
    }
}

function columnName(index) {
    let name = "";

    while (index >= 0) {
        name = String.fromCharCode((index % 26) + 65) + name;
        index = Math.floor(index / 26) - 1;
    }

    return name;
}