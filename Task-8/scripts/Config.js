export class Config {
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
    constructor(totalRows, totalColumns, cellWidth, cellHeight, headerHeight, headerWidth, dpr) {
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
    }
}