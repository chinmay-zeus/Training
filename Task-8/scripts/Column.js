export class Column{

    /**
     * 
     * @param {number} index - Column index.
     * @param {number} width - Width of the column.
     */

    constructor(index, width){

        /** @type {number} */
        this.columnIndex = index;

        /** @type {number} */
        this.width = width;
    }
}