import { Row } from "./Row.js";
import { Column } from "./Column.js";

export class Grid {

    /**
     * 
     * @param {HTMLCanvasElement} canvas - canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
     * @param {number} totalRows Total rows to be rendered
     * @param {number} totalColumns Total columns to be rendered
     * @param {number} cellWidth width of each cell
     * @param {number} cellHeight height of each cell
     * @param {number} headerHeight 
     * @param {number} headerWidth 
     * @param {number} dpr device pixel ratio for the correction
     */
    constructor(canvas, ctx, totalRows, totalColumns, cellWidth, cellHeight, headerHeight, headerWidth, dpr) {
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

        this._init();
    }

    /**
     * Initialize rows and columns array and canvas height and width.
     */
    _init() {
        const container = document.querySelector(".container");

        for (let rowi = 0; rowi < this.totalRows; rowi++) {
            this.rows.push(new Row(rowi, this.cellHeight));
        }

        for (let coli = 0; coli < this.totalColumns; coli++) {
            this.columns.push(new Column(coli, this.cellWidth));
        }

        this.canvas.width = container.clientWidth * this.scale;
        this.canvas.height = container.clientHeight * this.scale;
        this.canvas.style.width = `${container.clientWidth}px`;
        this.canvas.style.height = `${container.clientHeight}px`;

        this.ctx.scale(this.scale, this.scale);
        this.ctx.strokeStyle = "#e0e0e0ff";
        this.ctx.lineWidth = 0.1;
        this.ctx.textBaseline = "middle";
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

        for (let i = startRow; i <= endRow; i++) {
            const y = i * this.cellHeight + 0.5 + this.headerHeight;
            this.ctx.moveTo(startCol * this.cellWidth, y);
            this.ctx.lineTo(endCol * this.cellWidth, y);
            this.ctx.stroke();
        }

        for (let j = startCol; j <= endCol; j++) {
            const x = j * this.cellWidth + 0.5 + this.headerWidth;
            this.ctx.moveTo(x, startRow * this.cellHeight);
            this.ctx.lineTo(x, endRow * this.cellHeight);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}