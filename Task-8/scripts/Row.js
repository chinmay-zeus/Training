export class Row{

    /**
     * 
     * @param {number} index - Row index.
     * @param {number} height - Width of the row.
     */

    constructor(index, height){

        /** @type {number} */
        this.rowIndex = index;

        /** @type {number} */
        this.height = height;
    }
}